import { PlusCircleIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { Button } from "../ui/button";

interface CustomModalProps {
    title: string;
    triggerLabel?: string;
    routeName: string;
    defaultData: { [key: string]: any };
    renderFields: (
        data: any,
        setData: (field: string, value: any) => void,
        errors: Record<string, string>
    ) => JSX.Element;
}

export function CustomsModal({
    title,
    triggerLabel = "Show Dialog",
    routeName,
    defaultData,
    renderFields,
}: CustomModalProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } =
        useForm(defaultData);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route(routeName), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <PlusCircleIcon className="h-4 w-4 mr-2" />
                    {triggerLabel}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form onSubmit={submit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            <div className="pb-4">
                                {renderFields(data, setData, errors)}
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpen(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <Button type="submit" disabled={processing}>
                            Create
                        </Button>
                        {/* <AlertDialogAction type="submit" disabled={processing}>
                        </AlertDialogAction> */}
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
