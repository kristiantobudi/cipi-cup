"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";
import { Badge } from "../ui/badge";

// Dynamic color generator fallback
const defaultColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
    "hsl(var(--chart-9))",
    "hsl(var(--chart-10))",
    "hsl(var(--chart-11))",
    "hsl(var(--chart-12))",
    "hsl(var(--chart-13))",
    "hsl(var(--chart-14))",
    "hsl(var(--chart-15))",
    "hsl(var(--chart-16))",
    "hsl(var(--chart-17))",
    "hsl(var(--chart-18))",
    "hsl(var(--chart-19))",
    "hsl(var(--chart-20))",
];

type DonutChartProps = {
    title?: string;
    description?: string;
    data: {
        name: string;
        value: number;
        quantity?: number;
    }[];
};

export function DonutsChartComponent({
    title = "Donut Chart",
    description = "Last 6 months",
    data,
}: DonutChartProps) {
    const chartData = data.map((item, index) => ({
        browser: item.name, // `browser` is just label
        visitors: item.value,
        fill: defaultColors[index % defaultColors.length],
    }));

    const total = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.visitors, 0),
        [chartData],
    );

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {};
        chartData.forEach((item, index) => {
            config[item.browser] = {
                label: item.browser,
                color: item.fill,
            };
        });
        return config;
    }, [chartData]);

    return (
        <div>
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    <Badge>{description}</Badge>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {total.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </div>
    );
}
