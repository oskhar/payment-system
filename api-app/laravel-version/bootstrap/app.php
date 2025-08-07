<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

// Catatan: BadMethodCallException, ErrorException, InvalidArgumentException, dan Throwable
// adalah bagian dari namespace global PHP dan tidak perlu diimpor.

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',  // Pastikan route 'unit' ada di file ini
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        apiPrefix: '',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api([
            \App\Common\Middleware\FormatApiResponse::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // =========================================================================
        // HANDLER UNTUK ERROR ROUTING & HTTP
        // =========================================================================

        $exceptions->render(
            fn(CannotCreateData $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Data yang diberikan tidak valid.',
                'errors' => $e,
            ], 400)
        );

        /**
         * Menangani error ketika model tidak ditemukan (misalnya dengan findOrFail).
         * Sangat berguna untuk endpoint detail seperti /users/{id}.
         */
        $exceptions->render(
            fn(ValidationException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Request tidak valid.',
                'errors' => $e->validator->errors()->all(),
            ], 400)  // 400 Bad Request
        );

        /**
         * Menangani route tidak ditemukan.
         * Terjadi jika URL yang diakses tidak terdaftar di file route.
         */
        $exceptions->render(
            fn(NotFoundHttpException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Endpoint atau sumber daya yang Anda tuju tidak ditemukan.',
                'errors' => null
            ], 404)  // 404 Not Found
        );

        /**
         * Menangani penggunaan metode HTTP yang salah pada sebuah route.
         * Contoh: Melakukan request GET ke route yang hanya mengizinkan POST.
         */
        $exceptions->render(
            fn(MethodNotAllowedHttpException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Metode HTTP tidak diizinkan untuk endpoint ini.',
                'errors' => config('app.debug') ? ['allowed_methods' => $e->getHeaders()['Allow']] : null,
            ], 405)  // 405 Method Not Allowed
        );

        // =========================================================================
        // HANDLER UNTUK ERROR OTENTIKASI & OTORISASI
        // =========================================================================

        /**
         * Menangani kegagalan autentikasi.
         * Terjadi jika user mencoba mengakses route yang dilindungi tanpa token/session yang valid.
         */
        $exceptions->render(
            fn(AuthenticationException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Tidak terautentikasi. Silakan login terlebih dahulu.',
                'errors' => null
            ], 401)  // 401 Unauthorized
        );

        /**
         * Menangani kegagalan otorisasi (Policies atau Gates).
         * Terjadi jika user terautentikasi tetapi tidak memiliki izin untuk melakukan aksi tertentu.
         */
        $exceptions->render(
            fn(AuthorizationException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Anda tidak memiliki izin untuk melakukan aksi ini.',
                'errors' => null
            ], 403)  // 403 Forbidden
        );

        // =========================================================================
        // HANDLER UNTUK ERROR DATABASE & MODEL
        // =========================================================================

        /**
         * Menangani error ketika model tidak ditemukan (misalnya dengan findOrFail).
         * Sangat berguna untuk endpoint detail seperti /users/{id}.
         */
        $exceptions->render(
            fn(ModelNotFoundException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Data yang dicari tidak ditemukan.',
                'errors' => config('app.debug') ? ['model' => $e->getModel()] : null,
            ], 404)  // 404 Not Found
        );

        /**
         * Menangani error query database secara umum.
         * Seperti kesalahan sintaks SQL, koneksi gagal, atau constraint violation.
         */
        $exceptions->render(
            fn(QueryException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan pada operasi database.',
                'errors' => config('app.debug') ? [
                    'db_error_code' => $e->getCode(),
                    'db_error_message' => $e->getMessage()
                ] : null
            ], 500)  // 500 Internal Server Error
        );

        // =========================================================================
        // HANDLER UNTUK ERROR LOGIKA PEMROGRAMAN (SANGAT PENTING UNTUK DEBUG)
        // =========================================================================

        /**
         * Menangani pemanggilan method yang tidak ada pada sebuah objek.
         * Contoh: $user->getProfilePicture() padahal methodnya bernama ->getAvatar().
         */
        $exceptions->render(
            fn(BadMethodCallException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Kesalahan pemanggilan method.',
                'errors' => config('app.debug') ? [
                    'error_message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500)
        );

        /**
         * Menangani error karena argumen fungsi/method tidak valid.
         * Contoh: Memberikan string ke fungsi yang mengharapkan array.
         */
        $exceptions->render(
            fn(InvalidArgumentException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Argumen yang diberikan pada fungsi tidak valid.',
                'errors' => config('app.debug') ? [
                    'error_message' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500)
        );

        /**
         * Menangani error PHP umum yang bukan exception.
         * Contoh: Mencoba mengakses offset array yang tidak ada, atau properti pada nilai null.
         */
        $exceptions->render(
            fn(ErrorException $e, Request $request) => response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan pada kode server.',
                'errors' => config('app.debug') ? [
                    'error_message' => $e->getMessage(),
                    'severity' => $e->getSeverity(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ] : null
            ], 500)
        );

        // =========================================================================
        // HANDLER UNTUK CUSTOM EXCEPTION & CATCH-ALL
        // =========================================================================

        /**
         * Menangani custom exception aplikasi Anda.
         * Berguna untuk standarisasi error yang Anda buat sendiri.
         */
        $exceptions->render(
            fn(APIResponseException $e, Request $request) => response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'errors' => $e->getErrors()
            ], $e->getCode())
        );

        /**
         * Handler umum untuk semua error lainnya yang tidak tertangkap di atas.
         * Ini adalah jaring pengaman terakhir.
         */
        $exceptions->render(function (Throwable $e, Request $request) {
            // Hanya berlaku jika request mengharapkan JSON, untuk keamanan
            if ($request->expectsJson()) {
                return response()->json([
                    'status' => false,
                    'message' => config('app.debug')
                        ? 'Terjadi kesalahan tak terduga: ' . $e->getMessage()
                        : 'Terjadi kesalahan internal pada server.',
                    'errors' => config('app.debug')
                        ? [
                            'exception' => get_class($e),
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                            'trace' => collect($e->getTrace())->map(function ($trace) {
                                return \Illuminate\Support\Arr::except($trace, ['args']);
                            })->all(),
                        ]
                        : null
                ], 500);
            }
        });
    })
    ->create();
