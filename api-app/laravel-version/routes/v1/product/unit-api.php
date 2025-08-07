<?php

use App\Domains\Product\UnitModule\Actions\CreateUnitAction;
use App\Domains\Product\UnitModule\Actions\DeleteUnitAction;
use App\Domains\Product\UnitModule\Actions\GetAllUnitAction;
use Illuminate\Support\Facades\Route;

Route::get('unit', GetAllUnitAction::class);
Route::post('unit', CreateUnitAction::class);
Route::delete('unit', DeleteUnitAction::class);
