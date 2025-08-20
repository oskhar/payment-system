<?php

namespace App\Domains\Inventory\StockModule\Data;

use Spatie\LaravelData\Data;

class ItemStockData extends Data
{
    public function __construct(
        public string $id,
        public string $name,
    ) {}
}

class StockData extends Data
{
    public function __construct(
        public string $id,
        public ItemStockData $item,
        public string $transaction_number,
        public string $type,
        public ?string $description,
        public string $quantity,
        public string $created_at,
    ) {}
}
