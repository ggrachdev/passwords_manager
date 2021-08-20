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

        $tokenProvider = $this->container->get('security.csrf.token_manager');

        $csrfTokens = [];

        if ($userIsAuth) {
            $csrfTokensNeed = [
                'authenticate',
                'add_role_form',
                'add_password_form',
                'add_project_form',
                'add_folder_form',
                'change_password_form',
                'change_folder_form',
                'change_project_form',
                'change_user_form',
                'change_role_form',
                'registration_user_form'
            ];
        } else {
            $csrfTokensNeed = [
                'authenticate'
            ];
        }

        foreach ($csrfTokensNeed as $needToken) {
            $csrfTokens[$needToken] = $tokenProvider->getToken($needToken)->getValue();
        }

        $response = [
            'user_name' => $userName,
            'user_second_name' => $userSecondName,
            'user_middle_name' => $userMiddleName,
            'user_roles' => $userRoles,
            'user_id' => $userId,
            'permissions' => $permissions,
            'user_is_auth' => $userIsAuth,
            'tokens' => $csrfTokens,
            'available_user_ids_for_development_mode' => [4],
            'app_in_development_mode' => false
        ];

        return $this->json($response);
    }

}
