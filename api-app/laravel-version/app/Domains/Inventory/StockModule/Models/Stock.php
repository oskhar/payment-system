<?php

namespace App\Domains\Inventory\StockModule\Models;

use App\Domains\Inventory\BranchModule\Models\Branch;
use App\Domains\Product\ItemModule\Models\Item;
use App\Domains\Sales\UserModule\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'branch_id',
        'item_id',
        'transaction_number',
        'quantity',
        'type',
        'description',
    ];

    /**
     * Get the branch that owns the stock.
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get the item that the stock belongs to.
     * Assuming you have an Item model.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
