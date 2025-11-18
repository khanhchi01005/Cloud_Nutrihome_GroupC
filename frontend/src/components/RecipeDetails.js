import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FiClock, FiDroplet, FiHeart, FiActivity, FiZap, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
export function RecipeDetails({ recipe, onClose }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setVisible(true);
    }, []);
    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 200);
    };
    const formatCookingTime = (time) => {
        if (!time)
            return "";
        const [h, m, s] = time.split(":").map(Number);
        const parts = [];
        if (h)
            parts.push(`${h} giờ`);
        if (m)
            parts.push(`${m} phút`);
        if (s)
            parts.push(`${s} giây`);
        return parts.join(" ");
    };
    const markdownComponents = {
        p: ({ node, ...props }) => _jsx("p", { className: "mb-2 text-gray-700 text-sm", ...props }),
        li: ({ node, ...props }) => _jsx("li", { className: "ml-4 list-disc text-gray-700 text-sm", ...props }),
        h1: ({ node, ...props }) => _jsx("h1", { className: "text-xl font-bold my-2", ...props }),
        h2: ({ node, ...props }) => _jsx("h2", { className: "text-lg font-semibold my-2", ...props }),
        h3: ({ node, ...props }) => _jsx("h3", { className: "text-base font-semibold my-1", ...props }),
    };
    const COLORS = ["#3b82f6", "#f97316", "#10b981"];
    const data = [
        { name: "Carbs", value: recipe.carbs || 0 },
        { name: "Fat", value: recipe.fat || 0 },
        { name: "Protein", value: recipe.protein || 0 },
    ];
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const renderTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, value } = payload[0];
            const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return (_jsxs("div", { className: "bg-white p-2 rounded shadow border text-sm", children: [_jsx("strong", { children: name }), ": ", value, "g (", percent, "%)"] }));
        }
        return null;
    };
    return (_jsx("div", { className: `fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`, onClick: handleClose, children: _jsxs("div", { className: `bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6 transform transition-transform duration-200 ${visible ? "scale-100" : "scale-95"}`, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer", onClick: handleClose, children: _jsx(FiX, { size: 24 }) }), _jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: recipe.name }), recipe.image && (_jsx("img", { src: recipe.image, alt: recipe.name, className: "w-full h-64 object-cover rounded mb-4" })), _jsxs("div", { className: "flex flex-wrap justify-center gap-4 mb-4 text-gray-700 text-sm", children: [recipe.carbs !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiDroplet, {}), " Carbs: ", recipe.carbs, "g"] })), recipe.protein !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiZap, {}), " Protein: ", recipe.protein, "g"] })), recipe.fat !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiActivity, {}), " Fat: ", recipe.fat, "g"] })), recipe.calories !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiHeart, {}), " Calories: ", recipe.calories, "kcal"] })), recipe.cooking_time && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiClock, {}), " ", formatCookingTime(recipe.cooking_time)] }))] }), _jsxs("div", { className: "flex gap-4 border rounded-lg p-4", children: [_jsx("div", { className: "w-1/4 flex items-center justify-center", children: _jsxs(PieChart, { width: 180, height: 180, children: [_jsx(Pie, { data: data, dataKey: "value", cx: "50%", cy: "50%", outerRadius: 80, paddingAngle: 2, children: data.map((entry, index) => (_jsx(Cell, { fill: COLORS[index] }, `cell-${index}`))) }), _jsx(Tooltip, { content: renderTooltip })] }) }), _jsxs("div", { className: "w-3/4 flex flex-col gap-4", children: [recipe.ingredients && (_jsx("div", { children: _jsx(ReactMarkdown, { components: markdownComponents, children: recipe.ingredients }) })), recipe.steps && (_jsx("div", { children: _jsx(ReactMarkdown, { components: markdownComponents, children: recipe.steps }) }))] })] })] }) }));
}
