<?php

namespace App\Domains\Inventory\StockModule\Actions;

use App\Common\Exceptions\UnprocessableEntityException;
use App\Common\Services\CodeGeneratorService;
use App\Domains\Inventory\BranchModule\Models\Branch;
use App\Domains\Inventory\StockModule\Data\CreateStockData;
use App\Domains\Inventory\StockModule\Models\Stock;
use App\Domains\Product\ItemModule\Models\Item;
use App\Domains\Product\ItemModule\Models\ItemUnit;
use App\Domains\Product\UnitModule\Models\Unit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

class CreateStockAction
{
    use AsAction;

    public function handle(string $item_id, CreateStockData $createStockData): Stock
    {
        $isAutoTransactionNumber = $createStockData->transaction_number === 'auto';
        if ($isAutoTransactionNumber)
            $createStockData->transaction_number = (new CodeGeneratorService())('STX', Stock::count());

        $existingTransactionNumber = Stock::where('transaction_number', $createStockData->transaction_number)
            ->first();

        if ($existingTransactionNumber)
            throw new UnprocessableEntityException('Transaction number already exists');

        $existBranch = Branch::where('company_id', Auth::user()->company_id)->where('id', $createStockData->branch_id)->first();
        if (!$existBranch)
            throw new UnprocessableEntityException('Branch not found');

        $existItem = Item::where('id', $item_id)->first();
        if (!$existItem)
            throw new UnprocessableEntityException('Item not found');

        $existUnit = Unit::where('id', $createStockData->unit_id)->first();
        if (!$existUnit)
            throw new UnprocessableEntityException('Unit not found');

        $existItemUnit = ItemUnit::where('item_id', $item_id)
            ->where('unit_id', $createStockData->unit_id)
            ->select('conversion_to_base')
            ->first();

        if (!$existItemUnit)
            throw new UnprocessableEntityException('Item unit not found');

        $finalQuantity = $existItemUnit->conversion_to_base * $createStockData->quantity;

        return Stock::create([
            'transaction_number' => $createStockData->transaction_number,
            'branch_id' => $createStockData->branch_id,
            'item_id' => $item_id,
            'quantity' => $finalQuantity,
            'type' => $createStockData->type,
            'description' => $createStockData->description,
        ]);
    }

    public function asController(string $item_id, CreateStockData $createStockData): JsonResponse
    {
        $stock = $this->handle($item_id, $createStockData);

        return response()->json([
            'stock' => $stock,
        ]);
    }
}
