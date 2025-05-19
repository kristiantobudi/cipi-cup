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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
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
import React, { FormEvent, useEffect, useRef, useState } from "react";

type SalesProps = {
    quantity: number;
    subtotal: number;
    date: string;
    product_id: string;
    product_name: string;
    product_price: number;
};

export default function CreteSalePage() {
    // Show Product
    // const sales: SalesProps[] = usePage().props.sales;
    const products = (usePage().props.products ?? []) as {
        id: string;
        created_at: string;
        product_price: number;
        product_name: string;
        product_id: string;
    }[];
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]));
    const { data, setData, post, processing, errors, reset } = useForm({
        date: new Date(),
        quantity: 0,
        product_price: 0,
        product_name: "",
        product_id: "",
        items: [] as SalesProps[],
    });
    const [item, setItem] = useState({
        product_name: "",
        quantity: 0,
        unit: "pcs",
        product_price: 0,
    });

    const addItem = () => {
        const subtotal = item.quantity * item.product_price;
        setData("items", [
            ...data.items,
            { ...item, subtotal, product_id: data.product_id },
        ]);
        setItem({
            product_name: "",
            quantity: 0,
            unit: "pcs",
            product_price: 0,
        });

        setData("product_id", "");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("sales.store"));
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
            // Near bottom, load 10 more items
            setVisibleCount((prev) => Math.min(prev + 10, products.length));
        }
    };

    useEffect(() => {
        setVisibleCount(20);
    }, [products]);

    const [visibleCount, setVisibleCount] = useState(10);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [type, setType] = useState("");

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
                                            href={route("sales.index")}
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
                                            <h1>Penjualan</h1>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                            <div className="flex flex-col">
                                                <Select
                                                    value={data.product_id}
                                                    onValueChange={(value) => {
                                                        setData(
                                                            "product_id",
                                                            value,
                                                        );
                                                        const selectedProduct =
                                                            productMap[value];
                                                        if (selectedProduct) {
                                                            setItem({
                                                                ...item,
                                                                product_name:
                                                                    selectedProduct.product_name,
                                                                product_price:
                                                                    selectedProduct.product_price,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih Product" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Product
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
                                                                                    product.product_name
                                                                                }{" "}
                                                                                -
                                                                                Rp
                                                                                {
                                                                                    product.product_price
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
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel
                                                    htmlFor="Quantity"
                                                    value="Quantity"
                                                />
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
                                                                    e.target
                                                                        .value,
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
                                            </div>
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
                                                                {
                                                                    item.product_name
                                                                }{" "}
                                                                * Rp
                                                                {
                                                                    item.product_price
                                                                }{" "}
                                                                = Rp.
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
