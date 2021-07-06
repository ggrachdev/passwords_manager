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
use App\Utils\Security\Encryption\EncryptionFacade;

class PasswordsApiController extends AbstractController {
    
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
            
            $password->setName($passwordRequest->getName());
            $password->setLogin(EncryptionFacade::encrypt($passwordRequest->getLogin()));
            $password->setPassword(EncryptionFacade::encrypt($passwordRequest->getPassword()));
            $password->setDescription($passwordRequest->getDescription());
            $em->persist($password);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
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
            
            $em->remove($password);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
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
            $em->persist($password);
            $em->flush();
            
            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        } catch (NoSuchPropertyException $exc) {
            $apiResponse->setFail();
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
            $apiResponse->setFail();
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
                $apiResponse->setFail();
                $apiResponse->setErrors("Not found folder with id = $folderId");
            } else {
                
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
                }
                
                $apiResponse->setSuccess();
                $apiResponse->setData([
                    'passwords' => $passwords
                ]);
            }
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }
        
        return $apiResponse->generate();
    }

}
