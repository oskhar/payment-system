<?php

namespace App\Domains\Sales\AuthenticationModule\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class AccessToken extends Data
{
    public function __construct(
        readonly ?string $access_token,
        readonly ?Carbon $expires_at,
    ) {}
}
