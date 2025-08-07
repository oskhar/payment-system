<?php

namespace App\Domains\Inventory\BranchModule\Data;

use Spatie\LaravelData\Data;

class CreateBranchData extends Data
{
    public function __construct(
        public string $name,
        public string $address,
    ) {}
}
