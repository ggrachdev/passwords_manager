<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Request;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\PropertyAccess\Exception\NoSuchPropertyException;
use App\Form\AddPasswordFormType;
use App\Form\ChangePasswordFormType;
use App\Entity\ProjectFolder;
use App\Entity\Password;
use App\Entity\User;
use App\Entity\Permission;
use App\Utils\Security\Encryption\EncryptionFacade;
use App\Utils\Permission\UserPermission;
use App\Utils\Permission\ManagerPermission;
use App\Utils\History\HistoryManager;

class PasswordsApiController extends AbstractController {

    private $managerPermission;
    private $managerHistory;
    
    public function __construct(ManagerPermission $mp, HistoryManager $mh) 
    {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }
    
    /**
     * @Route("/passwords/compromate/user/{id}/", requirements={"id"="\d+"}, name="passwords_api_compromate_for_user", methods={"GET"})
     */
    public function compromatePasswordsForUser($id): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }
            
            $em = $this->getDoctrine()->getManager();
            $usersRepository = $em->getRepository(User::class);
            
            $nowUserPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
            if(!$nowUserPermission->canСompromisePasswordsUsers())
            {
                throw new AccessDeniedException('You can not to compromise users');
            }
            
            $userCompromated = $usersRepository->find($id);
            
            if($userCompromated === null)
            {
                throw new AccessDeniedException("Not found user with id = $id");
            }
            
            $this->managerHistory->logCompromatedUserEvent($this->getUser(), $userCompromated);
            $this->managerPermission->compromatePasswordsForUser($userCompromated);
            
            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }


        return $apiResponse->generate();
    }
    
    /**
     * @Route("/passwords/update/{id}/", requirements={"id"="\d+"}, name="passwords_api_update", methods={"POST"})
     */
    public function update(Request $request, $id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $passwordRequest = new Password();

            $form = $this->createForm(ChangePasswordFormType::class, $passwordRequest);
            $form->handleRequest($request);
            
            if (!$form->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$form->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($form));
            }
            
            $em = $this->getDoctrine()->getManager();
            $passwordRepository = $em->getRepository(Password::class);

            $password = $passwordRepository->find($id);
            
            if($password === null)
            {
                throw new AccessDeniedException("Not found password with id = $id");
            }
            
            $nowUserPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
            if(!$nowUserPermission->canEditPasswordInFolder($password->getFolder()->getId()))
            {
                throw new AccessDeniedException('Has not permission for update password in this folder');
            }
            
            $password->setName($passwordRequest->getName());
            $password->setLogin(EncryptionFacade::encrypt($passwordRequest->getLogin()));
            $password->setPassword(EncryptionFacade::encrypt($passwordRequest->getPassword()));
            $password->setDescription($passwordRequest->getDescription());
            
            if(!empty($request->request->get('change_password_form')['tags']))
            {
                $password->setTags(
                    $request->request->get('change_password_form')['tags']
                );
            }
            else
            {
                $password->setTags([]);
            }
            
            $this->managerHistory->logUpdatePasswordEvent($this->getUser(), $password);
            
            $em->persist($password);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    
    /**
     * @Route("/passwords/remove/{id}/", requirements={"id"="\d+"}, name="passwords_api_remove", methods={"GET"})
     */
    public function remove($id): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }
            
            $em = $this->getDoctrine()->getManager();
            $passwordsRepository = $em->getRepository(Password::class);
            $password = $passwordsRepository->find($id);

            if ($password === null) {
                throw new AccessDeniedException("Not found password with id = $id");
            }
            
            $nowUserPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
            if(!$nowUserPermission->canRemovePasswordInFolder($password->getFolder()->getId()))
            {
                throw new AccessDeniedException('Has not permission for remove password in this folder');
            }
            
            $this->managerHistory->logRemovePasswordEvent($this->getUser(), $password);
            
            $em->remove($password);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/passwords/add/{folderId}/", name="passwords_api_add")
     */
    public function add(Request $request, $folderId): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }
            
            $password = new Password();

            $form = $this->createForm(AddPasswordFormType::class, $password);
            $form->handleRequest($request);
            
            if (!$form->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$form->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($form));
            }

            $em = $this->getDoctrine()->getManager();
            $folderRepository = $em->getRepository(ProjectFolder::class);
            $folder = $folderRepository->find($folderId);
            
            if($folder === null)
            {
                throw new AccessDeniedException("Not found folder with id = $folderId");
            }
            
            $nowUserPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
            if(!$nowUserPermission->canAddPasswordInFolder($folderId))
            {
                throw new AccessDeniedException('Has not permission for add password in this folder');
            }
            
            $password->setFolder($folder);
            $password->setPassword(
                EncryptionFacade::encrypt(
                    $password->getPassword()
                )
            );
            $password->setLogin(
                EncryptionFacade::encrypt(
                    $password->getLogin()
                )
            );
            
            if(!empty($request->request->get('add_password_form')['tags']))
            {
                $password->setTags(
                    $request->request->get('add_password_form')['tags']
                );
            }
            else
            {
                $password->setTags([]);
            }
            
            $em->persist($password);
            $em->flush();
            
            $this->managerHistory->logAddPasswordEvent($this->getUser(), $password);
            
            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (NoSuchPropertyException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/passwords/get/{id}/", name="passwords_api_get")
     */
    public function get($id): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $passwordsRepository = $em->getRepository(Password::class);
            
            $password = $passwordsRepository->find($id);
            
            if($password === null)
            {
                throw new AccessDeniedException("Not found password with id = $id");
            }
            
            $nowUserPermission = new UserPermission(
                $this->getUser(), $em->getRepository(Permission::class)
            );
            if(!$nowUserPermission->canWatchFolder($password->getFolder()->getId()))
            {
                throw new AccessDeniedException('Has not permission for watch this password');
            }
            
            $apiResponse->setSuccess();
            $apiResponse->setData(['password' => [
                'name' => $password->getName(),
                'id' => $password->getId(),
                'tags' => $password->getTags(),
                'login' => EncryptionFacade::decrypt( $password->getLogin() ),
                'password' => EncryptionFacade::decrypt( $password->getPassword() ),
                'description' => $password->getDescription(),
                'folder_id' => $password->getFolder()->getId()
            ]]);
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }



        return $apiResponse->generate();
    }

    /**
     * @Route("/passwords/get/folder/{folderId}/", name="passwords_api_get_for_folder")
     */
    public function getForProjectFolder($folderId): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $projectFolderRepository = $em->getRepository(ProjectFolder::class);
            $folder = $projectFolderRepository->find($folderId);
            
            if ($folder === null) {
                $apiResponse->setErrors("Not found folder with id = $folderId");
            } else {
            
                $nowUserPermission = new UserPermission(
                    $this->getUser(), $em->getRepository(Permission::class)
                );
                if(!$nowUserPermission->canWatchFolder($folderId))
                {
                    throw new AccessDeniedException('Has not permission for watch this passwords');
                }
                
                $passwordsCol = $folder->getPasswords();
                $passwords = [];
                
                if(!empty($passwordsCol)) {
                    
                    foreach ($passwordsCol as $password) {
                        $passwords[] = [
                            'id' => $password->getId(),
                            'name' => $password->getName(),
                            'tags' => $password->getTags(),
                            'login' => EncryptionFacade::decrypt( $password->getLogin() ),
                            'password' => EncryptionFacade::decrypt( $password->getPassword() ),
                            'description' => $password->getDescription(),
                        ];
                    }
                    
                    // @todo
                    usort($passwords, function($a, $b) {
                        return $a['name'] > $b['name'];
                    });
                }
                
                $apiResponse->setSuccess();
                $apiResponse->setData([
                    'passwords' => $passwords
                ]);
            }
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }
        
        return $apiResponse->generate();
    }

}
