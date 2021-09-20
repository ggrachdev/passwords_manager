<?php

namespace App\Authorization\Infrastructure\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Authorization\Domain\User;
use App\Project\Domain\Project;
use App\Project\Domain\ProjectFolder;
use App\Utils\Permission\ManagerPermission;
use App\Utils\Permission\UserPermission;
use App\Utils\History\HistoryManager;

class PermissionsApiController extends AbstractController {

    private $managerPermission;
    private $managerHistory;

    public function __construct(ManagerPermission $mp, HistoryManager $mh) {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }

    /**
     * @Route("/permissions/project/toggle/{project_id}/{user_id}/", requirements={"project_id"="\d+", "user_id"="\d+"}, name="permissions_project_toggle")
     */
    public function toggleForProject(Request $request, $project_id, $user_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $projectRepository = $em->getRepository(Project::class);

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            
            if(!$nowUserPermission->canEditProject($project_id))
            {
                throw new AccessDeniedException('Has not permission edit this project');
            }
            
            $project = $projectRepository->find($project_id);
            if($project === null)
            {
                throw new AccessDeniedException("Not found project with id = $project_id");
            }

            $permission = $request->request->get('permission');

            $userChangedPermission = $userRepository->find($user_id);

            if ($userChangedPermission === null) {
                throw new AccessDeniedException('Not found this user');
            }

            if (in_array('ROLE_ADMIN', $userChangedPermission->getRoles())) {
                throw new AccessDeniedException('User is admin');
            }
            
            $permissionsList = [
                'can_edit',
                'can_watch',
                'can_remove'
            ];
            
            if ($permission === 'add_all_permissions') {
                // Добавить все права
                foreach ($permissionsList as $permission) {
                    $this->managerPermission->addPermissionForProject($project_id, $user_id, $permission);
                }
                $this->managerHistory->logToggleProjectPermissionEvent('add_all_permissions', true, $this->getUser(), $userChangedPermission, $project);
            } else if ($permission === 'remove_all_permissions') {
                // Удалить все права
                foreach ($permissionsList as $permission) {
                    $this->managerPermission->removePermissionForProject($project_id, $user_id, $permission);
                }
                $this->managerHistory->logToggleProjectPermissionEvent('remove_all_permissions', true, $this->getUser(), $userChangedPermission, $project);
            } else {
                $hasPermission = $this->managerPermission->togglePermissionForProject($project_id, $user_id, $permission);
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
     * @Route("/permissions/project/get/{project_id}/", requirements={"project_id"="\d+"}, name="permissions_project_get")
     */
    public function getForProject($project_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $usersPermissions = [];

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if(!$nowUserPermission->canWatchProject($project_id))
            {
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
                        ))->getPermissionsForProject($project_id)
                    ];
                }
                    
                // @todo
                usort($usersPermissions, function($a, $b) {
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

    /**
     * @Route("/permissions/folder/toggle/{folder_id}/{user_id}/", requirements={"folder_id"="\d+", "user_id"="\d+"}, name="permissions_folder_toggle")
     */
    public function toggleForFolder(Request $request, $folder_id, $user_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $projectFolderRepository = $em->getRepository(ProjectFolder::class);

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            
            if(!$nowUserPermission->canEditFolder($folder_id))
            {
                throw new AccessDeniedException('Has not permission edit this folder');
            }
            
            $folder = $projectFolderRepository->find($folder_id);
            if($folder === null)
            {
                throw new AccessDeniedException("Not found folder with id = $folder_id");
            }

            $permission = $request->request->get('permission');
            
            $userChangedPermission = $userRepository->find($user_id);

            if ($userChangedPermission === null) {
                throw new AccessDeniedException('Not found this user');
            }

            if (in_array('ROLE_ADMIN', $userChangedPermission->getRoles())) {
                throw new AccessDeniedException('User is admin');
            }
            
            
            $permissionsList = [
                'can_edit',
                'can_watch',
                'can_remove',
                'can_add_password',
                'can_edit_passwords',
                'can_remove_passwords'
            ];
            
            if($permission === 'add_all_permissions')
            {
                // Добавить все права
                foreach ($permissionsList as $permission) {
                    $this->managerPermission->addPermissionForFolder($folder_id, $user_id, $permission);
                }
                
                $this->managerHistory->logToggleProjectFolderPermissionEvent('add_all_permissions', true, $this->getUser(), $userChangedPermission, $folder);
            }
            else if($permission === 'remove_all_permissions')
            {
                // Удалить все права
                foreach ($permissionsList as $permission) {
                    $this->managerPermission->removePermissionForFolder($folder_id, $user_id, $permission);
                }
                
                $this->managerHistory->logToggleProjectFolderPermissionEvent('remove_all_permissions', true, $this->getUser(), $userChangedPermission, $folder);
            }
            else
            {
                $hasPermission = $this->managerPermission->togglePermissionForFolder($folder_id, $user_id, $permission);
                $this->managerHistory->logToggleProjectFolderPermissionEvent($permission, $hasPermission, $this->getUser(), $userChangedPermission, $folder);
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
     * @Route("/permissions/folder/get/{folder_id}/", requirements={"folder_id"="\d+"}, name="permissions_folder_get")
     */
    public function getForFolder($folder_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $usersPermissions = [];

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if(!$nowUserPermission->canWatchFolder($folder_id))
            {
                throw new AccessDeniedException('Has not permission edit this folder');
            }

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
                        ))->getPermissionsForFolder($folder_id)
                    ];
                }
                    
                // @todo
                usort($usersPermissions, function($a, $b) {
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
