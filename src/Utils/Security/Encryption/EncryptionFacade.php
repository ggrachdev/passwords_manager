<?php

namespace App\Utils\Security\Encryption;

class EncryptionFacade {

    public const METHOD_ENCRYPT = "AES-256-CBC";

    private static function getIV() {
        $secret_iv = $_SERVER['KEY_ENCODE_PASSWORDS_2'];
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        return $iv;
    }

    private static function getSecretKey() {
        return hash('sha256', $_SERVER['KEY_ENCODE_PASSWORDS'], true);
    }

    public static function encrypt(?string $message) {
        return openssl_encrypt($message, self::METHOD_ENCRYPT, self::getSecretKey(), 0, self::getIV());
    }

    public static function decrypt(?string $encrypted_string) {
        return openssl_decrypt($encrypted_string, self::METHOD_ENCRYPT, self::getSecretKey(), 0, self::getIV());
    }

}
