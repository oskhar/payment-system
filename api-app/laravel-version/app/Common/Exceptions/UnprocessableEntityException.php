<?php

namespace App\Common\Exceptions;

use Illuminate\Http\JsonResponse;
use Exception;

/**
 * Class UnprocessableEntityException.
 *
 * Exception ini digunakan untuk merepresentasikan error validasi atau
 * ketika server tidak dapat memproses entitas yang diminta (HTTP 422).
 * Secara otomatis akan merender response dalam format JSON.
 */
class UnprocessableEntityException extends Exception
{
    /**
     * Menyimpan detail error, biasanya dari validasi.
     *
     * @var array
     */
    public $errors;

    /**
     * Membuat instance exception baru.
     *
     * @param string $message Pesan error utama.
     * @param array  $errors  Array yang berisi detail error per-field.
     * @param int    $code    Kode status HTTP (default 422).
     */
    public function __construct(string $message = 'The given data was invalid.', array $errors = [], int $code = 422)
    {
        // Memanggil constructor dari parent class (Exception)
        parent::__construct($message, $code);

        // Menyimpan detail error
        $this->errors = $errors;
    }

    /**
     * Merender exception menjadi sebuah HTTP response.
     *
     * Metode ini akan dipanggil secara otomatis oleh Laravel.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function render($request): JsonResponse
    {
        // Membuat response JSON dengan struktur yang umum untuk API
        return response()->json([
            'status' => false,
            'message' => $this->getMessage(),
            'errors' => $this->errors,
        ], $this->getCode());
    }
}
