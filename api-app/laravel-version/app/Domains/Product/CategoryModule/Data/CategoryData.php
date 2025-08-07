<?php

namespace App\Domains\Product\CategoryModule\Data;

use Spatie\LaravelData\Data;

class CategoryData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $created_at,
    ) {}
}
