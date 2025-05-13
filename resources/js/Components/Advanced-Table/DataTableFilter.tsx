"use client";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useDataTable } from "./DataTableContext";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function DataTableFilters() {
    const { table } = useDataTable();

    return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background border-muted-foreground/20">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 p-1">
                    {table
                        .getAllLeafColumns()
                        .filter(
                            (column) =>
                                column.getCanFilter() &&
                                column.id !== "select" &&
                                column.id !== "actions"
                        )
                        .map((column) => {
                            const columnName =
                                "meta" in column.columnDef &&
                                column.columnDef.meta?.label
                                    ? column.columnDef.meta.label
                                    : typeof column.columnDef.header ===
                                      "string"
                                    ? column.columnDef.header
                                    : column.id;

                            return (
                                <Popover key={column.id}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs border-dashed border-muted-foreground/20"
                                        >
                                            {columnName}
                                            {column.getFilterValue() ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 px-1"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Badge>
                                            ) : (
                                                <Filter className="ml-2 h-3 w-3 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-60 p-3"
                                        align="start"
                                    >
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-sm">
                                                Filter by {columnName}
                                            </h4>
                                            <Separator />
                                            <div className="space-y-2">
                                                <Input
                                                    placeholder={`Filter ${columnName}...`}
                                                    value={
                                                        (column.getFilterValue() as string) ??
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        column.setFilterValue(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-8 text-xs bg-background border-muted-foreground/20"
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            );
                        })}
                </div>
            </ScrollArea>
        </div>
    );
}
