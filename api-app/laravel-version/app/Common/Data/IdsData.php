<?php

namespace App\Common\Data;

use App\Common\Cast\ArrayOfIntsCast;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;

class IdsData extends Data
{
    public function __construct(
        #[WithCast(ArrayOfIntsCast::class)]
        public readonly array $ids
    ) {}
}
