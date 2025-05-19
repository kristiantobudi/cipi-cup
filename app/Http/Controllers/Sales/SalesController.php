<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Inventory\Product;
use App\Models\Sales\Sales;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SalesController extends Controller
{
    public function index()
    {
        $sales = Sales::latest()->get();
        $product = Product::latest()->get();

        $summary = [
            'daily' => Sales::whereDate('date', Carbon::today())->sum('total_amount'),
            'weekly' => Sales::whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->sum('total_amount'),
            'monthly' => Sales::whereMonth('date', Carbon::now()->month)
                ->whereYear('date', Carbon::now()->year)
                ->sum('total_amount'),
        ];

        return inertia('Sales/Sale/Sale', [
            'sales' => $sales,
            'saleSummary' => $summary,
            'title' => 'Penjualan'
        ]);
    }

    public function show($id)
    {
        $sales = Sales::with('items')->findOrFail($id);

        return Inertia::render("Sales/Sale/Show", [
            'sales' => $sales,
            'title' => 'Detail Penjualan'
        ]);
    }

    public function create()
    {
        $products = Product::select('id', 'name as product_name', 'price as product_price', 'created_at')->get();

        return Inertia::render('Sales/Sale/Create', [
            'products' => $products,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_name' => 'required|string|max:255',
            'items.*.product_price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.subtotal' => 'required|numeric|min:0',
            'items.*.product_id' => 'required|exists:products,id',
        ]);

        $validated['date'] = Carbon::parse($validated['date'])->toDateString();

        DB::transaction(function () use ($validated) {
            $sales = Sales::create([
                'date' => $validated['date'],
                'users_id' => Auth::id()
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $sales->items()->create([
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_price' => $item['product_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal'],
                    'users_id' => Auth::id(),
                ]);
                $total += $item['subtotal'];
            }

            $sales->update(['total_amount' => $total]);
        });

        return redirect()->route('sales.index')->with('success', 'Penjualan berhasil disimpan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_name' => 'required|string|max:255',
            'items.*.product_price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.subtotal' => 'required|numeric|min:0',
            'items.*.product_id' => 'required|exists:products,id',
        ]);

        DB::transaction(function () use ($validated, $id) {
            $sales = Sales::findOrFail($id);
            $sales->update([
                'date' => $validated['date'],
            ]);

            $sales->items()->delete();

            $total = 0;

            foreach ($validated['items'] as $item) {
                $sales->items()->create([
                    'product_name' => $item['product_name'],
                    'product_price' => $item['product_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['subtotal']
                ]);
                $total += $item['subtotal'];
            }

            $sales->update(['total_amount' => $total]);
        });

        return redirect()->route('sales.index')->with('success', 'Penjualan berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        $sales = Sales::findOrFail($id);
        $sales->delete();

        return redirect()->route('sales.index')->with('success', 'Penjualan berhasil dihapus.');
    }
}
