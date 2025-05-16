<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Stock;
use App\Models\Inventory\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $stock = Stock::latest()->get();
        $product = Product::latest()->get();

        return inertia('Inventory/Stock/Stock', [
            'stock' => $stock,
            'products' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => ['required', Rule::in(['in', 'out'])],
            'quantity' => 'required|integer',
            'price' => 'required|integer',
            // 'description' => 'string',
            'product_id' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError("Validation failed", $validator->errors());
        }

        $validated = $validator->validated();

        $stock = Stock::create([
            'type' => $validated['type'],
            'quantity' => $validated['quantity'],
            'price' => $validated['price'],
            'description' => $validated['description'] ?? null,
            'product_id' => $validated['product_id'],
            'users_id' => Auth::id(),
        ]);

        return redirect()->route('stock.index')->with('success', 'Stock created successfully.');
    }
}
