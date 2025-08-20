<?php

use App\Domains\Sales\AuthenticationModule\Actions\LoginAction;
use App\Domains\Sales\UserModule\Data\UserData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', LoginAction::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/me', function (Request $request) {
        return UserData::fromAuth();
    });
});

Route::get('/login', fn() => response()->json([
    'status' => false,
    'message' => 'Unauthorized',
])->setStatusCode(401))->name('login');
