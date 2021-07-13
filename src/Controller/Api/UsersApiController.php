<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Entity\Role;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Form\ChangeUserFormType;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Utils\Permission\UserPermission;
use App\Entity\Permission;
use App\Utils\Permission\ManagerPermission;
use App\Utils\History\HistoryManager;

class UsersApiController extends AbstractController {

    private $managerPermission;
    private $managerHistory;
    
    public function __construct(ManagerPermission $mp, HistoryManager $mh) 
    {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }

    /**
     * Изменение данных пользователя
     * @Route("/api/users/set/{id}/", requirements={"id"="\d+"}, name="users_api_change_data")
     */
    public function changeDataUser(UserPasswordEncoderInterface $encoder, Request $request, $id): Response {
        $apiResponse = new ApiResponse();
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $nowUser = $this->getUser();

            if ($id != $nowUser->getId()) {
                if (!$this->isGranted('ROLE_ADMIN')) {
                    throw new AccessDeniedException('Has not access');
                }
            }

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $changedUser = $userRepository->find($id);

            if ($changedUser === null) {
                throw new AccessDeniedException("Not found user with id = $id");
            }

            $changeForm = $this->createForm(ChangeUserFormType::class, $changedUser);
            $changeForm->handleRequest($request);

            if (!$changeForm->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$changeForm->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($changeForm));
            }

            if ($request->request->get('change_user_form')['password']) {

                if ($request->request->get('change_user_form')['password'] != $request->request->get('change_user_form')['re_password']) {
                    throw new AccessDeniedException('Passwords not equal');
                }

                $pass = $encoder->encodePassword($changedUser, $request->request->get('change_user_form')['password']);
                $changedUser->setPassword($pass);
            }
            
            if(
                array_key_exists('role', $request->request->get('change_user_form'))
            )
            {
                $newRoles = array_values($request->request->get('change_user_form')['role']);
                $changedUser->setRoles($newRoles);
            }
            else
            {
                $changedUser->setRoles(['ROLE_USER']);
            }
            
            $this->managerHistory->logUpdateUserEvent($this->getUser(), $changedUser);

            $em->persist($changedUser);
            $em->flush();

            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }


        return $apiResponse->generate();
    }

    /**
     * @Route("/api/users/remove/{id}/", requirements={"id"="\d+"}, name="users_api_remove_user")
     */
    public function removeUser($id): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {
            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $userForRemove = $userRepository->find($id);

            if ($userForRemove != null) {
            
                $this->managerHistory->logRemoveUserEvent($this->getUser(), $userForRemove);
                
                // Удаляем все права пользователя
                $this->managerPermission->removeAllForUser($userForRemove->getId());
                
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
     * @Route("/api/users/get/{id}/", requirements={"id"="\d+"} , name="users_api_get_data")
     */
    public function getData($id): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $roleRepository = $em->getRepository(Role::class);
            
            $userPermission = new UserPermission(
                $this->getUser(), $em->getRepository(Permission::class)
            );
            
            if(!$userPermission->canWatchUsers() && $id != $this->getUser()->getId()) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Has not permission');
            }

            $usersDb = [$userRepository->find($id)];
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
                                    'color' => $role->getColor(),
                                    'name' => $role->getName()
                                ];
                            }
                        }
                    }

                    $users[] = [
                        'roles' => $user->getRoles(),
                        'roles_full' => $rolesResponse,
                        'first_name' => $user->getFirstName(),
                        'second_name' => $user->getSecondName(),
                        'middle_name' => $user->getMiddleName(),
                        'email' => $user->getEmail(),
                        'id' => $user->getId()
                    ];
                }

                $apiResponse->setData(['user' => $users[0]]);
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

        if ($this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {

            $em = $this->getDoctrine()->getManager();
            $userRepository = $em->getRepository(User::class);
            $roleRepository = $em->getRepository(Role::class);
            
            $userPermission = new UserPermission(
                $this->getUser(), 
                $em->getRepository(Permission::class)
            );

            $usersDb = $userRepository->findAll();
            $rolesDb = $roleRepository->findAll();

            if ($usersDb === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Not found users');
            } else {
                $apiResponse->setSuccess();
                $users = [];
                
                $canWatchUsers = $userPermission->canWatchUsers();

                foreach ($usersDb as $user) {
                    $rolesResponse = [];
                    $roles = $user->getRoles();
                    
                    if(!$canWatchUsers && $user->getId() != $this->getUser()->getId())
                    {
                        continue;
                    }

                    foreach ($roles as $value) {
                        foreach ($rolesDb as $role) {
                            if ($role->getRoleKey() === $value) {
                                $rolesResponse[] = [
                                    'key' => $value,
                                    'color' => $role->getColor(),
                                    'name' => $role->getName()
                                ];
                            }
                        }
                    }

                    $users[] = [
                        'roles_full' => $rolesResponse,
                        'roles' => $user->getRoles(),
                        'first_name' => $user->getFirstName(),
                        'second_name' => $user->getSecondName(),
                        'middle_name' => $user->getMiddleName(),
                        'email' => $user->getEmail(),
                        'id' => $user->getId()
                    ];
                    
                    // @todo
                    usort($users, function($a, $b) {
                        return $a['second_name'] > $b['second_name'];
                    });
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
