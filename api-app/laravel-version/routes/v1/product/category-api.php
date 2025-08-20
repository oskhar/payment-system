<?php

use App\Domains\Product\CategoryModule\Actions\CreateCategoryAction;
use App\Domains\Product\CategoryModule\Actions\DeleteCategoryAction;
use App\Domains\Product\CategoryModule\Actions\GetAllCategoryAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('category', GetAllCategoryAction::class);
    Route::post('category', CreateCategoryAction::class);
    Route::delete('category', DeleteCategoryAction::class);
});
