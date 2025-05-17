import DefaultLayout from "@/Layouts/DefaultLayout";
import { usePage, Link, router, Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/Components/ui/card";
import {
    Calendar,
    CircleX,
    Pencil,
    Save,
    SaveAllIcon,
    ShoppingBasketIcon,
    Undo2Icon,
} from "lucide-react";
import React from "react";
import { format } from "path";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CustomDatePicker } from "@/Components/DatePicker/CustomDatePicker";
import { TextareaWithLabel } from "@/Components/TextArea/TextAreaWithLabel";

type PurchaseItem = {
    id: number;
    item_name: string;
    quantity: number;
    unit: string;
    price: number;
    subtotal: number;
};

type PurchaseDetailProps = {
    id: number;
    source: string;
    date: string;
    description: string;
    items: PurchaseItem[];
};

export default function ShowPurchasePage() {
    const purchase = usePage().props.purchases as PurchaseDetailProps;
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedPurchase, setEditedPurchase] = React.useState(purchase);

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formattedDate = new Date(purchase.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const handleSave = () => {
        router.put(route("purchases.update", purchase.id), editedPurchase, {
            onSuccess: () => {
                setIsEditing(false);
            },
        });
    };

    return (
        <DefaultLayout>
            <Head title={`Pembelian ${purchase.source}`} />
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Detail Pembelian
                            </div>
                            <div className="p-6 flex flex-row gap-2">
                                <Button variant="secondary">
                                    <Link
                                        href={route("purchases.index")}
                                        className="flex flex-row gap-2"
                                    >
                                        <Undo2Icon className="w-5 h-5" />
                                        Kembali
                                    </Link>
                                </Button>

                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            variant="destructive"
                                        >
                                            <CircleX className="w-5 h-5" />
                                            Batal
                                        </Button>
                                        <Button onClick={handleSave}>
                                            <Save className="w-5 h-5" />
                                            Simpan
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Pencil className="w-5 h-5" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                        <CardContent className="pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                {isEditing ? (
                                    <Input
                                        type="text"
                                        className="w-full border px-2 py-1 rounded"
                                        value={editedPurchase.source}
                                        onChange={(e) =>
                                            setEditedPurchase({
                                                ...editedPurchase,
                                                source: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Toko
                                        </p>
                                        <p className="font-semibold">
                                            {purchase.source}
                                        </p>
                                    </div>
                                )}
                                {isEditing ? (
                                    <CustomDatePicker
                                        value={editedPurchase.date}
                                        onChange={(date) =>
                                            setEditedPurchase({
                                                ...editedPurchase,
                                                date: date,
                                            })
                                        }
                                    />
                                ) : (
                                    <div className="space-y-2 ">
                                        <div className="flex flex-row items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <p className="text-sm ">Tanggal</p>
                                        </div>
                                        <p className="font-semibold">
                                            {formattedDate}
                                        </p>
                                    </div>
                                )}
                                {isEditing ? (
                                    <TextareaWithLabel
                                        key={editedPurchase.description}
                                        placeholder="Type your message here."
                                    />
                                ) : (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-muted-foreground">
                                            Catatan
                                        </p>
                                        <p className="font-semibold whitespace-pre-line">
                                            {purchase.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="pt-6">
                                <div className="text-lg font-bold pb-2 flex flex-row items-center gap-2 text-muted-foreground">
                                    <ShoppingBasketIcon className="w-5 h-5" />
                                    <h1>Daftar Item Dibeli</h1>
                                </div>
                                <div className="overflow-auto border rounded">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted text-left text-muted-foreground">
                                            <tr>
                                                <th className="p-2">Item</th>
                                                <th className="p-2">Qty</th>
                                                <th className="p-2">Satuan</th>
                                                <th className="p-2">Harga</th>
                                                <th className="p-2">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editedPurchase.items.map(
                                                (item, index) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-t"
                                                    >
                                                        <td className="p-2">
                                                            {isEditing ? (
                                                                <Input
                                                                    className=" w-auto"
                                                                    value={
                                                                        item.item_name
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const updatedItems =
                                                                            [
                                                                                ...editedPurchase.items,
                                                                            ];
                                                                        updatedItems[
                                                                            index
                                                                        ].item_name =
                                                                            e.target.value;
                                                                        setEditedPurchase(
                                                                            {
                                                                                ...editedPurchase,
                                                                                items: updatedItems,
                                                                            },
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                item.item_name
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            {isEditing ? (
                                                                <Input
                                                                    type="number"
                                                                    value={
                                                                        item.quantity
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const updatedItems =
                                                                            [
                                                                                ...editedPurchase.items,
                                                                            ];
                                                                        updatedItems[
                                                                            index
                                                                        ].quantity =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            ) ||
                                                                            0;
                                                                        updatedItems[
                                                                            index
                                                                        ].subtotal =
                                                                            updatedItems[
                                                                                index
                                                                            ]
                                                                                .price *
                                                                            updatedItems[
                                                                                index
                                                                            ]
                                                                                .quantity;
                                                                        setEditedPurchase(
                                                                            {
                                                                                ...editedPurchase,
                                                                                items: updatedItems,
                                                                            },
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                item.quantity
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            {isEditing ? (
                                                                <Input
                                                                    className=" w-auto"
                                                                    value={
                                                                        item.unit
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const updatedItems =
                                                                            [
                                                                                ...editedPurchase.items,
                                                                            ];
                                                                        updatedItems[
                                                                            index
                                                                        ].unit =
                                                                            e.target.value;
                                                                        setEditedPurchase(
                                                                            {
                                                                                ...editedPurchase,
                                                                                items: updatedItems,
                                                                            },
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                item.unit
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            {isEditing ? (
                                                                <Input
                                                                    className=" w-auto"
                                                                    value={
                                                                        item.price
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const updatedItems =
                                                                            [
                                                                                ...editedPurchase.items,
                                                                            ];
                                                                        updatedItems[
                                                                            index
                                                                        ].price =
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                        setEditedPurchase(
                                                                            {
                                                                                ...editedPurchase,
                                                                                items: updatedItems,
                                                                            },
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Badge variant="secondary">
                                                                    {formatRupiah(
                                                                        item[
                                                                            "price"
                                                                        ],
                                                                    )}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td className="p-2">
                                                            {isEditing ? (
                                                                <Input
                                                                    className=" w-auto"
                                                                    value={
                                                                        item.subtotal
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const updatedItems =
                                                                            [
                                                                                ...editedPurchase.items,
                                                                            ];
                                                                        updatedItems[
                                                                            index
                                                                        ].subtotal =
                                                                            Number(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                        setEditedPurchase(
                                                                            {
                                                                                ...editedPurchase,
                                                                                items: updatedItems,
                                                                            },
                                                                        );
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Badge variant="secondary">
                                                                    {formatRupiah(
                                                                        item[
                                                                            "subtotal"
                                                                        ],
                                                                    )}
                                                                </Badge>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
