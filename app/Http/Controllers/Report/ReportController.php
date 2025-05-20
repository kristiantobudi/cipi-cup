<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\Sales\Purchases;
use App\Models\Sales\Sales;
use App\Models\Sales\SalesItems;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        $weekly = Carbon::now()->startOfWeek();
        $monthly = Carbon::now()->startOfMonth();
        $yearly = Carbon::now()->startOfYear();
        $month = Carbon::now()->month;
        $year = Carbon::now()->year;
        $daily = Carbon::now()->subDays(30);

        $purchases = Purchases::latest()->get();
        $sales = Sales::latest()->get();

        $salesSummary = [
            'daily' => Sales::whereDate('date', $today)->sum('total_amount'),
            'weekly' => Sales::whereBetween('date', [$weekly, $today])->sum('total_amount'),
            'monthly' => Sales::whereMonth('date', $today->month)
                ->whereYear('date', $today->year)
                ->sum('total_amount'),
            'yearly' => Sales::whereYear('date', $today->year)->sum('total_amount'),
            'daily' => Sales::whereDate('date', $daily)->sum('total_amount'),
        ];

        $purchaseSummary = [
            'daily' => Purchases::whereDate('date', $today)->sum('total_amount'),
            'weekly' => Purchases::whereBetween('date', [$weekly, $today])->sum('total_amount'),
            'monthly' => Purchases::whereMonth('date', $today->month)
                ->whereYear('date', $today->year)
                ->sum('total_amount'),
            'yearly' => Purchases::whereYear('date', $today->year)->sum('total_amount'),
            'daily' => Purchases::whereDate('date', $daily)->sum('total_amount'),
        ];

        $profit = [
            'daily' => $salesSummary['daily'] - $purchaseSummary['daily'],
            'weekly' => $salesSummary['weekly'] - $purchaseSummary['weekly'],
            'monthly' => $salesSummary['monthly'] - $purchaseSummary['monthly'],
            'yearly' => $salesSummary['yearly'] - $purchaseSummary['yearly'],
        ];

        $monthly = Sales::selectRaw('MONTH(date) as month, SUM(total_amount) as total')->whereYear('date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [
                    Carbon::createFromFormat('m', $item->month)->format('F') => $item->total,
                ];
            });

        $productSales = SalesItems::select(
            'sales_items.product_name',
            DB::raw('SUM(sales_items.quantity) as total_quantity'),
            DB::raw('SUM(sales_items.subtotal) as total_sales'),
            DB::raw('MONTH(sales.date) as month')
        )
            ->join('sales', 'sales_items.sales_id', '=', 'sales.id')
            ->whereYear('sales.date', now()->year)
            ->groupBy('month', 'sales_items.product_name')
            ->orderBy('month')
            ->orderByDesc('total_sales')
            ->get();

        $dataByMonth = [];

        foreach ($productSales as $item) {
            $month = $item->month;
            if (!isset($dataByMonth[$month])) {
                $dataByMonth[$month] = [];
            }
            $dataByMonth[$month][] = [
                'product_name' => $item->product_name,
                'total_quantity' => $item->total_quantity,
                'total_sales' => $item->total_sales,
            ];
        }

        return inertia('Report/Report', [
            'purchases' => $purchases,
            'sales' => $sales,
            'salesSummary' => $salesSummary,
            'purchaseSummary' => $purchaseSummary,
            'profitSummary' => $profit,
            'averageMontlySales' => $monthly,
            'productSales' => $productSales,
            'dataByMonth' => $dataByMonth,
            'title' => 'Laporan Laba Rugi',
        ]);
    }
}
