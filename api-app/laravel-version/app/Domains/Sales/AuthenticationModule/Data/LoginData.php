<?php

namespace App\Domains\Sales\AuthenticationModule\Data;

use App\Domains\Sales\UserModule\Models\User as ModelsUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\UnauthorizedException;
use Spatie\LaravelData\Data;

class LoginData extends Data
{
    public function __construct(
        public readonly string $email,
        public readonly string $password,
        public readonly bool $remember_me
    ) {}

    public function validateUser(): ModelsUser
    {
        $user = ModelsUser::where('email', $this->email)
            ->first();

        if (!$user)
            throw new UnauthorizedException('Unauthorized');

        if (!Hash::check($this->password, $user->password))
            throw new UnauthorizedException('Unauthorized');

        return $user;
    }
}
