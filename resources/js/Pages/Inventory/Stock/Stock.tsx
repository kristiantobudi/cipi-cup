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
import { DatePicker } from "@/Components/DatePicker";
import Dropdown from "@/Components/Dropdown";
import { CustomsModal } from "@/Components/Modal/ModalWithForm";
import { SelectComponent } from "@/Components/Select/Select";
import TableData from "@/Components/TableData";
import { TextareaWithLabel } from "@/Components/TextArea/TextAreaWithLabel";
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
import { Head, usePage } from "@inertiajs/react";
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

export default function StockPage() {
    // Show Product
    const products = (usePage().props.products ?? []) as {
        id: string;
        name: string;
        created_at: string;
    }[];
    const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));
    // Show Stock
    const stock = (usePage().props.stock ?? []) as {
        id: string;
        name: string;
        created_at: string;
    }[];

    const [visibleCount, setVisibleCount] = useState(10);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [type, setType] = useState("");

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
            setVisibleCount((prev) => Math.min(prev + 10, products.length));
        }
    };

    // Reset visibleCount if categories change
    useEffect(() => {
        setVisibleCount(10);
    }, [products]);

    const columns = [
        createSelectionColumn<MetricData>(),
        {
            accessorKey: "product_id",
            header: createSortableHeader<MetricData>(
                "Product Name",
                "product_id",
            ),
            cell: ({ row }) => {
                const productId = row.getValue("product_id") as string;
                const productName = productMap[productId] || "Unknown";
                return <div className="font-medium">{productName}</div>;
            },
        },
        createSizeColumnWithBadge<MetricData>("Stock In/Out", "type"),
        {
            accessorKey: "quantity",
            header: createSortableHeader<MetricData>("Quantity", "quantity"),
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        {row.getValue("quantity")}
                    </div>
                );
            },
        },
        createNumberColumn<MetricData>("Price", "price", {
            decimals: 2,
            prefix: "Rp ",
        }),
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
            <Head title={`Stock`} />
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Stock
                            </div>
                            <div className="p-6">
                                <CustomsModal
                                    title="Create New Product"
                                    triggerLabel="Add Product"
                                    routeName="stock.store"
                                    defaultData={{
                                        type: "",
                                        quantity: "",
                                        price: "",
                                        description: "",
                                        product_id: "",
                                        users_id: "",
                                    }}
                                    renderFields={(data, setData, errors) => (
                                        <>
                                            <div className="space-y-2">
                                                <SelectComponent
                                                    label="Stock Type"
                                                    placeholder="Select stock type"
                                                    items={typeOptions}
                                                    value={type}
                                                    onChange={(value) => {
                                                        setType(value);
                                                        setData("type", value);
                                                    }}
                                                />
                                                {/* <Input
                                                        id="type"
                                                        name="type"
                                                        type="text"
                                                        value={data.type}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Type"
                                                        className="p-2"
                                                        required
                                                    /> */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {errors.type && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.type}
                                                        </p>
                                                    )}
                                                    <Input
                                                        id="quantity"
                                                        name="quantity"
                                                        type="number"
                                                        value={data.quantity}
                                                        onChange={(e) =>
                                                            setData(
                                                                "quantity",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Quantity"
                                                        className="p-2"
                                                        required
                                                    />
                                                    {errors.quantity && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.quantity}
                                                        </p>
                                                    )}
                                                    <Input
                                                        id="price"
                                                        name="price"
                                                        type="number"
                                                        value={data.price}
                                                        onChange={(e) =>
                                                            setData(
                                                                "price",
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Price"
                                                        className="p-2"
                                                        required
                                                    />
                                                    {errors.price && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors.price}
                                                        </p>
                                                    )}
                                                </div>
                                                <Select
                                                    value={data.products_id}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "product_id",
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
                                                                Products
                                                            </SelectLabel>
                                                            <ScrollArea
                                                                ref={scrollRef}
                                                                className="h-60 w-full"
                                                                onScroll={
                                                                    handleScroll
                                                                }
                                                            >
                                                                {products
                                                                    .slice(
                                                                        0,
                                                                        visibleCount,
                                                                    )
                                                                    .map(
                                                                        (
                                                                            product,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    product.id
                                                                                }
                                                                                value={
                                                                                    product.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                            </ScrollArea>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                {errors.product_id && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.product_id}
                                                    </p>
                                                )}
                                                <TextareaWithLabel
                                                    key={data.description}
                                                />
                                                <DatePicker key={data.date} />
                                                {errors.date && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.date}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
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
                                    data={stock as any[]}
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
