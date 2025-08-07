<?php

namespace App\Domains\Inventory\StockModule\Services;

use App\Domains\Inventory\StockModule\Models\Stock;

class GetStockService
{
    public function __invoke(int $branch_id, int $item_id): int
    {
        $stockIn = Stock::where('branch_id', $branch_id)
            ->where('item_id', $item_id)
            ->where('type', 'in')
            ->sum('quantity');

        $stockOut = Stock::where('branch_id', $branch_id)
            ->where('item_id', $item_id)
            ->where('type', 'out')
            ->sum('quantity');

        return $stockIn - $stockOut;
    }
}
