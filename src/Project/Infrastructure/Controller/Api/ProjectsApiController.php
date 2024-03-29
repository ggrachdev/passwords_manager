<?php

namespace App\Project\Infrastructure\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use App\Project\Domain\Project;
use App\Project\Domain\ProjectFolder;
use App\Authorization\Domain\Permission;
use App\Project\Infrastructure\Form\AddProjectFormType;
use App\Project\Infrastructure\Form\AddFolderFormType;
use App\Project\Infrastructure\Form\ChangeProjectFormType;
use App\Project\Infrastructure\Form\ChangeFolderFormType;
use App\Utils\Form\ErrorsHelper;
use Symfony\Component\HttpFoundation\Request;
use App\Utils\Permission\UserPermission;
use App\Utils\Permission\ManagerPermission;
use App\Utils\History\HistoryManager;
use App\Project\Domain\Repository\ProjectRepositoryInterface;

class ProjectsApiController extends AbstractController {

    private $managerPermission;
    private $managerHistory;
    
    public function __construct(ManagerPermission $mp, HistoryManager $mh) 
    {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }
    
    /**
     * @Route("/projects/add/folder/{project_id}/", requirements={"project_id"="\d+"}, name="projects_api_add_folder")
     */
    public function addFolder(Request $request, ProjectRepositoryInterface $projectRepository, $project_id): Response {
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

            $project = $projectRepository->findById($project_id);

            if ($project === null) {
                throw new AccessDeniedException("Has found project with id = $project_id");
            }
            
            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if(!$nowUserPermission->canEditProject($project->getId()))
            {
                throw new AccessDeniedException('Has not permission for edit this project, so can not create folder');
            }

            $folder->setProject($project);

            $em->persist($folder);
            $em->flush();
            
            $this->managerHistory->logAddProjectFolderEvent($this->getUser(), $folder);
            
            // Если человек создал папку добавляем ему все права для нее
            foreach (ManagerPermission::LIST_PERMISSIONS_FOLDER as $permissionFolder) {
                $this->managerPermission->addPermissionForFolder(
                    $folder->getId(), $this->getUser()->getId(), $permissionFolder
                );
            }

            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
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

            $this->getDoctrine()->getManager()->persist($project)->flush();
            
            $this->managerHistory->logAddProjectEvent($this->getUser(), $project);
            
            foreach (ManagerPermission::LIST_PERMISSIONS_PROJECT as $permissionProject) {
                $this->managerPermission->addPermissionForProject(
                    $project->getId(), $this->getUser()->getId(), $permissionProject
                );
            }

            $apiResponse->setSuccess();
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/folders/remove/{id}/", requirements={"id"="\d+"}, name="folders_api_remove", methods={"GET"})
     */
    public function removeFolder($id): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }
            
            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if(!$nowUserPermission->canRemoveFolder($id))
            {
                throw new AccessDeniedException('Has not permission for remove this folder');
            }
            
            $em = $this->getDoctrine()->getManager();
            $foldersRepository = $em->getRepository(ProjectFolder::class);
            $folder = $foldersRepository->find($id);

            if ($folder === null) {
                throw new AccessDeniedException("Has found folders with id = $id");
            }
            
            $this->managerPermission->removeAllForFolder($folder->getId());
            
            $this->managerHistory->logRemoveProjectFolderEvent($this->getUser(), $folder);
            
            $em->remove($folder);
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
     * @Route("/projects/remove/{project_id}/", requirements={"project_id"="\d+"}, name="projects_api_remove", methods={"GET"})
     */
    public function remove(ProjectRepositoryInterface $projectRepository, $project_id): Response {
        $apiResponse = new ApiResponse();
        
        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }
            
            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            
            if(!$nowUserPermission->canRemoveProject($project_id))
            {
                throw new AccessDeniedException('Has not permission for remove this project');
            }
            
            $em = $this->getDoctrine()->getManager();
            $project = $projectRepository->findById($project_id);
            
            $this->managerHistory->logRemoveProjectEvent($this->getUser(), $project);
            
            $folders = $project->getProjectFolders();
            
            if(!empty($folders)) {
                foreach ($folders as $projectFolder) {
                    $this->managerPermission->removeAllForFolder($projectFolder->getId());
                }
            }
            
            $this->managerPermission->removeAllForProject($project->getId());

            if ($project === null) {
                throw new AccessDeniedException("Has found project with id = $project_id");
            }
            
            $em->remove($project);
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
     * @Route("/folders/update/{folder_id}/", requirements={"folder_id"="\d+"}, name="folder_api_update", methods={"POST"})
     */
    public function updateFolder(Request $request, $folder_id): Response {
        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $folderRequest = new ProjectFolder();

            $form = $this->createForm(ChangeFolderFormType::class, $folderRequest);
            $form->handleRequest($request);
            
            if (!$form->isSubmitted()) {
                throw new AccessDeniedException('Has not data');
            }

            if (!$form->isValid()) {
                throw new AccessDeniedException(ErrorsHelper::getErrorMessages($form));
            }
            
            $em = $this->getDoctrine()->getManager();
            $folderRepository = $em->getRepository(ProjectFolder::class);

            $folder = $folderRepository->find($folder_id);
            
            if($folder === null)
            {
                throw new AccessDeniedException("Not found folder with id = $folder_id");
            }
            
            $folder->setName($folderRequest->getName());
            $em->persist($folder);
            $em->flush();
            
            $this->managerHistory->logUpdateProjectFolderEvent($this->getUser(), $folder);
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }
    
    /**
     * @Route("/projects/update/{project_id}/", requirements={"project_id"="\d+"}, name="projects_api_update", methods={"POST"})
     */
    public function update(Request $request, ProjectRepositoryInterface $projectRepository, $project_id): Response {
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
            $project = $projectRepository->findById($project_id);
            
            if($project === null)
            {
                throw new AccessDeniedException("Not found project with id = $project_id");
            }
            
            $nowUserPermission = new UserPermission(
                $this->getUser(), $this->managerPermission->getPermissionRepository()
            );
            if(!$nowUserPermission->canEditProject($project->getId()))
            {
                throw new AccessDeniedException('Has not permission for edit this project');
            }
            
            $project->setName($projectRequest->getName());
            $em->persist($project);
            $em->flush();
            
            $this->managerHistory->logUpdateProjectEvent($this->getUser(), $project);
            
            $apiResponse->setSuccess();
            
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/folders/get/{id}/", requirements={"project_id"="\d+"}, name="folders_api_get_from_id")
     */
    public function getFolder($id): Response {

        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            
            $userPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
            
            $folderRepository = $em->getRepository(ProjectFolder::class);
            $folder = $folderRepository->find($id);

            if ($folder === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors("Not found folder with id = $id");
            } else {
            
                $nowUserPermission = new UserPermission(
                    $this->getUser(), $this->managerPermission->getPermissionRepository()
                );
                if(!$nowUserPermission->canWatchFolder($folder->getId()))
                {
                    throw new AccessDeniedException('Has not permission for watch this folder');
                }

                $apiResponse->setSuccess();
                $apiResponse->setData(['folder' => [
                    'name' => $folder->getName(),
                    'id' => $folder->getId(),
                    'permissions' => $userPermission->getPermissionsForFolder($folder->getId())
                ]]);
            }
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

    /**
     * @Route("/projects/get/{id}/", name="projects_api_get_from_id")
     */
    public function getFromId(ProjectRepositoryInterface $projectRepository, $id): Response {
        if ($id === 'all') {
            return $this->forward(self::class . '::getAll');
        }

        $apiResponse = new ApiResponse();

        try {
            if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
                throw new AccessDeniedException('Has not access. Need auth');
            }

            $em = $this->getDoctrine()->getManager();
            $project = $projectRepository->findById($id);

            if ($project === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors("Not found project with id = $id");
            } else {
            
                $userPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
                            
                if (
                    !$userPermission->canWatchProject(
                        $project->getId()
                    )
                ) {
                    throw new AccessDeniedException('Has not access for you');
                }
                        
                $foldersDb = $project->getProjectFolders();

                $folders = [];

                if (!empty($foldersDb)) {

                    foreach ($foldersDb as $folder) {
                            
                        if (
                            !$userPermission->canWatchFolder(
                                $folder->getId()
                            )
                        ) {
                            continue;
                        }
                            
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
                    'folders' => $folders,
                    'permissions' => $userPermission->getPermissionsForProject($project->getId())
                ]]);
            }
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
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
            $projectsDb = $projectRepository->findByParams([], ['name' => 'ASC']);

            if ($projectsDb === null) {
                $apiResponse->setFail();
                $apiResponse->setErrors('Not found projects');
            } else {
                $projects = [];

                $userPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
                
                foreach ($projectsDb as $project) {
                            
                    if (
                        !$userPermission->canWatchProject(
                            $project->getId()
                        )
                    ) {
                        continue;
                    }

                    $foldersDb = $project->getProjectFolders();

                    $folders = [];

                    if (!empty($foldersDb)) {
                        foreach ($foldersDb as $folder) {
                            
                            if (
                                !$userPermission->canWatchFolder(
                                    $folder->getId()
                                )
                            ) {
                                continue;
                            }

                            $folderPermissions = $userPermission->getPermissionsForFolder($folder->getId());
                            
                            $folders[] = [
                                'name' => $folder->getName(),
                                'id' => $folder->getId(),
                                'permissions' => $folderPermissions
                            ];
                        };

                        usort($folders, function ($a, $b) {
                            return ($a['name'] > $b['name']);
                        });
                    }
                    

                    $projects[] = [
                        'name' => $project->getName(),
                        'id' => $project->getId(),
                        'folders' => $folders,
                        'permissions' => $userPermission->getPermissionsForProject($project->getId())
                    ];
                }

                $apiResponse->setSuccess();
                $apiResponse->setData(['projects' => $projects]);
            }
        } catch (AccessDeniedException $exc) {
            $apiResponse->setErrors($exc->getMessage());
        } catch (\Exception $exc) {
            $apiResponse->setErrors($exc->getMessage());
        }

        return $apiResponse->generate();
    }

}
