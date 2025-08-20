<?php

namespace App\Domains\Inventory\StockModule\Data;

use App\Domains\Inventory\StockModule\Enums\StockTypeEnum;
use Spatie\LaravelData\Data;

class CreateStockData extends Data
{
    public function __construct(
        public ?string $transaction_number = 'auto',
        public int $branch_id,
        public int $unit_id,
        public int $quantity,
        public StockTypeEnum $type,
        public ?string $description,
    ) {}
}
