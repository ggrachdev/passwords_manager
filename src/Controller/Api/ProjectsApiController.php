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
use App\Form\ChangeProjectFormType;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\HttpFoundation\Request;

class ProjectsApiController extends AbstractController {

    /**
     * @Route("/projects/add/folder/{project_id}/", requirements={"project_id"="\d+"}, name="projects_api_add_folder")
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

            if ($project === null) {
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
     * @Route("/projects/remove/{project_id}/", requirements={"project_id"="\d+"}, name="projects_api_remove", methods={"GET"})
     */
    public function remove($project_id): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }
            
            $em = $this->getDoctrine()->getManager();
            $projectRepository = $em->getRepository(Project::class);
            $project = $projectRepository->find($project_id);

            if ($project === null) {
                throw new AccessDeniedException("Has found project with id = $project_id");
            }
            
            $em->remove($project);
            $em->flush();
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setFail();
            $apiResponse->setErrors($exc->getMessage());
        }



        return $apiResponse->generate();
    }
    
    /**
     * @Route("/projects/update/{project_id}/", requirements={"project_id"="\d+"}, name="projects_api_update", methods={"POST"})
     */
    public function update(Request $request, $project_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $projectRequest = new Project();

            $form = $this->createForm(ChangeProjectFormType::class, $projectRequest);
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
                throw new AccessDeniedException("Not found project with id = $project_id");
            }
            
            $project->setName($projectRequest->getName());
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
     * @Route("/projects/get/{id}/", name="projects_api_get_from_id")
     */
    public function get($id): Response {
        if ($id === 'all') {
            return $this->forward(self::class . '::getAll');
        }

        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $projectRepository = $em->getRepository(Project::class);
            $project = $projectRepository->find($id);

            if ($project === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors("Not found project with id = $id");
            } else {
                $foldersDb = $project->getProjectFolders();

                $folders = [];

                if (!empty($foldersDb)) {

                    foreach ($foldersDb as $folder) {
                        $folders[] = [
                            'name' => $folder->getName(),
                            'id' => $folder->getId()
                        ];
                    }

                    usort($folders, function ($a, $b) {
                        return ($a['name'] > $b['name']);
                    });
                }

                $apiResponse->setSuccess();
                $apiResponse->setData(['project' => [
                        'name' => $project->getName(),
                        'id' => $project->getId(),
                        'folders' => $folders
                ]]);
            }
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

                        usort($folders, function ($a, $b) {
                            return ($a['name'] > $b['name']);
                        });
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
