<?php

namespace App\Common\Middleware;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Closure;

class FormatApiResponse
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($response instanceof JsonResponse && $response->isSuccessful()) {
            $originalData = $response->getData(true);

            if (isset($originalData['data']) && isset($originalData['status'])) {
                return $response;
            }
            $formattedResponse = [
                'status' => true,
                'message' => $originalData['message'] ?? 'Success',
                'data' => $originalData,
                'meta' => [
                    'request_id' => $request->header('X-Request-ID') ?? (string) Str::uuid(),
                ]
            ];
            $response->setData($formattedResponse);
        }

        return $response;
    }
}
