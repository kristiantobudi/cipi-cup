<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Product;
use App\Models\Inventory\Categories;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index(Request $requets)
    {
        $product = Product::latest()->get();
        $categories = Categories::latest()->get();

        return inertia('Inventory/Product/Products', [
            'products' => $product,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
         $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        "sku" => "required|string|max:255",
        "stock" => "required|integer",
        "min_stock" => "integer",
        "category_id" => "required",
    ]);

    if ($validator->fails()) {
        return $this->sendError("Validation failed", $validator->errors());
    }

    $validated = $validator->validated();

    $product = Product::create([
        'name' => $validated['name'],
        'sku' => $validated['sku'],
        'stock' => $validated['stock'],
        'min_stock' => $validated['min_stock'] ?? null,
        'category_id' => $validated['category_id'],
        'users_id' => Auth::id(),
        // "date" => now(),
    ]);

    return redirect()->route('product.index')->with('success', 'Product created successfully.');
    }
}
