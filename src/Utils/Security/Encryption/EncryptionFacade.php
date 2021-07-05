<?php

namespace App\Utils\Security\Encryption;

class EncryptionFacade {

    public const METHOD_ENCRYPT = "AES-256-CBC";

    public static function encrypt(?string $message) {
        $secret_iv = $_SERVER['KEY_ENCODE_PASSWORDS_2'];
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        return openssl_encrypt($message, self::METHOD_ENCRYPT, hash('sha256', $_SERVER['KEY_ENCODE_PASSWORDS'], true), 0, $iv);
    }

    public static function decrypt(?string $encrypted_string) {
        $secret_iv = $_SERVER['KEY_ENCODE_PASSWORDS_2'];
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        return openssl_decrypt($encrypted_string, self::METHOD_ENCRYPT, hash('sha256', $_SERVER['KEY_ENCODE_PASSWORDS'], true), 0, $iv);
    }

}
