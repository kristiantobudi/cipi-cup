import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => JSX.Element;
}

interface TableDataProps<T> {
    columns: Column<T>[];
    data: T[];
}

export default function TableData<T extends { id?: number | string }>({
    columns,
    data,
}: TableDataProps<T>) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                            {column.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((row, i) => (
                    <TableRow key={row.id ?? i}>
                        {columns.map((column) => {
                            const value = row[column.key as keyof T];
                            return (
                                <TableCell key={String(column.key)}>
                                    {column.render
                                        ? column.render(value, row)
                                        : (value as any)}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
