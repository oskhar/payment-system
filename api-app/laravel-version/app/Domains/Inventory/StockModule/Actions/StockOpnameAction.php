<?php

namespace App\Domains\Inventory\StockModule\Actions;

use App\Common\Exceptions\UnprocessableEntityException;
use App\Common\Services\CodeGeneratorService;
use App\Domains\Inventory\StockModule\Data\StockOpnameData;
use App\Domains\Inventory\StockModule\Models\Stock;
use App\Domains\Inventory\StockModule\Services\GetStockService;
use App\Domains\Product\ItemModule\Models\ItemUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

class StockOpnameAction
{
    use AsAction;

    public function __construct(
        private readonly CodeGeneratorService $codeGeneratorService,
        private readonly GetStockService $getStockService,
    ) {
        //
    }

    /**
     * Handles the stock opname logic.
     *
     * @param StockOpnameData $stockOpnameData
     * @return array
     * @throws UnprocessableEntityException
     * @throws \Throwable
     */
    public function handle(StockOpnameData $stockOpnameData): array
    {
        // 1. Dapatkan kuantitas stok saat ini di sistem (dalam satuan dasar).
        $existingStockQuantity = ($this->getStockService)($stockOpnameData->branch_id, $stockOpnameData->item_id);

        // 2. Hitung total kuantitas fisik dari input (konversi semua ke satuan dasar).
        $totalPhysicalQuantityInBase = 0;
        foreach ($stockOpnameData->stock as $unitData) {
            // Cari konversi unit untuk item ini.
            $itemUnit = ItemUnit::where('item_id', $stockOpnameData->item_id)
                ->where('unit_id', $unitData->unit_id)
                ->select('conversion_to_base')
                ->first();

            // Jika unit tidak terdaftar untuk item ini, lempar error.
            if (!$itemUnit) {
                throw new UnprocessableEntityException("Unit dengan ID {$unitData->unit_id} tidak valid untuk item ini.");
            }

            // Akumulasikan total kuantitas dalam satuan dasar.
            $totalPhysicalQuantityInBase += $unitData->quantity * $itemUnit->conversion_to_base;
        }

        // 3. Hitung selisih antara stok fisik dan stok sistem.
        //    - Positif: Stok fisik lebih banyak (perlu 'in').
        //    - Negatif: Stok fisik lebih sedikit (perlu 'out').
        $difference = $totalPhysicalQuantityInBase - $existingStockQuantity;

        $adjustmentStock = null;

        // 4. Jika ada selisih, buat transaksi penyesuaian.
        if ($difference != 0) {
            DB::transaction(function () use ($stockOpnameData, $difference, &$adjustmentStock) {
                $transaction_number = ($this->codeGeneratorService)('STX', Stock::count());
                $type = $difference > 0 ? 'in' : 'out';
                $quantity = abs($difference);  // Kuantitas selalu positif.

                $adjustmentStock = Stock::create([
                    'transaction_number' => $transaction_number,
                    'branch_id' => $stockOpnameData->branch_id,
                    'item_id' => $stockOpnameData->item_id,
                    'quantity' => $quantity,  // Simpan selisihnya
                    'type' => $type,
                    'description' => 'Penyesuaian dari Stock Opname',
                ]);
            });
        }

        // 5. Siapkan data untuk respons.
        return [
            'item_id' => $stockOpnameData->item_id,
            'existing_stock_in_base' => $existingStockQuantity,
            'physical_stock_in_base' => $totalPhysicalQuantityInBase,
            'difference' => $difference,
            'adjustment_made' => $adjustmentStock !== null,
            'new_stock_total_in_base' => $totalPhysicalQuantityInBase,  // Stok terbaru sama dengan hasil hitungan fisik
            'adjustment_transaction' => $adjustmentStock,
        ];
    }

    /**
     * Acts as a controller for the stock opname action.
     *
     * @param StockOpnameData $stockOpnameData
     * @return JsonResponse
     */
    public function asController(StockOpnameData $stockOpnameData): JsonResponse
    {
        $result = $this->handle($stockOpnameData);

        $message = 'Stock opname berhasil.';
        if ($result['difference'] == 0) {
            $message = 'Kuantitas stok sudah sesuai, tidak ada perubahan.';
        }

        return response()->json([
            'message' => $message,
            'data' => $result,
        ]);
    }
}
