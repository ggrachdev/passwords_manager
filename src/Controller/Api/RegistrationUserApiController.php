<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use App\Utils\Api\Response\ApiResponse;
use App\Form\RegistrationUserFormType;
use App\Utils\Form\ErrorsHelper;

class RegistrationUserApiController extends AbstractController {

    /**
     * @Route("/api/auth/registration/", name="registration_user_api")
     */
    public function registrationUser(UserPasswordEncoderInterface $encoder, Request $request): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {
            $newUser = new User();
            $registrationForm = $this->createForm(RegistrationUserFormType::class, $newUser);
            $registrationForm->handleRequest($request);

            if ($registrationForm->isSubmitted()) {

                if ($registrationForm->isValid()) {
                    $pass = $encoder->encodePassword($newUser, $request->request->get('registration_user_form')['password']);
                    $newUser->setPassword($pass);
                    $newUser->setRoles($request->request->get('registration_user_form')['role']);
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($newUser);
                    $em->flush();
                    $apiResponse->setSuccess();
                } else {
                    $apiResponse->setFail();
                    $apiResponse->setErrors(var_export(ErrorsHelper::getErrorMessages($registrationForm), true));
                }
            } else {
                $apiResponse->setFail();
                $apiResponse->setErrors('Has not data');
            }
        } else {
            $apiResponse->setFail();
            $apiResponse->setErrors('Has not access');
        }

        return $apiResponse->generate();
    }

}
