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
            "price" => "required|integer",
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
            'price' => $validated['price'],
            'min_stock' => $validated['min_stock'] ?? null,
            'category_id' => $validated['category_id'],
            'users_id' => Auth::id(),
            // "date" => now(),
        ]);

        return redirect()->route('product.index')->with('success', 'Product created successfully.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:255',
            'stock' => 'required|integer',
            'price' => 'required|integer',
            'min_stock' => 'nullable|integer',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product->update($validated);

        return redirect()->route('product.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('product.index')->with('success', 'Product deleted successfully.');
    }

    public function restore($id)
    {
        $product = Product::onlyTrashed()->where('id', $id)->firstOrFail();
        $product->restore();

        return redirect()->route('product.index')->with('success', 'Product restored successfully.');
    }

    // Force delete
    public function forceDelete($id)
    {
        $product = Product::onlyTrashed()->where('id', $id)->firstOrFail();
        $product->forceDelete();

        return redirect()->route('product.index')->with('success', 'Product permanently deleted.');
    }
}
