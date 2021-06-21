<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class AuthApiController extends AbstractController {

    /**
     * @Route("/api/auth/login/", name="app_login")
     */
    public function login(AuthenticationUtils $authenticationUtils): Response {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        $response = [];

        if ($error === null) {
            $response = ['is_success' => true, 'user_login' => $lastUsername];
        } else {
            $response = ['is_success' => false, 'error' => $error];
        }

        return $this->json($response);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout() {
        return $this->redirectToRoute('index');
    }

}
