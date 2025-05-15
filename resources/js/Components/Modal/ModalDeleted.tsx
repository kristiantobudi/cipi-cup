import { FormEventHandler, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";
import { router, useForm } from "@inertiajs/react";
import { Button } from "../ui/button";

export function AlertModalDeleted({
    open,
    onClose,
    title,
    description,
    routeName,
    defaultData,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    routeName: string;
    defaultData: { [key: string]: any };
}) {
    const handleDelete = () => {
        router.delete(route(routeName, defaultData.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
