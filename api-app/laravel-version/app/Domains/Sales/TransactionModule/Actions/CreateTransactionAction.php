<?php

namespace App\Domains\Sales\TransactionModule\Actions;

use App\Domains\Sales\TransactionModule\Data\CreateTransactionData;
use App\Common\Exceptions\UnprocessableEntityException;
use App\Domains\Sales\TransactionModule\Models\Transaction;
use App\Domains\Sales\TransactionModule\Models\TransactionItem;
use App\Common\Services\CodeGeneratorService;
use App\Domains\Inventory\StockModule\Models\Stock;
// Ganti path ini jika model ItemUnit Anda berada di lokasi lain
use App\Domains\Product\ItemModule\Models\ItemUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;
use Illuminate\Support\Facades\Auth;
use Throwable;

class CreateTransactionAction
{
    use AsAction;

    public function handle(CreateTransactionData $data): mixed
    {
        return DB::transaction(function () use ($data) {

            $isAutoTransactionNumber = $data->transaction_number == 'auto';
            if ($isAutoTransactionNumber)
                $data->transaction_number = (new CodeGeneratorService())('TS', Stock::count());

            $existingTransactionNumber = Stock::where('transaction_number', $data->transaction_number)
                ->first();

            if ($existingTransactionNumber)
                throw new UnprocessableEntityException('Transaction number already exists');

            // 1. Membuat record transaksi utama (Tidak ada perubahan)
            $transaction = Transaction::create([
                'transaction_number' => $data->transaction_number,
                'total_amount'       => $data->total_amount,
                'payment_method'     => $data->payment_method,
                'branch_id'          => $data->branch_id,
                'created_by'         => Auth::id(),
            ]);

            // 2. Memproses dan menyimpan setiap item transaksi
            foreach ($data->items as $itemData) {
                // Ambil data dari tabel pivot 'item_units' berdasarkan item dan unit
                $itemUnit = ItemUnit::where('item_id', $itemData->item_id)
                                    ->where('unit_id', $itemData->unit_id)
                                    ->firstOrFail(); // Gunakan firstOrFail() untuk memastikan kombinasi item & unit ada

                // Ambil harga dari relasi yang ditemukan
                $price = $itemData->quantity >= 5 ? $itemUnit->wholesale_price : $itemUnit->price;
                $totalAmountForItem = $price * $itemData->quantity;

                $transaction->items()->create([
                    'item_id'    => $itemData->item_id,
                    'unit_id'    => $itemData->unit_id,
                    'quantity'   => $itemData->quantity,
                    'price'      => $price, // Harga yang sudah benar
                    'total_amount' => $totalAmountForItem,
                ]);
            }

            return $transaction->load('items');
        });
    }

    public function asController(CreateTransactionData $data): JsonResponse
    {
        $transaction = $this->handle($data);

        return response()->json($transaction, Response::HTTP_CREATED);
    }
}
