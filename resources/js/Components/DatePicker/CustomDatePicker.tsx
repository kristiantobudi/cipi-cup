"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

export function CustomDatePicker({
    value,
    onChange,
}: {
    value: Date;
    onChange: (value: Date) => void;
}) {
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild className="bg-white">
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(day) => day && onChange(day)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
