<?php

use App\Domains\Inventory\StockModule\Actions\CreateStockAction;
use App\Domains\Inventory\StockModule\Actions\GetAllStockAction;
use App\Domains\Inventory\StockModule\Actions\StockOpnameAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/item/{item_id}/stock', [CreateStockAction::class, 'asController']);
    Route::get('/stock', [GetAllStockAction::class, 'asController']);
    Route::post('/stock/opname', [StockOpnameAction::class, 'asController']);
});
