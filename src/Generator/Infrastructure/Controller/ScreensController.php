<?php

namespace App\Generator\Infrastructure\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Permission\ManagerPermission;
use App\Utils\History\HistoryManager;

class ScreensController extends AbstractController {

    private $managerPermission;
    private $managerHistory;
    
    public function __construct(ManagerPermission $mp, HistoryManager $mh) 
    {
        $this->managerPermission = $mp;
        $this->managerHistory = $mh;
    }

    /**
     * @Route("/generator/", name="password_generator")
     */
    public function generator(): Response {
        if (!$this->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->redirectToRoute('index');
        } else {
            return $this->render('base.html.twig', []);
        }
    }  

    /**
     * @Route("/test", name="test")`
     */
    public function test(): Response {
        
        if(!$this->isGranted('ROLE_ADMIN'))
        {
            die;
        }
   
        die;
    }  

}
