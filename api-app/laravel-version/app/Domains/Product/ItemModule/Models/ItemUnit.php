<?php

namespace App\Domains\Product\ItemModule\Models;

use App\Domains\Product\UnitModule\Models\Unit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ItemUnit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['item_id', 'unit_id', 'conversion_to_base', 'price', 'cost'];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
