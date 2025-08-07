<?php

use Illuminate\Support\Facades\Route;

/*
 * |--------------------------------------------------------------------------
 * | API Routes
 * |--------------------------------------------------------------------------
 * |
 * | Here is where you can register API routes for your application. These
 * | routes are loaded by the RouteServiceProvider and all of them will
 * | be assigned to the "api" middleware group. Make something great!
 * |
 */

/**
 * Corrected Route Group
 *
 * The Route::group method requires an array of attributes as its first argument.
 * By passing an empty array `[]`, we specify that there are no group-level
 * attributes (like prefixes or middleware) to apply, resolving the TypeError.
 * This block now correctly loads all route files ending in '-api.php'
 * from the 'routes/v1' subdirectories.
 */
Route::group([], function () {
    // Define the path to the version 1 route files.
    // Using base_path() ensures the correct absolute path.
    $v1RoutePath = base_path('routes/v1/*');

    // Use glob() to find all files matching the pattern '/*-api.php'
    // within the v1 subdirectories.
    foreach (glob($v1RoutePath . '/*-api.php') as $routeFile) {
        // Include the found route file.
        require $routeFile;
    }
});
