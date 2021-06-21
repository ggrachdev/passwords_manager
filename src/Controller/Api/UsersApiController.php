<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Role;
use App\Utils\Api\Response\ApiResponse;

class UsersApiController extends AbstractController {

    /**
     * @Route("/api/users/get/all/", name="users_api_get_all")
     */
    public function index(): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $roleRepository = $em->getRepository(Role::class);

            $usersDb = $userRepository->findAll();
            $rolesDb = $roleRepository->findAll();

            if ($usersDb === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Not found users');
            } else {
                $apiResponse->setSuccess();
                $users = [];

                foreach ($usersDb as $user) {
                    $rolesResponse = [];
                    $roles = $user->getRoles();

                    foreach ($roles as $value) {
                        foreach ($rolesDb as $role) {
                            if ($role->getRoleKey() === $value) {
                                $rolesResponse[] = [
                                    'key' => $value,
                                    'color' => $role->getRoleColor(),
                                    'name' => $role->getRoleName()
                                ];
                            }
                        }
                    }

                    $users[] = [
                        'roles' => $rolesResponse,
                        'first_name' => $user->getFirstName(),
                        'second_name' => $user->getSecondName(),
                        'middle_name' => $user->getMiddleName(),
                        'email' => $user->getEmail()
                    ];
                }

                $apiResponse->setData(['users' => $users]);
            }
        } else {
            $apiResponse->setFail();
            $apiResponse->setErrors('Has not access');
        }

        return $apiResponse->generate();
    }

}
