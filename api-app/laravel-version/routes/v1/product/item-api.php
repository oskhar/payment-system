<?php

use App\Domains\Product\ItemModule\Actions\CreateItemAction;
use App\Domains\Product\ItemModule\Actions\DeleteItemAction;
use App\Domains\Product\ItemModule\Actions\GetAllItemAction;
use App\Domains\Product\ItemModule\Actions\GetUnitItemAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('item/{id}/unit', GetUnitItemAction::class);
    Route::get('item', GetAllItemAction::class);
    Route::post('item', CreateItemAction::class);
    Route::delete('item', DeleteItemAction::class);
});
