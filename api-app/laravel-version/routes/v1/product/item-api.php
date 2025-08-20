<?php

use App\Domains\Product\ItemModule\Actions\CreateItemAction;
use App\Domains\Product\ItemModule\Actions\DeleteItemAction;
use App\Domains\Product\ItemModule\Actions\GetAllItemAction;
use App\Domains\Product\ItemModule\Actions\GetUnitItemAction;
use App\Domains\Product\ItemModule\Actions\UpdateItemAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('item/{id}/unit', GetUnitItemAction::class);
    Route::get('item', GetAllItemAction::class);
    Route::post('item', CreateItemAction::class);
    Route::put('item/{item}', UpdateItemAction::class);
    Route::delete('item', DeleteItemAction::class);
});
