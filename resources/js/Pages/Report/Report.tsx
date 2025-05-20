import {
    createActionsColumn,
    createDateColumn,
    createNumberColumn,
    createSelectionColumn,
    createSelectionColumnName,
    createSizeColumnWithBadge,
    createSortableHeader,
    createStatusColumn,
    DataTable,
} from "@/Components/Advanced-Table";
import { CustomChart } from "@/Components/Chart/Chart";
import { DonutsChartComponent } from "@/Components/Chart/DonutsChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart,
    Circle,
    CirclePlus,
    Edit,
    Eye,
    Plug2Icon,
    Plus,
    Trash,
    TrendingUp,
    Users,
} from "lucide-react";
import React from "react";
import { useEffect, useRef, useState } from "react";

type MetricData = {
    id: string;
    name: string;
    category: string;
    product_id: string;
    type: string;
    price: number;
    previousValue: number;
    change: number;
    status: string;
    lastUpdated: string | Date;
    trend: number[];
    quantity: number;
};

interface PurchaseData {
    date: string;
    total_amount: number;
}

interface PurchaseSummary {
    daily: number;
    weekly: number;
    monthly: number;
}

interface Props extends PageProps {
    purchaseData: PurchaseData[];
    purchaseSummary: PurchaseSummary;
}

type ProfitType = {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
};

type MonthlyType = {
    month: string;
    total_amount: number;
};

export default function ReportPage() {
    const purchaseSummary = (usePage().props.purchaseSummary ??
        {}) as PurchaseSummary;
    const profitSummary = (usePage().props.profitSummary ?? {}) as ProfitType;
    const averageMontlySales = (usePage().props.averageMontlySales ??
        {}) as MonthlyType;
    const purchases = (usePage().props.purchases ?? []) as {
        id: string;
        source: string;
        total_amount: number;
        created_at: string;
    }[];
    // Show Product
    const sales = (usePage().props.sales ?? []) as {
        id: string;
        total_amount: number;
        created_at: string;
    }[];
    const salesSummary = (usePage().props.salesSummary ?? {}) as {
        daily: number;
        weekly: number;
        monthly: number;
    };
    const dataByMonth = (usePage().props.dataByMonth ?? {}) as Record<
        string,
        {
            product_name: string;
            total_sales: string;
            total_quantity: string;
        }[]
    >;

    const monthLabels: Record<string, string> = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };

    const months = Object.keys(dataByMonth).sort(
        (a, b) => Number(a) - Number(b),
    );
    const [activeMonth, setActiveMonth] = React.useState<string>(months[0]);

    const currentMonthData = dataByMonth[activeMonth] || [];

    const salesData = currentMonthData.map((product) => ({
        name: product.product_name,
        value: parseFloat(product.total_sales),
    }));

    const salesQuantity = currentMonthData.map((product) => ({
        name: product.product_name,
        value: parseFloat(product.total_quantity),
    }));

    // Show Stock

    const [visibleCount, setVisibleCount] = useState(10);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeChart, setActiveChart] = useState<"sales" | "purchases">(
        "sales",
    );

    // Enum Type
    const typeEnum = ["in", "out"] as const;
    const typeOptions = typeEnum.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));
    // to Scroll from scroll area

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    // Reset visibleCount if categories change

    return (
        <DefaultLayout>
            <Head title={`Report`} />
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8 ">
                    <div className="bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Report
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid grid-flow-row-dense grid-cols-3 grid-rows-3-cols-2 gap-4">
                            <Card className="bg-primary-foreground col-span-2">
                                <div className="p-6 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold flex items-center">
                                        Monthly Report
                                        <TrendingUp className="h-5 w-5 ml-2 text-green-500" />
                                    </h2>
                                    <Select
                                        value={activeMonth}
                                        onValueChange={setActiveMonth}
                                    >
                                        <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5">
                                            <SelectValue placeholder="Select month" />
                                        </SelectTrigger>
                                        <SelectContent
                                            align="end"
                                            className="rounded-xl"
                                        >
                                            {months.map((month) => (
                                                <SelectItem
                                                    key={month}
                                                    value={month}
                                                >
                                                    {monthLabels[month]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between px-6">
                                    <DonutsChartComponent
                                        title="Total Amount"
                                        description={`Sales in ${monthLabels[activeMonth]}`}
                                        data={salesData}
                                    />
                                    <DonutsChartComponent
                                        title="Total Product Sold"
                                        description={`Quantity in ${monthLabels[activeMonth]}`}
                                        data={salesQuantity}
                                    />
                                </div>
                                <CardFooter className="flex-col gap-2 text-sm">
                                    <div className="leading-none text-muted-foreground">
                                        Showing total for the{" "}
                                        <Badge className="font-medium px-1">
                                            {monthLabels[activeMonth]}
                                        </Badge>{" "}
                                        month
                                    </div>
                                </CardFooter>
                            </Card>
                            <div className="col-span-1 space-y-4">
                                <Card className="bg-primary-foreground">
                                    <div className="p-6 flex items-center justify-center">
                                        <h2 className="text-lg font-semibold flex items-center">
                                            Daily Report
                                            <BarChart className="h-5 w-5 ml-2 text-blue-500" />
                                        </h2>
                                    </div>
                                    <div>
                                        {Object.entries(profitSummary).map(
                                            ([Key, value]) => (
                                                <div
                                                    key={Key}
                                                    className="flex items-center justify-between px-4 py-2 border-b border-gray-200 gap-8"
                                                >
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {Key.charAt(
                                                            0,
                                                        ).toUpperCase() +
                                                            Key.slice(1)}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(value)}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </Card>
                                <Card className="bg-primary-foreground">
                                    <div className="p-6 flex items-center justify-center">
                                        <h2 className="text-lg font-semibold flex items-center">
                                            Monthly Report
                                            <BarChart className="h-5 w-5 ml-2 text-blue-500" />
                                        </h2>
                                    </div>
                                    <div>
                                        {Object.entries(averageMontlySales).map(
                                            ([Key, value]) => (
                                                <div
                                                    key={Key}
                                                    className="flex items-center justify-between px-4 py-2 border-b border-gray-200 gap-8"
                                                >
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {Key.charAt(
                                                            0,
                                                        ).toUpperCase() +
                                                            Key.slice(1)}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {formatCurrency(value)}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={
                                    activeChart === "purchases"
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setActiveChart("purchases")}
                            >
                                Purchase Chart
                            </Button>
                            <Button
                                variant={
                                    activeChart === "purchases"
                                        ? "outline"
                                        : "default"
                                }
                                onClick={() => setActiveChart("sales")}
                            >
                                Sales Chart
                            </Button>
                        </div>
                        {activeChart === "purchases" && (
                            <CustomChart
                                data={purchases}
                                config={{
                                    total_amount: {
                                        label: "Total Pembelian",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                xKey="date"
                                yKeys={["total_amount"]}
                                summary={purchaseSummary}
                            />
                        )}

                        {activeChart === "sales" && (
                            <CustomChart
                                data={sales}
                                config={{
                                    total_amount: {
                                        label: "Total Pembelian",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                xKey="date"
                                yKeys={["total_amount"]}
                                summary={salesSummary}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
