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
    public function __invoke(User $user, bool $remember_me = false): AccessToken
    {
        return AccessToken::from([
            'access_token' => $user->createToken(
                'personal_access_tokens',
                ['*'],
                $expiresAt = Carbon::now()->addMinutes(
                    config('sanctum.' . ($remember_me ? 'long_lived_expiration' : 'short_lived_expiration'))
                )
            )->plainTextToken,
            'expires_at' => $expiresAt,
        ]);
    }
}
