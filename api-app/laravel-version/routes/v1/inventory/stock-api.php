<?php

use App\Domains\Inventory\StockModule\Actions\CreateStockAction;
use App\Domains\Inventory\StockModule\Actions\GetAllStockAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/stock', [CreateStockAction::class, 'asController'])
        ->name('create-stock');
    Route::get('/stock', [GetAllStockAction::class, 'asController'])
        ->name('get-all-stock');
});
