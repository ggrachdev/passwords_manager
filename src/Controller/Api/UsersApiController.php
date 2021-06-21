<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Utils\Api\Response\ApiResponse;

class UsersApiController extends AbstractController {

    /**
     * @Route("/api/users/get/all", name="users_api_get_all")
     */
    public function index(): Response {
        $apiResponse = new ApiResponse();
        
        $em = $this->getDoctrine()->getManager();
        $userRepository = $em->getRepository(User::class);
        $usersDb = $userRepository->findAll();

        if ($usersDb === null) {
            $apiResponse->setFail();
            $apiResponse->setErrors('Not found users');
        } else {
            $apiResponse->setSuccess();
            $users = [];
            
            foreach ($usersDb as $user) {
                $users[] = [
                    'email' => $user->getEmail()
                ];
            }
            
            $apiResponse->setData(['users' => $users]);
        }

        return $apiResponse->generate();
    }

}
