interface ReusableBarChartProps {
    data: Array<Record<string, any>>;
    config: Record<string, { label: string; color: string }>;
    xKey: string;
    yKeys: string[];
    summary?: {
        daily: number;
        weekly: number;
        monthly: number;
    };
}
