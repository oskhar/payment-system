<?php

namespace App\Domains\Sales\AuthenticationModule\Service;

use App\Domains\Sales\AuthenticationModule\Data\AccessToken;
use App\Domains\Sales\UserModule\Models\User;
use Carbon\Carbon;

class GenerateAccessToken
{
    /**
     * Service main program.
     *
     * @return mixed
     */
    public function __invoke(User $user): AccessToken
    {
        return AccessToken::from([
            'access_token' => $user->createToken(
                'personal_access_tokens',
                ['*']
            )->plainTextToken,
            'expires_at' => null,
        ]);
    }
}
