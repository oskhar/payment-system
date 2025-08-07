<?php

namespace App\Domains\Inventory\BranchModule\Models;

use App\Domains\Inventory\StockModule\Models\Stock;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
    ];

    /**
     * Get the stocks for the branch.
     */
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }
}
