<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Entity\Project;

class ProjectsApiController extends AbstractController {

    /**
     * @Route("/projects/get/all/", name="projects_api_get_all")
     */
    public function getAll(): Response {
         $apiResponse = new ApiResponse();
         
         try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $projectRepository = $em->getRepository(Project::class);
            $projectsDb = $projectRepository->findBy([], ['name' => 'ASC']);
            
            if ($projectsDb === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Not found projects');
            }
            else
            {
                $projects = [];
                
                foreach ($projectsDb as $project) {
                    $projects[] = [
                        'name' => $project->getName(),
                        'id' => $project->getId(),
                        'folders' => [
                            [
                                'name' => 'ФТП',
                                'id' => 123
                            ],
                            [
                                'name' => 'Хостинг',
                                'id' => 123
                            ],
                            [
                                'name' => 'Прочее',
                                'id' => 123
                            ],
                        ]
                    ];
                }
                
                $apiResponse->setSuccess();
                $apiResponse->setData(['projects' => $projects]);
            }
            
         } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
         }



         return $apiResponse->generate();
    }

}
