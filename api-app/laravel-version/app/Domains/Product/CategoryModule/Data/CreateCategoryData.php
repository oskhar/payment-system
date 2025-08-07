<?php

namespace App\Domains\Product\CategoryModule\Data;

use Spatie\LaravelData\Data;

class CreateCategoryData extends Data
{
    public function __construct(
        public readonly string $name
    ) {}
}
