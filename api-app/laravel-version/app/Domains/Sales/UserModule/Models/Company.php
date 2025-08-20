<?php

namespace App\Domains\Sales\UserModule\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $guarded = [];
    protected $table = 'companies';

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
