// components/SelectComponent.tsx
import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type SelectOption = {
    label: string;
    value: string;
};

interface SelectComponentProps {
    label: string;
    placeholder?: string;
    items: SelectOption[];
    value?: string;
    onChange: (value: string) => void;
}

export function SelectComponent({
    label,
    placeholder = "Select an option",
    items,
    value,
    onChange,
}: SelectComponentProps) {
    return (
        <Select onValueChange={onChange} value={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
