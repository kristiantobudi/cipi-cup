import { ModalWithForm } from "@/Components/Modal/ModalWithForm";
import { Button } from "@/Components/ui/button";
import DefaultLayout from "@/Layouts/DefaultLayout";
import { Circle, CirclePlus, Link, Plug2Icon } from "lucide-react";

export default function Categories() {
    return (
        <DefaultLayout>
            <div className="py-4">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="p-6 text-gray-900 font-bold text-2xl">
                                Categories
                            </div>
                            <div className="p-6">
                                {/* <Button>
                                    <CirclePlus />
                                    Add Category
                                </Button> */}
                                <ModalWithForm />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 text-gray-900">
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quisquam, voluptatibus.
                        </p>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}
