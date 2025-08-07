<?php

use App\Domains\Sales\AuthenticationModule\Actions\LoginAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', LoginAction::class);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', function (Request $request) {
        return Auth::user();
    });
});

Route::get('/login', fn() => response()->json([
    'status' => false,
    'message' => 'Unauthorized',
])->setStatusCode(401))->name('login');
