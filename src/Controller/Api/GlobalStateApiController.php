<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GlobalStateApiController extends AbstractController
{
    /**
     * @Route("/api/global_state/get", name="global_state_api")
     */
    public function index(): Response
    {
        $userIsAuth = $this->isGranted('IS_AUTHENTICATED_REMEMBERED');
        $userName = null;
        $userId = null;
        
        return $this->json(
            [
                'user_name' => $userName,
                'user_id' => $userId,
                'user_is_auth' => $userIsAuth
            ]
        );
    }
}
