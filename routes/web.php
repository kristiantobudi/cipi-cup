<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Inventory\CategoriesController;
use App\Http\Controllers\Inventory\ProductController;
use App\Http\Controllers\Inventory\StockController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Sales\PurchaseController;
use App\Http\Controllers\Sales\SalesController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/inventory/categories', [CategoriesController::class, 'index'])->name('categories.index');
    Route::post('/inventory/categories', [CategoriesController::class, 'store'])->name('Categories.store');
    Route::get('/inventory/product', [ProductController::class, 'index'])->name('product.index');
    Route::post('/inventory/product', [ProductController::class, 'store'])->name('product.store');
    Route::put('/inventory/product/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/inventory/product/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::get('/inventory/stock', [StockController::class, 'index'])->name('stock.index');
    Route::post('/inventory/stock', [StockController::class, 'store'])->name('stock.store');

    // Sales
    Route::prefix('/sales')->group(function () {
        Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
        Route::get('/purchases/{id}', [PurchaseController::class, 'show'])->name('purchases.show');
        Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');
        Route::put('/purchases/{id}', [PurchaseController::class, 'update'])->name('purchases.update');
        Route::delete('/purchases/{purchases}', [PurchaseController::class, 'destroy'])->name('purchases.destroy');
        Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
        Route::get('/sales/create', [SalesController::class, 'create'])->name('sales.create');
        Route::get('/sales/{id}', [SalesController::class, 'show'])->name('sales.show');
        Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');
        Route::put('/sales/{id}', [SalesController::class, 'update'])->name('sales.update');
        Route::delete('/sales/{sales}', [SalesController::class, 'destroy'])->name('sales.destroy');
    });

    Route::prefix('/report')->group(function () {
        Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
