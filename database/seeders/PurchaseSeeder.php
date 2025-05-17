<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sales\Purchases;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PurchaseSeeder extends Seeder
{
    public function run()
    {
        // Dummy user id, ganti dengan user yang valid di db kamu
        $userId = 1;

        for ($i = 0; $i < 50; $i++) {
            $date = Carbon::create(2025, rand(4, 5), rand(1, 28)); // Random tanggal April atau Mei 2025

            DB::transaction(function () use ($date, $userId) {
                $purchase = Purchases::create([
                    'source' => 'Supplier ' . rand(1, 10),
                    'date' => $date->toDateString(),
                    'description' => 'Purchase description ' . rand(1, 100),
                    'users_id' => $userId,
                ]);

                $total = 0;
                $itemCount = rand(1, 5);

                for ($j = 0; $j < $itemCount; $j++) {
                    $quantity = rand(1, 10);
                    $price = rand(1000, 10000) / 100; // Harga random antara 10.00 sampai 100.00
                    $subtotal = $quantity * $price;

                    $purchase->items()->create([
                        'item_name' => 'Item ' . rand(1, 50),
                        'quantity' => $quantity,
                        'unit' => 'pcs',
                        'price' => $price,
                        'subtotal' => $subtotal,
                    ]);

                    $total += $subtotal;
                }

                $purchase->update(['total_amount' => $total]);
            });
        }
    }
}
