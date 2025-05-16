import {
    createActionsColumn,
    createDateColumn,
    createNumberColumn,
    createSelectionColumn,
    createSelectionColumnName,
    createSortableHeader,
    createStatusColumn,
    DataTable,
} from "@/Components/Advanced-Table";
import { DatePicker } from "@/Components/DatePicker";
import Dropdown from "@/Components/Dropdown";
import { AlertModalDeleted } from "@/Components/Modal/ModalDeleted";
import { CustomsModal } from "@/Components/Modal/ModalWithForm";
import TableData from "@/Components/TableData";
import { CardContent } from "@/Components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    SelectTrigger,
    SelectValue,
    Select,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectGroup,
} from "@/Components/ui/select";
import { Separator } from "@/components/ui/separator";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { usePage } from "@inertiajs/react";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart,
    Circle,
    CirclePlus,
    Edit,
    Eye,
    Link,
    Plug2Icon,
    Trash,
    TrendingUp,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MetricData = {
    id: string;
    name: string;
    category: string;
    value: number;
    previousValue: number;
    change: number;
    status: string;
    lastUpdated: string | Date;
    trend: number[];
    category_id: string;
    sku: string;
};

type Category = {
    id: string;
    name: string;
};

export default function Products() {
    const product: MetricData[] = usePage().props.products;
    const categories = (usePage().props.categories ?? []) as {
        id: string;
        name: string;
        created_at: string;
    }[];
    const categoryMap = Object.fromEntries(
        categories.map((p) => [p.id, p.name]),
    );
    const [visibleCount, setVisibleCount] = useState(10);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MetricData | null>(null);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            // Near bottom, load 10 more items
            setVisibleCount((prev) => Math.min(prev + 10, categories.length));
        }
    };

    // Reset visibleCount if categories change
    useEffect(() => {
        setVisibleCount(10);
    }, [categories]);
    // const columns = [
    //     // {
    //     //     key: "index",
    //     //     label: "No",
    //     //     render: (_value: any, _row: any, index: any) => index + 1,
    //     // },
    //     {
    //         key: "name",
    //         label: "Category Name",
    //     },
    //     {
    //         key: "created_at",
    //         label: "Created At",
    //         render: (val: any) => new Date(val).toLocaleDateString(),
    //     },
    // ];

    const columns = [
        createSelectionColumn<MetricData>(),
        {
            accessorKey: "name",
            header: createSortableHeader<MetricData>("Product Name", "name"),
            cell: ({ row }) => {
                return (
                    <div className="font-medium">{row.getValue("name")}</div>
                );
            },
        },
        {
            accessorKey: "sku",
            header: createSortableHeader<MetricData>("SKU", "sku"),
            cell: ({ row }) => {
                return <div className="font-medium">{row.getValue("sku")}</div>;
            },
        },
        {
            accessorKey: "category_id",
            header: createSortableHeader<MetricData>("Category", "category_id"),
            cell: ({ row }) => {
                const categoryId = row.getValue("category_id") as string;
                const categoryName = categoryMap[categoryId] || "Unknown";
                return <div className="font-medium">{categoryName}</div>;
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

        // createSelectionColumnName<MetricData>("Metric Name", "name"),
        // {
        //     accessorKey: "category",
        //     header: "Category",
        //     cell: ({ row }) => {
        //         const category = row.getValue("category") as string;
        //         return (
        //             <div className="flex items-center">
        //                 {category === "Sales" && (
        //                     <BarChart className="mr-2 h-4 w-4 text-primary opacity-70" />
        //                 )}
        //                 {category === "Marketing" && (
        //                     <TrendingUp className="mr-2 h-4 w-4 text-secondary opacity-70" />
        //                 )}
        //                 {category === "Web Analytics" && (
        //                     <Activity className="mr-2 h-4 w-4 text-primary opacity-70" />
        //                 )}
        //                 {category === "Customer" && (
        //                     <Users className="mr-2 h-4 w-4 text-secondary opacity-70" />
        //                 )}
        //                 {category}
        //             </div>
        //         );
        //     },
        // },
        // createNumberColumn<MetricData>("Current Value", "value", {
        //     decimals: 2,
        //     suffix: (row) => {
        //         const name = row.name.toLowerCase();
        //         if (name.includes("rate") || name.includes("satisfaction"))
        //             return "%";
        //         if (name.includes("time")) return "s";
        //         if (
        //             name.includes("cost") ||
        //             name.includes("value") ||
        //             name.includes("revenue")
        //         )
        //             return "$";
        //         return "";
        //     },
        // }),

        // {
        //     accessorKey: "change",
        //     header: "Change",
        //     cell: ({ row }) => {
        //         const change = row.getValue("change") as number;
        //         const isPositive = change > 0;
        //         const isNegative = change < 0;
        //         const isImprovement =
        //             row.original.name.toLowerCase().includes("cost") ||
        //             row.original.name.toLowerCase().includes("bounce") ||
        //             row.original.name.toLowerCase().includes("abandonment") ||
        //             row.original.name.toLowerCase().includes("time")
        //                 ? !isPositive
        //                 : isPositive;

        //         return (
        //             <div
        //                 className={`flex items-center ${
        //                     isImprovement
        //                         ? "text-green-600 dark:text-green-500"
        //                         : "text-red-600 dark:text-red-500"
        //                 }`}
        //             >
        //                 {isPositive ? (
        //                     <ArrowUpRight className="mr-1 h-4 w-4" />
        //                 ) : isNegative ? (
        //                     <ArrowDownRight className="mr-1 h-4 w-4" />
        //                 ) : null}
        //                 <span>{Math.abs(change).toFixed(1)}%</span>
        //             </div>
        //         );
        //     },
        // },
        // {
        //     accessorKey: "trend",
        //     header: "Trend",
        //     cell: ({ row }) => {
        //         const trend = row.getValue("trend") as number[];
        //         const min = Math.min(...trend);
        //         const max = Math.max(...trend);
        //         const range = max - min;

        //         return (
        //             <div className="w-24 h-8 flex items-end">
        //                 {trend.map((value, index) => {
        //                     const height =
        //                         range === 0
        //                             ? 50
        //                             : ((value - min) / range) * 100;
        //                     const isLast = index === trend.length - 1;

        //                     return (
        //                         <div
        //                             key={index}
        //                             className={`w-3 mx-0.5 rounded-t-sm ${
        //                                 isLast ? "bg-primary" : "bg-primary/30"
        //                             }`}
        //                             style={{
        //                                 height: `${Math.max(10, height)}%`,
        //                             }}
        //                         />
        //                     );
        //                 })}
        //             </div>
        //         );
        //     },
        // },
        // createStatusColumn<MetricData>("Status", "status", {
        //     improved: { label: "Improved", variant: "default" },
        //     declined: { label: "Declined", variant: "destructive" },
        //     unchanged: { label: "Unchanged", variant: "secondary" },
        // }),
        // createDateColumn<MetricData>("Last Updated", "lastUpdated", {
        //     month: "short",
        //     day: "numeric",
        //     hour: "2-digit",
        //     minute: "2-digit",
        // }),
        createActionsColumn<MetricData>([
            {
                label: "View Details",
                onClick: (data) => console.log("View", data),
                icon: <Eye className="h-4 w-4" />,
            },
            {
                label: "Edit",
                onClick: (data) => console.log("Edit", data),
                icon: <Edit className="h-4 w-4" />,
            },
            {
                label: "Delete",
                onClick: (data) => {
                    setSelectedItem(data);
                    setIsDeleteOpen(true);
                },
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
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-primary-foreground shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Products
                            </div>
                            <div className="p-6">
                                <AlertModalDeleted
                                    routeName="product.destroy"
                                    defaultData={{ id: selectedItem?.id }}
                                    open={isDeleteOpen}
                                    onClose={() => setIsDeleteOpen(false)}
                                    title="Hapus Data?"
                                    description={`Yakin ingin menghapus "${selectedItem?.name}"?`}
                                />

                                <CustomsModal
                                    title="Create New Product"
                                    triggerLabel="Add Product"
                                    routeName="product.store"
                                    defaultData={{
                                        name: "",
                                        sku: "",
                                        stock: "",
                                        min_stock: "",
                                        category_id: "",
                                        users_id: "",
                                    }}
                                    renderFields={(data, setData, errors) => (
                                        <>
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Product Name"
                                                        className="p-2"
                                                        required
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                    <Input
                                                        id="sku"
                                                        name="sku"
                                                        type="text"
                                                        value={data.sku}
                                                        onChange={(e) =>
                                                            setData(
                                                                "sku",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="SKU"
                                                        className="p-2"
                                                        required
                                                    />
                                                    {errors.sku && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.sku}
                                                        </p>
                                                    )}
                                                    <Input
                                                        id="stock"
                                                        name="stock"
                                                        type="number"
                                                        value={data.stock}
                                                        onChange={(e) =>
                                                            setData(
                                                                "stock",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Stock"
                                                        className="p-2"
                                                        required
                                                    />
                                                    {errors.stock && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.stock}
                                                        </p>
                                                    )}
                                                    <Input
                                                        id="min_stock"
                                                        name="min_stock"
                                                        type="number"
                                                        value={data.min_stock}
                                                        onChange={(e) =>
                                                            setData(
                                                                "min_stock",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Stock minimum"
                                                        className="p-2"
                                                        required
                                                    />
                                                    {errors.min_stock && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.min_stock}
                                                        </p>
                                                    )}
                                                </div>
                                                <Select
                                                    value={data.category_id}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "category_id",
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a fruit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Categories
                                                            </SelectLabel>
                                                            <ScrollArea
                                                                ref={scrollRef}
                                                                className="h-60 w-full"
                                                                onScroll={
                                                                    handleScroll
                                                                }
                                                            >
                                                                {categories
                                                                    .slice(
                                                                        0,
                                                                        visibleCount,
                                                                    )
                                                                    .map(
                                                                        (
                                                                            category,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    category.id
                                                                                }
                                                                                value={
                                                                                    category.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    category.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                            </ScrollArea>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.category_id && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.category_id}
                                                    </p>
                                                )}
                                                <DatePicker key={data.date} />
                                                {errors.date && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.date}
                                                    </p>
                                                )}
                                                {/* <Input
                                                    id="date"
                                                    name="date"
                                                    type="date"
                                                    value={data.date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Tanggal"
                                                    className="p-2"
                                                    required
                                                /> */}
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-6">
                        <div className="overflow-hidden bg-primary-foreground shadow-sm sm:rounded-lg">
                            {/* <div className="p-6">
                                <TableData
                                    columns={columns}
                                    data={categories as any[]}
                                />
                            </div> */}
                            <CardContent className="pt-6">
                                <DataTable
                                    columns={columns}
                                    data={product as any[]}
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
