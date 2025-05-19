<?php

namespace Database\Seeders;

use App\Models\Inventory\Product;
use App\Models\Sales\Sales;
use App\Models\Sales\SalesItems;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userId = 1; // sesuaikan dengan user ID yang valid
        $products = Product::inRandomOrder()->take(5)->get();

        // Buat data 20 penjualan dari 2–3 bulan lalu
        for ($i = 0; $i < 20; $i++) {
            DB::transaction(function () use ($products, $userId) {
                $date = Carbon::now()->subMonths(rand(2, 3))->subDays(rand(0, 30))->toDateString();

                $sales = Sales::create([
                    'id' => Str::uuid(),
                    'date' => $date,
                    'users_id' => $userId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $total = 0;

                // Ambil 1-3 produk acak per transaksi
                $items = $products->random(rand(1, 3));

                foreach ($items as $product) {
                    $quantity = rand(1, 10);
                    $subtotal = $product->price * $quantity;

                    $sales->items()->create([
                        'id' => Str::uuid(),
                        'product_id' => $product->id,
                        'product_name' => $product->name ?? 'Produk Default',
                        'product_price' => $product->price,
                        'quantity' => $quantity,
                        'subtotal' => $subtotal,
                        'users_id' => $userId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $total += $subtotal;
                }

                $sales->update([
                    'total_amount' => $total
                ]);
            });
        }
    }
}
