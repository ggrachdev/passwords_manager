<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Role;
use App\Utils\Api\Response\ApiResponse;
use App\Form\AddRoleFormType;
use Symfony\Component\HttpFoundation\Request;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Form\ChangeRoleFormType;

class RolesApiController extends AbstractController {

    /**
     * @Route("/api/roles/add/", name="roles_api_add")
     */
    public function add(Request $request): Response {

        $apiResponse = new ApiResponse();

        try {

            if (!$this->isGranted('ROLE_ADMIN')) {
                throw new AccessDeniedException('Has not access');
            }

            $newRole = new Role();

            $addRoleForm = $this->createForm(AddRoleFormType::class, $newRole);
            $addRoleForm->handleRequest($request);

            if (!$addRoleForm->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$addRoleForm->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($addRoleForm));
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($newRole);
            $em->flush();

            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }


        return $apiResponse->generate();
    }

    /**
     * @Route("/api/roles/remove/{key}/", name="roles_api_remove")
     */
    public function removeUser($key): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {
            $em = $this->getDoctrine()->getManager();
            $roleRepository = $em->getRepository(Role::class);
            $roleForRemove = $roleRepository->find($key);

            if ($roleForRemove != null) {
                $em->remove($roleForRemove);
                $em->flush();
                $apiResponse->setSuccess();
            } else {
                $apiResponse->setFail();
                $apiResponse->setErrors("User with id = $key not found");
            }
        } else {
            $apiResponse->setFail();
            $apiResponse->setErrors('Has not access');
        }

        return $apiResponse->generate();
    }
    /**
     * Изменение данных пользователя
     * @Route("/api/roles/update/{key}/", name="roles_api_change")
     */
    public function changeRole(Request $request, $key): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('ROLE_ADMIN')) {
                throw new AccessDeniedException('Has not access');
            }
            
            $em = $this->getDoctrine()->getManager();
            $roleRepository = $em->getRepository(Role::class);
            $changedRole = $roleRepository->find($key);
            
            if ($changedRole === null) {
                throw new AccessDeniedException("Not found role with key = $key");
            }
            
            $changeForm = $this->createForm(ChangeRoleFormType::class, $changedRole);
            $changeForm->handleRequest($request);
            
            if (!$changeForm->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$changeForm->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($changeForm));
            }
            
            $em->persist($changedRole);
            $em->flush();

            $apiResponse->setSuccess();
                
        } catch (AccessDeniedException $ex) {
            $apiResponse->setFail();
            $apiResponse->setErrors($ex->getMessage());
        }
        
        return $apiResponse->generate();
    }

    /**
     * @Route("/api/roles/get/{id}/", name="roles_api_get")
     */
    public function get($id): Response {

        if ($id === 'all') {
            return $this->forward(self::class.'::getAll');
        }

        $apiResponse = new ApiResponse();

        try {

            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access');
            }

            $em = $this->getDoctrine()->getManager();
            $roleRepository = $em->getRepository(Role::class);
            $role = $roleRepository->find($id);

            if ($role === null) {
                throw new AccessDeniedException("Hot found role with id = $id");
            } else {
                $apiResponse->setSuccess();
                $apiResponse->setData([
                    'role' => [
                        'key' => $role->getRoleKey(),
                        'color' => $role->getColor(),
                        'name' => $role->getName()
                    ]
                ]);
            }
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }



        return $apiResponse->generate();
    }

    /**
     * @Route("/api/roles/get/all/", name="roles_api_get_all")
     */
    public function getAll(): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {

            $em = $this->getDoctrine()->getManager();
            $roleRepository = $em->getRepository(Role::class);
            $rolesDb = $roleRepository->findBy([], ['name' => 'ASC']);

            if ($rolesDb === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Not found roles');
            } else {
                $apiResponse->setSuccess();
                $roles = [];

                foreach ($rolesDb as $role) {
                    $roles[] = [
                        'key' => $role->getRoleKey(),
                        'color' => $role->getColor(),
                        'name' => $role->getName()
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
