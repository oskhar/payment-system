<?php

namespace App\Domains\Product\ItemModule\Models;

use App\Domains\Product\CategoryModule\Models\Category;
use App\Domains\Product\UnitModule\Models\Unit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'barcode', 'description', 'image_url', 'base_unit_id'];

    public function baseUnit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'base_unit_id');
    }

    public function itemUnits(): HasMany
    {
        return $this->hasMany(ItemUnit::class);
    }

    public function itemCategories(): HasMany
    {
        return $this->hasMany(ItemCategory::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'item_categories', 'item_id', 'category_id');
    }
}
