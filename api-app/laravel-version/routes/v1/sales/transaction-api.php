<?php

use App\Domains\Sales\TransactionModule\Actions\CreateTransactionAction;
use App\Domains\Sales\TransactionModule\Actions\GetAllTransactionsAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('transaction', GetAllTransactionsAction::class);
    Route::post('transaction', CreateTransactionAction::class);
});
