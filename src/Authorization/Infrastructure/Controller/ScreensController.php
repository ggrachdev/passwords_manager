<?php

namespace App\Authorization\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

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
