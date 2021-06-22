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
     * @Route("/api/users/remove/{id}/", name="users_api_remove_user")
     */
    public function removeUser($id): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {
            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $userForRemove = $userRepository->find($id);

            if ($userForRemove != null) {
                $em->remove($userForRemove);
                $em->flush();
                $apiResponse->setSuccess();
            } else {
                $apiResponse->setFail();
                $apiResponse->setErrors("User with id = $id not found");
            }
        } else {
            $apiResponse->setFail();
            $apiResponse->setErrors('Has not access');
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/api/users/get/all/", name="users_api_get_all")
     */
    public function getAll(): Response {
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
                        'email' => $user->getEmail(),
                        'id' => $user->getId()
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
