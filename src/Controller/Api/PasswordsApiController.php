<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Entity\ProjectFolder;

class PasswordsApiController extends AbstractController {

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
                            'login' => $password->getLogin(),
                            'password' => $password->getPassword(),
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
