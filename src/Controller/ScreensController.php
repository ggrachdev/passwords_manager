<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\Permission;
use App\Utils\Permission\UserPermission;

class ScreensController extends AbstractController {

    /**
     * @Route("/", name="index")
     */
    public function index(): Response {
        if ($this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->redirectToRoute('cabinet');
        } else {
            return $this->render('base.html.twig', []);
        }
    }  

    /**
     * @Route("/test", name="test")
     */
    public function test(): Response {
        
        $em = $this->getDoctrine()->getManager();
        
        $userPermission = new UserPermission($this->getUser(), $em->getRepository(Permission::class));
        
        dd(999);
        
        die;
    }  
    
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
    
    /**
     * @Route("/history/", name="history")
     */
    public function historyScreen(): Response
    {
        if($this->isGranted('ROLE_ADMIN'))
        {
            return $this->render('base.html.twig', []);
        }
        else
        {
            return $this->redirectToRoute('index');
        }
    }
    
    /**
     * @Route("/cabinet/", name="cabinet")
     */
    public function cabinetScreen(): Response
    {
        if($this->isGranted('IS_AUTHENTICATED_REMEMBERED'))
        {
            return $this->render('base.html.twig', []);
        }
        else
        {
            return $this->redirectToRoute('index');
        }
    }
    
    /**
     * @Route("/users/", name="users")
     */
    public function usersScreen(): Response
    {
        if($this->isGranted('ROLE_ADMIN'))
        {
            return $this->render('base.html.twig', []);
        }
        else
        {
            return $this->redirectToRoute('index');
        }
    }
    
    /**
     * @Route("/roles/", name="roles")
     */
    public function rolesScreen(): Response
    {
        if($this->isGranted('ROLE_ADMIN'))
        {
            return $this->render('base.html.twig', []);
        }
        else
        {
            return $this->redirectToRoute('index');
        }
    }

}
