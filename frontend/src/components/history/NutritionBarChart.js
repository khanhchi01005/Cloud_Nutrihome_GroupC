import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
export default function NutritionBarChart({ data }) {
    const nutrients = [
        { key: "calories", label: "Calories", color: "#EF4444" },
        { key: "carbs", label: "Carbs", color: "#3B82F6" },
        { key: "fat", label: "Fat", color: "#F59E0B" },
        { key: "protein", label: "Protein", color: "#10B981" },
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-4", children: nutrients.map((nutrient) => (_jsxs("div", { className: "bg-white p-4 rounded-xl shadow", children: [_jsx("h3", { className: "font-semibold mb-2", children: nutrient.label }), _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: data, barCategoryGap: 10, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: nutrient.key, fill: nutrient.color, barSize: 30 })] }) })] }, nutrient.key))) }));
}
