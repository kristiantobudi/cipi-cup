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
import { ModalWithForm } from "@/Components/Modal/ModalWithForm";
import TableData from "@/Components/TableData";
import { CardContent } from "@/Components/ui/card";
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
};

export default function Categories() {
    const categories: { name: string; createdAt: string }[] =
        usePage().props.categories;

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
            header: createSortableHeader<MetricData>("Category Name", "name"),
            cell: ({ row }) => {
                return (
                    <div className="font-medium">{row.getValue("name")}</div>
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
                    }
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
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-primary-foreground shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Categories
                            </div>
                            <div className="p-6">
                                <ModalWithForm />
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
                                    data={categories}
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
