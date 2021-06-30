<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Entity\Project;
use App\Entity\ProjectFolder;
use App\Form\AddProjectFormType;
use App\Form\AddFolderFormType;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\HttpFoundation\Request;

class ProjectsApiController extends AbstractController {

    /**
     * @Route("/projects/add/folder/{project_id}/", name="projects_api_add_folder")
     */
    public function addFolder(Request $request, $project_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $folder = new ProjectFolder();

            $form = $this->createForm(AddFolderFormType::class, $folder);
            $form->handleRequest($request);

            if (!$form->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$form->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($form));
            }

            $em = $this->getDoctrine()->getManager();
            
            $projectRepository = $em->getRepository(Project::class);
            
            $project = $projectRepository->find($project_id);
            
            if($project === null)
            {
                throw new AccessDeniedException("Has found project with id = $project_id");
            }
            
            $folder->setProject($project);
            
            $em->persist($folder);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/projects/add/", name="projects_api_add")
     */
    public function add(Request $request): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $project = new Project();

            $form = $this->createForm(AddProjectFormType::class, $project);
            $form->handleRequest($request);

            if (!$form->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$form->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($form));
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($project);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

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
            } else {
                $projects = [];

                foreach ($projectsDb as $project) {
                    $foldersDb = $project->getProjectFolders();

                    $folders = [];

                    if (!empty($foldersDb)) {
                        foreach ($foldersDb as $folder) {
                            $folders[] = [
                                'name' => $folder->getName(),
                                'id' => $folder->getId()
                            ];
                        };
                    }

                    $projects[] = [
                        'name' => $project->getName(),
                        'id' => $project->getId(),
                        'folders' => $folders
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
