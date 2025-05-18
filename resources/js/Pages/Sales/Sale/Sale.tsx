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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/Components/ui/card";
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

export default function SalesPage() {
    // Show Product
    const purchases = (usePage().props.purchases ?? []) as {
        id: string;
        source: string;
        total_amount: number;
        created_at: string;
    }[];
    const purchaseSummary = (usePage().props.purchaseSummary ?? {}) as {
        daily: number;
        weekly: number;
        monthly: number;
    };

    // Show Stock

    const [visibleCount, setVisibleCount] = useState(10);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [type, setType] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MetricData | null>(null);

    // Enum Type
    const typeEnum = ["in", "out"] as const;
    const typeOptions = typeEnum.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));
    // to Scroll from scroll area
    const handleScroll = () => {
        const el = scrollRef.current;
        if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            // Near bottom, load 10 more items
            setVisibleCount((prev) => Math.min(prev + 10, purchases.length));
        }
    };

    // Reset visibleCount if categories change
    useEffect(() => {
        setVisibleCount(10);
    }, [purchases]);

    const columns = [
        createSelectionColumn<MetricData>(),
        {
            accessorKey: "source",
            header: createSortableHeader<MetricData>("Product Name", "source"),
            cell: ({ row }) => {
                return (
                    <div className="font-medium">{row.getValue("source")}</div>
                );
            },
        },
        {
            accessorKey: "total_amount",
            header: createSortableHeader<MetricData>(
                "Product Name",
                "total_amount",
            ),
            cell: ({ row }) => {
                const value = row.getValue("total_amount") as number;

                const formatted = new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                }).format(value);
                return (
                    <Badge className="font-medium" variant="destructive">
                        {formatted}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: "Tanggal Pembuatan",
            cell: ({ row }) => {
                const rawDate = row.getValue("created_at") as string;
                const formattedDate = new Date(rawDate).toLocaleDateString(
                    "id-ID",
                    {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    },
                );

                return <div className="font-medium">{formattedDate}</div>;
            },
        },
        createActionsColumn<MetricData>([
            {
                label: "View",
                icon: <Eye className="h-4 w-4" />,
                href: (data) => route("purchases.show", data.id),
            },
            {
                label: "Edit",
                onClick: (data) => console.log("Edit", data),
                icon: <Edit className="h-4 w-4" />,
            },
            {
                label: "Delete",
                onClick: (data) => console.log("Delete", data),
                icon: <Trash className="h-4 w-4" />,
            },
        ]),
    ];

    const renderDetailPanel = ({ row }: { row: any }) => {
        const metric = row.original;

        return (
            <div className="p-4">
                <h3 className="text-lg font-medium mb-2">
                    {metric.name} Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            Current Value
                        </div>
                        <div className="text-2xl font-bold">
                            {metric.value.toFixed(2)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            Previous Value
                        </div>
                        <div className="text-2xl font-bold">
                            {metric.previousValue.toFixed(2)}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            Change
                        </div>
                        <div
                            className={`text-2xl font-bold ${
                                metric.change > 0
                                    ? "text-green-600 dark:text-green-500"
                                    : "text-red-600 dark:text-red-500"
                            }`}
                        >
                            {metric.change > 0 ? "+" : ""}
                            {metric.change.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DefaultLayout>
            <Head title={`Pembelian`} />
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8 ">
                    <div className="bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Purchases
                            </div>
                            <div className="p-6">
                                <Button variant="default">
                                    <Link
                                        href={route("purchases.create")}
                                        className="flex flex-row gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        Add New
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6">
                        <CustomChart
                            data={purchases}
                            config={{
                                total_amount: {
                                    label: "Total Purchases",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            xKey="date"
                            yKeys={["total_amount"]}
                            summary={purchaseSummary}
                        />
                    </div>
                    <div className="pt-6">
                        <div className="overflow-hidden bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                            {/* <div className="p-6">
                                <TableData
                                    columns={columns}
                                    data={categories as any[]}
                                />
                            </div> */}
                            <CardContent className="pt-6">
                                <DataTable
                                    columns={columns}
                                    data={purchases as any[]}
                                    searchKey="name"
                                    searchPlaceholder="Search metrics..."
                                    exportData={true}
                                    exportFilename="accuracy-metrics"
                                    enableGrouping={true}
                                    enableExpanding={true}
                                    renderDetailPanel={renderDetailPanel}
                                    enableFilters={true}
                                    enableSavedViews={true}
                                    variant="card"
                                    savedViews={[
                                        {
                                            id: "improved",
                                            name: "Improved Metrics",
                                            filters: [
                                                {
                                                    id: "status",
                                                    value: "improved",
                                                },
                                            ],
                                            sorting: [
                                                { id: "change", desc: true },
                                            ],
                                            grouping: [],
                                            columnVisibility: {},
                                        },
                                        {
                                            id: "declined",
                                            name: "Declined Metrics",
                                            filters: [
                                                {
                                                    id: "status",
                                                    value: "declined",
                                                },
                                            ],
                                            sorting: [
                                                { id: "change", desc: false },
                                            ],
                                            grouping: [],
                                            columnVisibility: {},
                                        },
                                        {
                                            id: "by-category",
                                            name: "Grouped by Category",
                                            filters: [],
                                            sorting: [
                                                { id: "category", desc: false },
                                            ],
                                            grouping: ["category"],
                                            columnVisibility: {},
                                        },
                                    ]}
                                    onSaveView={(view) =>
                                        console.log("Save view", view)
                                    }
                                    onDeleteView={(viewId) =>
                                        console.log("Delete view", viewId)
                                    }
                                />
                            </CardContent>
                        </div>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
