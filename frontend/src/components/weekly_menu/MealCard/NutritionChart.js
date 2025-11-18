import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
export default function NutritionChart({ carbs = 0, fat = 0, protein = 0 }) {
    const total = carbs + fat + protein;
    const data = [
        { name: "Carbs", value: carbs },
        { name: "Fat", value: fat },
        { name: "Protein", value: protein },
    ];
    const COLORS = ["#3b82f6", "#f97316", "#10b981"];
    // Tooltip hiển thị phần trăm
    const renderTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return (_jsxs("div", { className: "bg-white p-2 rounded shadow border text-sm", children: [_jsx("strong", { children: name }), ": ", value, "g (", percent, "%)"] }));
        }
        return null;
    };
    return (_jsxs(PieChart, { width: 200, height: 200, children: [_jsx(Pie, { data: data, dataKey: "value", cx: "50%", cy: "50%", outerRadius: 90, paddingAngle: 2, children: data.map((entry, index) => (_jsx(Cell, { fill: COLORS[index] }, index))) }), _jsx(Tooltip, { content: renderTooltip })] }));
}
