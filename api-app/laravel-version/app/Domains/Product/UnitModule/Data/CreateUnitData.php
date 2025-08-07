<?php

namespace App\Domains\Product\UnitModule\Data;

use Spatie\LaravelData\Data;

class CreateUnitData extends Data
{
    public function __construct(
        public readonly string $name,
        public readonly string $abbreviation
    ) {}
}
