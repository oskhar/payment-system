<?php

namespace App\Domains\Product\UnitModule\Data;

use Spatie\LaravelData\Data;

class UnitData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $abbreviation,
        public string $created_at,
    ) {}
}
