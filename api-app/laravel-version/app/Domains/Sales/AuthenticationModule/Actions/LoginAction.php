<?php

namespace App\Domains\Sales\AuthenticationModule\Actions;

use App\Domains\Sales\AuthenticationModule\Data\LoginData;
use App\Domains\Sales\AuthenticationModule\Service\GenerateAccessToken;
use Illuminate\Http\JsonResponse;
use Lorisleiva\Actions\Concerns\AsAction;

class LoginAction
{
    use AsAction;

    public function __construct(
        public readonly GenerateAccessToken $generateAccessToken
    ) {}

    /**
     * Method ini adalah inti dari logic action.
     * Seringkali diberi nama 'handle' sebagai konvensi, tapi 'execute' juga tidak masalah.
     */
    public function handle(LoginData $loginData): array
    {
        $user = $loginData->validateUser('user');
        $generate = ($this->generateAccessToken)($user, $loginData->remember_me);

        return [
            'user' => $user,
            'access_token' => $generate->access_token,
            'expires_at' => $generate->expires_at,
        ];
    }

    /**
     * Method ini secara spesifik mendefinisikan bagaimana action berjalan sebagai Controller.
     * Trait AsAction akan memastikan method ini dipanggil saat rute mengarah ke class ini.
     */
    public function asController(LoginData $loginData): JsonResponse
    {
        $result = $this->handle($loginData);
        return response()->json($result);
    }
}
