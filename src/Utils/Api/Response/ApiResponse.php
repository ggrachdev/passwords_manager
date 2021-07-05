<?php

namespace App\Utils\Api\Response;

use Symfony\Component\HttpFoundation\Response;

class ApiResponse {
    public $responseData = [
	'is_success' => false,
	'errors' => [
	    
	],
	'data' => [
	    
	]
    ];
    
    public function setSuccess()
    {
	$this->responseData['is_success'] = true;
    }
    
    public function setFail()
    {
	$this->responseData['is_success'] = false;
    }
    
    public function setData($data)
    {
	$this->responseData['data'] = $data;
    }
    
    public function setErrors($errors)
    {
	$this->responseData['errors'] = $errors;
    }
    
    public function generate()
    {
	$response = new Response();
	$response->setContent(json_encode($this->responseData, JSON_UNESCAPED_UNICODE));
	$response->headers->set('Content-Type', 'application/json');
	return $response;
    }
}