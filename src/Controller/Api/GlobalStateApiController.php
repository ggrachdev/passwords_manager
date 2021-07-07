<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Permission\UserPermission;
use App\Entity\Permission;

class GlobalStateApiController extends AbstractController {

    /**
     * @Route("/api/global_state/get/", name="global_state_api")
     */
    public function index(): Response {
        $userIsAuth = $this->isGranted('IS_AUTHENTICATED_REMEMBERED');
        $userName = null;
        $userSecondName = null;
        $userMiddleName = null;
        $userId = null;
        $userRoles = [];
        
        $permissions = [];

        if ($userIsAuth) {
            $user = $this->getUser();
            $userName = $user->getFirstName();
            $userSecondName = $user->getSecondName();
            $userMiddleName = $user->getMiddleName();
            $userRoles = $user->getRoles();
            $userId = $user->getId();
        
            $em = $this->getDoctrine()->getManager();
            $userPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
            $permissions = $userPermission->getPermissionsGlobal();
            
        }

        $response = [
            'user_name' => $userName,
            'user_second_name' => $userSecondName,
            'user_middle_name' => $userMiddleName,
            'user_roles' => $userRoles,
            'user_id' => $userId,
            'permissions' => $permissions,
            'user_is_auth' => $userIsAuth
        ];

        return $this->json(
            $response
        );
    }

}
