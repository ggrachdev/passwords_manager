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

class RegistrationUserApiController extends AbstractController {

    private function getErrorMessages(\Symfony\Component\Form\Form $form) {
        $errors = array();

        foreach ($form->getErrors() as $key => $error) {
            if ($form->isRoot()) {
                $errors['#'][] = $error->getMessage();
            } else {
                $errors[] = $error->getMessage();
            }
        }

        foreach ($form->all() as $child) {
            if (!$child->isValid()) {
                $errors[$child->getName()] = $this->getErrorMessages($child);
            }
        }

        return $errors;
    }

    /**
     * @Route("/api/auth/registration/", name="registration_user_api")
     */
    public function index(UserPasswordEncoderInterface $encoder, Request $request): Response {
        $apiResponse = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN')) {
            $newUser = new User();
            $registrationForm = $this->createForm(RegistrationUserFormType::class, $newUser);
            $registrationForm->handleRequest($request);

            if ($registrationForm->isSubmitted()) {

                if ($registrationForm->isValid()) {
                    $pass = $encoder->encodePassword($newUser, $request->request->get('registration_user_form')['password']);
                    $newUser->setPassword($pass);
                    $newUser->setRoles(['ROLE_USER']);
                    $em = $this->getDoctrine()->getManager();
                    $em->persist($newUser);
                    $em->flush();
                    $apiResponse->setSuccess();
                } else {
                    $apiResponse->setFail();
                    $apiResponse->setErrors(var_export($this->getErrorMessages($registrationForm), true));
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
