import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { FiClock, FiDroplet, FiHeart, FiActivity, FiZap } from "react-icons/fi";
import { RecipeDetails } from "./RecipeDetails";
export function RecipeCard({ recipe }) {
    const [showDetails, setShowDetails] = useState(false);
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
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center p-2 bg-white rounded-lg shadow hover:shadow-md cursor-pointer hover:scale-105 transition-transform", onClick: () => setShowDetails(true), children: [_jsx("img", { src: recipe.image, alt: recipe.name, className: "w-full aspect-square object-cover rounded-md mb-2" }), _jsx("h3", { className: "font-semibold text-lg text-center mb-2", children: recipe.name }), _jsxs("div", { className: "flex flex-wrap justify-center gap-2 text-xs text-gray-600 mb-2", children: [recipe.carbs !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiDroplet, { size: 12 }), " Carbs: ", recipe.carbs, "g"] })), recipe.protein !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiZap, { size: 12 }), " Protein: ", recipe.protein, "g"] })), recipe.fat !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiActivity, { size: 12 }), " Fat: ", recipe.fat, "g"] })), recipe.calories !== undefined && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiHeart, { size: 12 }), " Calories: ", recipe.calories, "kcal"] }))] }), recipe.cooking_time && (_jsxs("p", { className: "flex items-center gap-1 text-xs text-gray-500", children: [_jsx(FiClock, { size: 12 }), " ", formatCookingTime(recipe.cooking_time)] }))] }), showDetails && _jsx(RecipeDetails, { recipe: recipe, onClose: () => setShowDetails(false) })] }));
}
