<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Form\ChangeUserFormType;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Entity\User;
use App\Utils\Permission\ManagerPermission;
use App\Utils\Permission\UserPermission;

class PermissionsApiController extends AbstractController {

    private $managerPermission;

    public function __construct(ManagerPermission $mp) {
        $this->managerPermission = $mp;
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

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            
            if(!$nowUserPermission->canEditProject($project_id))
            {
                throw new AccessDeniedException('Has not permission edit this project');
            }

            $permission = $request->request->get('permission');

            $userChangedPermission = $userRepository->find($user_id);

            if ($userChangedPermission === null) {
                throw new AccessDeniedException('Not found this user');
            }

            if (in_array('ROLE_ADMIN', $userChangedPermission->getRoles())) {
                throw new AccessDeniedException('User is admin');
            }

            $this->managerPermission->togglePermissionForProject($project_id, $user_id, $permission);
            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
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
            $apiResponse->setFail();
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

            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if(!$nowUserPermission->canEditFolder($folder_id))
            {
                throw new AccessDeniedException('Has not permission edit this folder');
            }

            $permission = $request->request->get('permission');
            
            $userChangedPermission = $userRepository->find($user_id);

            if ($userChangedPermission === null) {
                throw new AccessDeniedException('Not found this user');
            }

            if (in_array('ROLE_ADMIN', $userChangedPermission->getRoles())) {
                throw new AccessDeniedException('User is admin');
            }

            $this->managerPermission->togglePermissionForFolder($folder_id, $user_id, $permission);
            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
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
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

}
