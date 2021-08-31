<?php

namespace App\Project\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ScreensController extends AbstractController {
    
    /**
     * @Route("/projects/project-{project_id}/folder-{folder_id}/", requirements={"project_id"="\d+", "folder_id"="\d+"}, name="projects_folder")
     */
    public function projectsFolder(): Response {
        if ($this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->render('base.html.twig', []);
        } else {
            return $this->redirectToRoute('cabinet');
        }
    }  
    
    /**
     * @Route("/projects/", name="projects")
     */
    public function projects(): Response {
        if ($this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->render('base.html.twig', []);
        } else {
            return $this->redirectToRoute('cabinet');
        }
    }  

}
