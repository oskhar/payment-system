<?php

use App\Domains\Inventory\BranchModule\Actions\CreateBranchAction;
use App\Domains\Inventory\BranchModule\Actions\DeleteBranchAction;
use App\Domains\Inventory\BranchModule\Actions\GetAllBranchAction;
use App\Domains\Inventory\BranchModule\Actions\UpdateBranchAction;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/branch', CreateBranchAction::class);
    Route::get('/branch', GetAllBranchAction::class);
    Route::put('/branch/{branch}', UpdateBranchAction::class);
    Route::delete('/branch', DeleteBranchAction::class);
});
