<?php

namespace App\Authorization\Infrastructure\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Authorization\Domain\User;
use App\Utils\Permission\ManagerPermission;
use App\Utils\Permission\UserPermission;
use App\Utils\History\HistoryManager;
use App\Project\Domain\Repository\ProjectRepositoryInterface;

class PermissionsProjectApiController extends AbstractController {

    private $managerPermission;
    private $managerHistory;

    public function __construct(ManagerPermission $mp, HistoryManager $mh) {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }

    /**
     * @Route("/permissions/project/toggle/{idProject}/{idUser}/", requirements={"idProject"="\d+", "idUser"="\d+"}, name="permissions_project_toggle")
     */
    public function toggleForProject(Request $request, ProjectRepositoryInterface $projectRepository, $idProject, $idUser): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );

            if (!$nowUserPermission->canEditProject($idProject)) {
                throw new AccessDeniedException('Has not permission edit this project');
            }

            $project = $projectRepository->findById($idProject);
            if ($project === null) {
                throw new AccessDeniedException("Not found project with id = $idProject");
            }
            $folders = $project->getProjectFolders();

            $permission = $request->request->get('permission');

            $userChangedPermission = $userRepository->find($idUser);

            if ($userChangedPermission === null) {
                throw new AccessDeniedException('Not found this user');
            }

            if (in_array('ROLE_ADMIN', $userChangedPermission->getRoles())) {
                throw new AccessDeniedException('User is admin');
            }

            if ($permission === 'add_all_permissions') {
                // Добавить все права
                foreach (ManagerPermission::LIST_PERMISSIONS_PROJECT as $permission) {
                    $this->managerPermission->addPermissionForProject($idProject, $idUser, $permission);
                }
                $this->managerHistory->logToggleProjectPermissionEvent('add_all_permissions', true, $this->getUser(), $userChangedPermission, $project);
            } else if ($permission === 'add_watch_permissions_for_children_folders') {
                // Добавить все права на просмотр дочерних папок
                $this->managerPermission->addPermissionForProject($idProject, $idUser, 'can_watch');
                if (!empty($folders)) {
                    foreach ($folders as $folder) {
                        $this->managerPermission->addPermissionForFolder($folder->getId(), $idUser, 'can_watch');
                    }
                    $this->managerHistory->logToggleProjectPermissionEvent($permission, true, $this->getUser(), $userChangedPermission, $project);
                }
            } else if ($permission === 'add_all_permissions_for_children_folders') {
                // Добавить все права для дочерних папок
                if (!empty($folders)) {
                    foreach ($folders as $folder) {
                        foreach (ManagerPermission::LIST_PERMISSIONS_FOLDER as $permissionItem) {
                            $this->managerPermission->addPermissionForFolder($folder->getId(), $idUser, $permissionItem);
                        }
                    }
                    $this->managerHistory->logToggleProjectPermissionEvent($permission, true, $this->getUser(), $userChangedPermission, $project);
                }
            } else if ($permission === 'remove_all_permissions_for_children_folders') {
                // Удалить все права для дочерних папок
                if (!empty($folders)) {
                    foreach ($folders as $folder) {
                        foreach (ManagerPermission::LIST_PERMISSIONS_FOLDER as $permissionItem) {
                            $this->managerPermission->removePermissionForFolder($folder->getId(), $idUser, $permissionItem);
                        }
                    }
                    $this->managerHistory->logToggleProjectPermissionEvent($permission, true, $this->getUser(), $userChangedPermission, $project);
                }
            } else if ($permission === 'remove_all_permissions') {
                // Удалить все права
                foreach (ManagerPermission::LIST_PERMISSIONS_PROJECT as $permissionItem) {
                    $this->managerPermission->removePermissionForProject($idProject, $idUser, $permissionItem);
                }
                $this->managerHistory->logToggleProjectPermissionEvent($permission, true, $this->getUser(), $userChangedPermission, $project);
            } else {
                // Если действие над правами не специфичное, то меняем право передаваемое
                $hasPermission = $this->managerPermission->togglePermissionForProject($idProject, $idUser, $permission);
                $this->managerHistory->logToggleProjectPermissionEvent($permission, $hasPermission, $this->getUser(), $userChangedPermission, $project);
            }

            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/permissions/project/get/{idProject}/", requirements={"idProject"="\d+"}, name="permissions_project_get")
     */
    public function getForProject($idProject): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $usersPermissions = [];

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if (!$nowUserPermission->canWatchProject($idProject)) {
                throw new AccessDeniedException('Has not permission edit this project');
            }

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);

            $users = $userRepository->findAll();

            if (!empty($users)) {
                foreach ($users as $user) {
                    $usersPermissions[] = [
                        'id' => $user->getId(),
                        'first_name' => $user->getFirstName(),
                        'second_name' => $user->getSecondName(),
                        'middle_name' => $user->getMiddleName(),
                        'permissions' => (
                        new UserPermission(
                            $user, $this->managerPermission->getPermissionRepository()
                        ))->getPermissionsForProject($idProject)
                    ];
                }

                // @todo
                usort($usersPermissions, function ($a, $b) {
                    return $a['second_name'] > $b['second_name'];
                });
            }

            $apiResponse->setSuccess();
            $apiResponse->setData(
                [
                    'users' => $usersPermissions
                ]
            );
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

}
