<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Role;
use App\Utils\Api\Response\ApiResponse;

class RolesApiController extends AbstractController {

    /**
     * @Route("/api/roles/get/all/", name="roles_api_get_all")
     */
    public function getAll(): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {

            $em = $this->getDoctrine()->getManager();
            $roleRepository = $em->getRepository(Role::class);
            $rolesDb = $roleRepository->findAll();

            if ($rolesDb === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Not found roles');
            } else {
                $apiResponse->setSuccess();
                $roles = [];
                
                foreach ($rolesDb as $role) {
                    $roles[] = [
                        'key' => $role->getRoleKey(),
                        'color' => $role->getRoleColor(),
                        'name' => $role->getRoleName()
                    ];
                }

                $apiResponse->setData(['roles' => $roles]);
            }
        } else {
            $apiResponse->setFail();
            $apiResponse->setErrors('Has not access');
        }

        return $apiResponse->generate();
    }

}
