import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RecipeCard } from "../RecipeCard";
import { FaFire } from "react-icons/fa";
export default function HotFoods({ foods }) {
    return (_jsxs("section", { children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(FaFire, { size: 20, className: "text-red-500" }), "M\u00F3n \u0103n hot"] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-4", children: foods.map((food) => (_jsx(RecipeCard, { recipe: food }, food.name))) }), _jsx("div", { className: "flex justify-center mt-4 cursor-pointer", onClick: () => window.location.href = "/food", children: _jsx("a", { className: "px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition", children: "Xem th\u00EAm" }) })] }));
}
