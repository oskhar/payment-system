<?php

namespace App\Domains\Sales\AuthenticationModule\Data;

use App\Common\Exceptions\HttpUnauthorizedException;
use App\Domains\Sales\UserModule\Models\User as ModelsUser;
use Illuminate\Support\Facades\Hash;
use Spatie\LaravelData\Data;

class LoginData extends Data
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly ?bool $remember_me
    ) {}

    public function validateUser(): ModelsUser
    {
        $user = ModelsUser::where('email', $this->email)
            ->first();

        if (!$user)
            throw new HttpUnauthorizedException('Unauthorized');

        if (!Hash::check($this->password, $user->password))
            throw new HttpUnauthorizedException('Unauthorized');

        return $user;
    }
}
