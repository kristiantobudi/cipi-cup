<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\Api\Product\ProductsItemController;
use App\Http\Controllers\Api\Categories\CategoriesController;
use App\Http\Controllers\Api\Stock\StockController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Auth\Middleware\Authenticate;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::controller(AuthenticatedSessionController::class)->group(function () {
    Route::post('/logout', 'logout');
    Route::post('/login', 'store');
});

Route::controller(RegisteredUserController::class)->group(function () {
    Route::post('/register', 'register');
});

// Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {

//     Route::prefix('/inventory')->group(function () {
//         Route::get('/categories', [CategoriesController::class, 'index']);
//         Route::post('/categories', [CategoriesController::class, 'store']);
//         Route::get('/categories/{id}', [CategoriesController::class, 'show']);
//         Route::post('/categories/{id}', [CategoriesController::class, 'update']);
//         Route::delete('/categories/{id}', [CategoriesController::class, 'destroy']);
//         Route::get('/products', [ProductsItemController::class, 'index']);
//         Route::post('/products', [ProductsItemController::class, 'store']);
//         Route::get("/products/{id}", [ProductsItemController::class, 'show']);
//         Route::post("/products/{id}", [ProductsItemController::class, 'update']);
//         Route::delete("/products/{id}", [ProductsItemController::class, 'destroy']);
//         Route::get('/stock', [StockController::class, 'index']);
//         Route::post('/stock', [StockController::class, 'store']);
//         Route::get('/stock/{id}', [StockController::class, 'show']);
//         Route::post('/stock/{id}', [StockController::class, 'update']);
//         Route::delete('/stock/{id}', [StockController::class, 'destroy']);
//     });

//     // Route::prefix('/transaction')->group(function() {
//     //     Route::resource('products', ProductController::class);
//     // });

// });

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     Route::resource('products', ProductController::class);
// });
