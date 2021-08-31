<?php

namespace App\History\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ScreensController extends AbstractController {
    
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

}
