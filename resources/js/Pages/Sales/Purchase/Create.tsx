import { CustomDatePicker } from "@/Components/DatePicker/CustomDatePicker";
import Dropdown from "@/Components/Dropdown";
import InputLabel from "@/Components/InputLabel";
import { CustomsModal } from "@/Components/Modal/ModalWithForm";
import { SelectComponent } from "@/Components/Select/Select";
import TableData from "@/Components/TableData";
import { TextareaWithLabel } from "@/Components/TextArea/TextAreaWithLabel";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/Components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    PlusCircleIcon,
    Save,
    ShoppingBasketIcon,
    ShoppingCart,
    Undo2Icon,
} from "lucide-react";
import React, { FormEvent, useRef, useState } from "react";

type PurchaseProps = {
    source: string;
    item_name: string;
    quantity: number;
    price: number;
    unit: string;
    subtotal: number;
    date: string;
    description: string;
};

export default function CretePurchasePage() {
    // Show Product
    const purchases: PurchaseProps[] = usePage().props.purchases;
    const { data, setData, post, processing, errors, reset } = useForm({
        source: "",
        date: new Date(),
        description: "",
        item_name: "",
        quantity: 0,
        unit: "pcs",
        price: 0,
        items: [] as PurchaseProps[],
    });
    const [item, setItem] = useState({
        item_name: "",
        quantity: 0,
        unit: "pcs",
        price: 0,
    });

    const addItem = () => {
        const subtotal = item.quantity * item.price;
        setData("items", [...data.items, { ...item, subtotal }]);
        setItem({ item_name: "", quantity: 0, unit: "pcs", price: 0 });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("purchases.store"));
    };

    const [visibleCount, setVisibleCount] = useState(10);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [type, setType] = useState("");

    // Enum Type
    const typeEnum = ["in", "out"] as const;
    const typeOptions = typeEnum.map((type) => ({
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
    }));

    return (
        <DefaultLayout>
            <Head title={`Buat Pembelian`} />
            <form onSubmit={handleSubmit}>
                <div className="py-4">
                    <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                            <div className="flex items-center justify-between">
                                <div className="p-6 text-gray-900 font-bold text-2xl">
                                    Create Purchase
                                </div>
                                <div className="p-6 flex flex-row space-x-4">
                                    <Button variant="secondary">
                                        <Link
                                            href={route("purchases.index")}
                                            className="flex flex-row gap-2"
                                        >
                                            <Undo2Icon className="w-5 h-5" />
                                            Back
                                        </Link>
                                    </Button>
                                    <Button type="submit">
                                        <Save className="w-5 h-5" />
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6">
                            <div className="overflow-hidden bg-primary-foreground rounded-xl border bg-card text-card-foreground shadow">
                                <CardContent className="pt-6">
                                    <div>
                                        <div className="text-1xl font-bold pb-4 flex flex-row gap-2 text-muted-foreground">
                                            <ShoppingBasketIcon className="w-5 h-5" />
                                            <h1>Asal Toko Pembelian</h1>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                            <div className="flex flex-col">
                                                <Input
                                                    id="source"
                                                    name="source"
                                                    type="text"
                                                    value={data.source}
                                                    onChange={(e) =>
                                                        setData(
                                                            "source",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Toko"
                                                    className="p-2"
                                                />
                                                {errors.source && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.source}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <CustomDatePicker
                                                    value={
                                                        data.date
                                                            ? new Date(
                                                                  data.date,
                                                              )
                                                            : undefined
                                                    }
                                                    onChange={(date) =>
                                                        setData("date", date)
                                                    }
                                                />
                                                {errors.date && (
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors.date}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <TextareaWithLabel
                                                    key={data.description}
                                                    placeholder="Type your message here."
                                                />
                                            </div>
                                        </div>
                                        <div className="text-1xl font-bold pb-4 flex flex-row gap-2 text-muted-foreground">
                                            <ShoppingBasketIcon className="w-5 h-5" />
                                            <h1>Pembelian</h1>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                id="item_name"
                                                name="item_name"
                                                type="text"
                                                value={item.item_name}
                                                onChange={(e) =>
                                                    setItem({
                                                        ...item,
                                                        item_name:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Item Name"
                                                className="p-2"
                                            />
                                            {errors.item_name && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.item_name}
                                                </p>
                                            )}
                                            <Input
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    setItem({
                                                        ...item,
                                                        quantity:
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                    })
                                                }
                                                placeholder="Quantity Item"
                                                className="p-2"
                                            />
                                            {errors.quantity && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.quantity}
                                                </p>
                                            )}
                                            <Input
                                                id="unit"
                                                name="unit"
                                                type="text"
                                                value={item.unit}
                                                onChange={(e) =>
                                                    setItem({
                                                        ...item,
                                                        unit: e.target.value,
                                                    })
                                                }
                                                placeholder="Unit Item"
                                                className="p-2"
                                            />
                                            {errors.unit && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.unit}
                                                </p>
                                            )}
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                value={item.price}
                                                onChange={(e) =>
                                                    setItem({
                                                        ...item,
                                                        price:
                                                            parseInt(
                                                                e.target.value,
                                                            ) || 0,
                                                    })
                                                }
                                                placeholder="Price"
                                                className="p-2"
                                            />
                                            {errors.price && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pt-6 flex flex-col justify-end items-end">
                                            <div className="w-full ">
                                                <ul className="p-2">
                                                    {data.items.map(
                                                        (item, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="bg-gray-50 border-b py-1 px-2 flex justify-end items-center gap-2 text-sm text-gray-600 font-medium"
                                                            >
                                                                @{item.quantity}{" "}
                                                                {item.unit}{" "}
                                                                {item.item_name}{" "}
                                                                * Rp
                                                                {item.price} =
                                                                Rp.
                                                                {item.subtotal}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="flex flex-row gap-1 pt-2">
                                                <Button
                                                    onClick={addItem}
                                                    type="button"
                                                >
                                                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                                                    Tambah Item
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </DefaultLayout>
    );
}
