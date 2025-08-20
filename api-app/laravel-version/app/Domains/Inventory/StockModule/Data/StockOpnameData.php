<?php

namespace App\Domains\Inventory\StockModule\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

class StockOpnameData extends Data
{
    public function __construct(
        public int $item_id,
        public int $branch_id,

        /**
         * @var DataCollection<int, UnitData>
         */
        #[DataCollectionOf(StockDataCollection::class)]
        public DataCollection $stock,
    ) {}
}

class StockDataCollection extends Data
{
    public function __construct(
        public int $unit_id,
        public int $quantity,
    ) {}
}
