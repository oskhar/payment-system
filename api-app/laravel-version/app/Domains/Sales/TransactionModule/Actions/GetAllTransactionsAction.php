<?php

namespace App\Domains\Sales\TransactionModule\Actions;

use App\Domains\Sales\TransactionModule\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Lorisleiva\Actions\Concerns\AsAction;

/**
 * Class GetAllTransactionsAction
 *
 * Aksi ini bertanggung jawab untuk mengambil semua data transaksi dari database.
 * Untuk efisiensi, aksi ini melakukan eager loading pada relasi-relasi penting
 * seperti 'items' (item-item dalam transaksi), 'creator' (user yang membuat),
 * dan 'branch' (cabang tempat transaksi terjadi) untuk menghindari masalah N+1 query.
 * Hasilnya diurutkan berdasarkan transaksi terbaru.
 */
class GetAllTransactionsAction
{
    use AsAction;

    /**
     * Menjalankan logika utama untuk mengambil semua transaksi.
     *
     * @return \Illuminate\Database\Eloquent\Collection|static[]
     */
    public function handle()
    {
        // Mengambil semua transaksi dengan memuat relasi yang diperlukan (eager loading)
        // dan mengurutkannya dari yang paling baru.
        return Transaction::with(['items', 'creator', 'branch'])->latest()->get();
    }

    /**
     * Menjalankan aksi ini sebagai controller yang merespon permintaan HTTP.
     *
     * Mengembalikan data transaksi dalam format JSON dengan status code 200 (OK).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function asController(): JsonResponse
    {
        // Memanggil metode handle untuk mendapatkan data
        $transactions = $this->handle();

        // Mengembalikan response JSON
        return response()->json($transactions, Response::HTTP_OK);
    }
}
