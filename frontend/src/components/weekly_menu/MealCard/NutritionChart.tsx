import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface NutritionChartProps {
    carbs?: number;
    fat?: number;
    protein?: number;
}

export default function NutritionChart({ carbs = 0, fat = 0, protein = 0 }: NutritionChartProps) {
    const total = carbs + fat + protein;
    const data = [
        { name: "Carbs", value: carbs },
        { name: "Fat", value: fat },
        { name: "Protein", value: protein },
    ];

    const COLORS = ["#3b82f6", "#f97316", "#10b981"];

    // Tooltip hiển thị phần trăm
    const renderTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return (
                <div className="bg-white p-2 rounded shadow border text-sm">
                    <strong>{name}</strong>: {value}g ({percent}%)
                </div>
            );
        }
        return null;
    };

    return (
        <PieChart width={200} height={200}>
            <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={90}  // tăng từ 60 lên 90
                paddingAngle={2}
            >
                {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                ))}
            </Pie>
            <Tooltip content={renderTooltip} />
        </PieChart>
    );
}
