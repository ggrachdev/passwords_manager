<?php

namespace App\Authorization\Infrastructure\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Authorization\Domain\User;
use App\Utils\Api\Response\ApiResponse;
use App\Authorization\Infrastructure\Form\RegistrationUserFormType;
use App\Utils\Form\ErrorsHelper;
use App\Utils\History\HistoryManager;

class RegistrationUserApiController extends AbstractController {

    private $managerHistory;
    
    public function __construct(HistoryManager $mh) 
    {
        $this->managerHistory = $mh;
    }

    /**
     * @Route("/api/auth/registration/", name="registration_user_api")
     */
    public function registrationUser(UserPasswordEncoderInterface $encoder, Request $request): Response {
        $apiResponse = new ApiResponse();

        // @todo check permissions
        if ($this->isGranted('ROLE_ADMIN')) {
            $newUser = new User();
            $registrationForm = $this->createForm(RegistrationUserFormType::class, $newUser);
            $registrationForm->handleRequest($request);

            if ($registrationForm->isSubmitted()) {

                if ($registrationForm->isValid()) {
                    $pass = $encoder->encodePassword($newUser, $request->request->get('registration_user_form')['password']);
                    $newUser->setPassword($pass);
                    $newUser->setRoles(
                        \array_keys($request->request->get('registration_user_form')['role'])
                    );
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($newUser);
                    $em->flush();
                    
                    $this->managerHistory->logRegistrationUserEvent($this->getUser(), $newUser);
                    
                    $apiResponse->setSuccess();
                } else {
                    $apiResponse->setErrors(var_export(ErrorsHelper::getErrorMessages($registrationForm), true));
                }
            } else {
                $apiResponse->setErrors('Has not data');
            }
        } else {
            $apiResponse->setErrors('Has not access');
        }

        return $apiResponse->generate();
    }

}
