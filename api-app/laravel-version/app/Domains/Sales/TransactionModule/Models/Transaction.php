<?php

namespace App\Domains\Sales\TransactionModule\Models;

use App\Domains\Sales\TransactionModule\Enums\PaymentMethodEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Domains\Sales\UserModule\Models\User;
use App\Domains\Inventory\BranchModule\Models\Branch;

class Transaction extends Model
{
    use HasFactory;

    /**
     * Properti yang dapat diisi secara massal (mass assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'created_by',
        'branch_id',
        'transaction_number',
        'total_amount',
        'payment_method',
    ];

    /**
     * Tipe data native untuk atribut model.
     * Ini akan secara otomatis mengubah (cast) data saat dibaca atau disimpan.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_amount' => 'float', // Mengubah kolom decimal menjadi float di PHP
        'payment_method' => PaymentMethodEnum::class, // Mengubah string dari DB menjadi objek Enum
    ];

    /**
     * Mendefinisikan relasi "satu transaksi memiliki banyak item".
     */
    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    /**
     * Mendefinisikan relasi "satu transaksi dibuat oleh satu user".
     * Nama 'creator' digunakan agar lebih deskriptif.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Mendefinisikan relasi "satu transaksi milik satu cabang".
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
