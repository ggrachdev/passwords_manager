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
        return $this->json(
            [
                'user_name' => null,
                'user_id' => null,
                'user_is_auth' => false
            ]
        );
    }
}
