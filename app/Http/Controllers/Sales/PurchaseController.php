<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sales\Purchases;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use App\Models\Sales\PurchaseItem;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchases::latest()->get();

        $summary = [
            'daily' => Purchases::whereDate('date', Carbon::today())->sum('total_amount'),
            'weekly' => Purchases::whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->sum('total_amount'),
            'monthly' => Purchases::whereMonth('date', Carbon::now()->month)
                ->whereYear('date', Carbon::now()->year)
                ->sum('total_amount'),
        ];

        return inertia('Sales/Purchase/Purchase', [
            'purchases' => $purchases,
            'purchaseSummary' => $summary,
            'title' => 'Pembelian'
        ]);
    }


    public function create()
    {
        return Inertia::render("Sales/Purchase/Create");
    }

    public function show($id)
    {
        $purchases = Purchases::with('items')->findOrFail($id);

        return Inertia::render("Sales/Purchase/Show", [
            'purchases' => $purchases,
            'title' => 'Detail Pembelian'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit' => 'required|string|max:50',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        $validated['date'] = Carbon::parse($validated['date'])->toDateString();

        DB::transaction(function () use ($validated) {
            $purchases = Purchases::create([
                'source' => $validated['source'],
                'date' => $validated['date'],
                'description' => $validated['description'] ?? null,
                'users_id' => Auth::id(),
            ]);

            $total = 0;
            foreach ($validated['items'] as $item) {
                $purchases->items()->create([
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
                $total += $item['subtotal'];
            }
            $purchases->update(['total_amount' => $total]);
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'source' => 'required|string|max:255',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.item_name' => 'required|string|max:255',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit' => 'required|string|max:50',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        $validated['date'] = Carbon::parse($validated['date'])->toDateString();

        DB::transaction(function () use ($validated, $id) {
            $purchase = Purchases::findOrFail($id);
            $purchase->update([
                'source' => $validated['source'],
                'date' => $validated['date'],
                'description' => $validated['description'] ?? null,
            ]);

            // Hapus semua item sebelumnya
            $purchase->items()->delete();

            $total = 0;
            foreach ($validated['items'] as $item) {
                $purchase->items()->create([
                    'item_name' => $item['item_name'],
                    'quantity' => $item['quantity'],
                    'unit' => $item['unit'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
                $total += $item['subtotal'];
            }

            // Update total pembelian
            $purchase->update(['total_amount' => $total]);
        });

        return redirect()->route('purchases.show', $id)->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Purchases $purchases)
    {
        $purchases->delete();

        return redirect()->route('purchases.index')->with('success', 'Product deleted successfully.');
    }
}
