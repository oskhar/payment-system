<?php

namespace App\Domains\Sales\TransactionModule\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionItem extends Model
{
    use HasFactory;

    /**
     * Properti yang dapat diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaction_id',
        'item_id',
        'unit_id',
        'quantity',
        'price',
        'total_amount',
    ];

    /**
     * Tipe data native untuk atribut model.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'quantity' => 'integer',
        'price' => 'float',
        'total_amount' => 'float',
    ];

    /**
     * Mendefinisikan relasi "satu item transaksi milik satu transaksi".
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Mendefinisikan relasi "satu item transaksi merujuk pada satu produk (item)".
     */
    public function item(): BelongsTo
    {
        // Diasumsikan Anda memiliki model App\Models\Item
        return $this->belongsTo(Item::class);
    }

    /**
     * Mendefinisikan relasi "satu item transaksi memiliki satu satuan (unit)".
     */
    public function unit(): BelongsTo
    {
        // Diasumsikan Anda memiliki model App\Models\Unit
        return $this->belongsTo(Unit::class);
    }
}
