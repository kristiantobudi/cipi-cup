<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Inventory\CategoriesController;
use App\Http\Controllers\Inventory\ProductController;
use App\Http\Controllers\Inventory\StockController;

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
    Route::get('/inventory/stock', [StockController::class, 'index'])->name('stock.index');
    Route::post('/inventory/stock', [StockController::class, 'store'])->name('stock.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
