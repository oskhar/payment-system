<?php

namespace App\Common\Data;

use Spatie\LaravelData\Data;

class FilterPaginationData extends Data
{
    public function __construct(
        public ?int $page = 1,
        public ?int $limit = 10,
        public ?string $search,
        public ?string $sort_by,
        public ?string $sort_type,
        public ?int $branch_id,
    ) {}
}
