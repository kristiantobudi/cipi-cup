"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../ui/chart";

import { ReusableBarChartProps } from "@/types/chart";

type Period = "daily" | "weekly" | "monthly";

const periods: Period[] = ["daily", "weekly", "monthly"];

function groupDataByPeriod<T extends Record<string, any>>(
    data: T[],
    period: Period,
    xKey: keyof T,
    yKeys: string[],
): T[] {
    const map = new Map<string, T>();

    for (const item of data) {
        const date = new Date(item[xKey]);
        let key = "";

        if (period === "daily") {
            key = date.toISOString().slice(0, 10); // YYYY-MM-DD
        } else if (period === "weekly") {
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay()); // Sunday as week start
            key = weekStart.toISOString().slice(0, 10);
        } else if (period === "monthly") {
            key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        }

        if (map.has(key)) {
            const existing = map.get(key)!;
            yKeys.forEach((yKey) => {
                existing[yKey] += Number(item[yKey]);
            });
        } else {
            map.set(key, {
                ...Object.fromEntries(
                    yKeys.map((yKey) => [yKey, Number(item[yKey])]),
                ),
                [xKey]: key,
            } as T);
        }
    }

    return Array.from(map.values()).sort((a, b) =>
        (a[xKey] as string).localeCompare(b[xKey] as string),
    );
}

export function CustomChart({
    data,
    config,
    xKey,
    yKeys,
    summary,
}: ReusableBarChartProps) {
    const [activeChart, setActiveChart] = React.useState<keyof typeof config>(
        yKeys[0] as keyof typeof config,
    );

    const [activePeriod, setActivePeriod] = React.useState<Period>("daily");

    const filteredData = React.useMemo(() => {
        return groupDataByPeriod(data, activePeriod, xKey, yKeys);
    }, [data, activePeriod, xKey, yKeys]);

    const total = React.useMemo(() => {
        if (summary) {
            return {
                ...yKeys.reduce(
                    (acc, key) => {
                        acc[key] = summary[activePeriod];
                        return acc;
                    },
                    {} as Record<string, number>,
                ),
            };
        }

        const result: Record<string, number> = {};
        yKeys.forEach((key) => {
            result[key] = filteredData.reduce(
                (sum, item) => sum + item[key],
                0,
            );
        });
        return result;
    }, [filteredData, yKeys, activePeriod, summary]);

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="bg-primary-foreground">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Pembelian Bahan Baku</CardTitle>
                    <CardDescription>
                        Tampilan Pembelian Bahan Baku {activePeriod}
                    </CardDescription>
                </div>
                <div className="flex">
                    {yKeys.map((key) => {
                        const chart = key as keyof typeof config;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/80 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {config[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {formatRupiah(total[chart])}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>

            <div className="flex gap-2 px-6 pt-4">
                {periods.map((p) => (
                    <button
                        key={p}
                        onClick={() => setActivePeriod(p)}
                        className={`rounded px-4 py-1 text-sm font-medium transition ${
                            activePeriod === p
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={config}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        data={filteredData}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return activePeriod === "monthly"
                                    ? date.toLocaleDateString("en-US", {
                                          month: "short",
                                          year: "numeric",
                                      })
                                    : date.toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                      });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey={config[activeChart].label}
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        )
                                    }
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill={config[activeChart].color}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
