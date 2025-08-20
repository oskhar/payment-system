<?php

namespace App\Domains\Sales\UserModule\Data;

use Carbon\Carbon;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Spatie\LaravelData\Data;

class CompanyData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
    ) {}
}

class UserData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly CompanyData $company,
        public readonly Carbon $created_at,
    ) {}

    /**
     * Create UserData from the authenticated user.
     *
     * This method explicitly creates the DTOs to avoid potential
     * infinite recursion and memory exhaustion from Eloquent relationships.
     *
     * @return self
     * @throws AuthenticationException
     */
    public static function fromAuth(): self
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        // Safety check to ensure a user is authenticated.
        if (!$user) {
            throw new AuthenticationException('User is not authenticated.');
        }

        $company = $user->company;

        // Directly instantiate the DTOs with the specific data needed.
        // This is much more memory-efficient and safer than using ::from($user).
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            company: new CompanyData(
                id: $company->id,
                name: $company->name
            ),
            created_at: $user->created_at,
        );
    }
}
