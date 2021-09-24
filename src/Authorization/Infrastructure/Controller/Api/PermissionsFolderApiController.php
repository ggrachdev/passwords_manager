<?php

namespace App\Authorization\Infrastructure\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Authorization\Domain\User;
use App\Project\Domain\ProjectFolder;
use App\Utils\Permission\ManagerPermission;
use App\Utils\Permission\UserPermission;
use App\Utils\History\HistoryManager;

class PermissionsFolderApiController extends AbstractController {

    private $managerPermission;
    private $managerHistory;

    public function __construct(ManagerPermission $mp, HistoryManager $mh) {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }

    /**
     * @Route("/permissions/folder/toggle/{idFolder}/{idUser}/", requirements={"idFolder"="\d+", "idUser"="\d+"}, name="permissions_folder_toggle")
     */
    public function toggleForFolder(Request $request, $idFolder, $idUser): Response {
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

            if (!$nowUserPermission->canEditFolder($idFolder)) {
                throw new AccessDeniedException('Has not permission edit this folder');
            }

            $folder = $projectFolderRepository->find($idFolder);
            if ($folder === null) {
                throw new AccessDeniedException("Not found folder with id = $idFolder");
            }

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
                foreach (ManagerPermission::LIST_PERMISSIONS_FOLDER as $permission) {
                    $this->managerPermission->addPermissionForFolder($idFolder, $idUser, $permission);
                }

                $this->managerHistory->logToggleProjectFolderPermissionEvent('add_all_permissions', true, $this->getUser(), $userChangedPermission, $folder);
            } else if ($permission === 'remove_all_permissions') {
                // Удалить все права
                foreach (ManagerPermission::LIST_PERMISSIONS_FOLDER as $permission) {
                    $this->managerPermission->removePermissionForFolder($idFolder, $idUser, $permission);
                }

                $this->managerHistory->logToggleProjectFolderPermissionEvent('remove_all_permissions', true, $this->getUser(), $userChangedPermission, $folder);
            } else {
                $hasPermission = $this->managerPermission->togglePermissionForFolder($idFolder, $idUser, $permission);
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
     * @Route("/permissions/folder/get/{idFolder}/", requirements={"idFolder"="\d+"}, name="permissions_folder_get")
     */
    public function getForFolder($idFolder): Response {
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
            if (!$nowUserPermission->canWatchFolder($idFolder)) {
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
                        ))->getPermissionsForFolder($idFolder)
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
