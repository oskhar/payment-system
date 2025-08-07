<?php

namespace App\Domains\Product\ItemModule\Models;

use App\Domains\Product\CategoryModule\Models\Category;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ItemCategory extends Pivot
{
    protected $table = 'item_categories';
    public $incrementing = false;
    public $timestamps = false;

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
