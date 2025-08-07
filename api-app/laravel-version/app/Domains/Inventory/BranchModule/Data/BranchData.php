<?php

namespace App\Domains\Inventory\BranchModule\Data;

use Spatie\LaravelData\Data;

class BranchData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
        public string $address,
        public string $created_at,
    ) {}
}
