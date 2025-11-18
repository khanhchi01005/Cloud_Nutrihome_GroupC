import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FiClock, FiDroplet, FiHeart, FiActivity, FiZap, FiX } from "react-icons/fi";
import { useRemoveCustomMeal } from "../hooks/weekly_menu_hooks";
import { useState } from "react";
import { RecipeDetails } from "./RecipeDetails"; // import component modal
export default function MiniFoodCard({ meal, canDelete = false, dayKey, mealType }) {
    const { removeCustomMeal } = useRemoveCustomMeal();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDetail, setShowDetail] = useState(false); // state hiển thị modal
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
    const handleDelete = async () => {
        if (!dayKey || !mealType)
            return;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const user_id = user.user_id;
        if (!user_id)
            return;
        setIsDeleting(true);
        const res = await removeCustomMeal(user_id, meal.name, dayKey, mealType);
        setIsDeleting(false);
        if (res?.status === "success") {
            window.location.reload();
        }
    };
    const recipesJSON = localStorage.getItem("recipes");
    const recipes = recipesJSON ? JSON.parse(recipesJSON) : [];
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative flex flex-row p-3 bg-gray-50 rounded-lg shadow hover:shadow-md transition h-40 cursor-pointer hover:scale-105", onClick: () => setShowDetail(true), children: [canDelete && (_jsx("button", { className: "absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer z-10", onClick: (e) => {
                            e.stopPropagation();
                            handleDelete();
                        }, disabled: isDeleting, children: _jsx(FiX, { size: 25 }) })), meal.image && (_jsx("img", { src: meal.image, alt: meal.name, className: "w-28 h-full object-cover rounded-md mr-4" })), _jsxs("div", { className: "flex-1 flex flex-col justify-between", children: [_jsx("h3", { className: "font-semibold text-lg", children: meal.name }), _jsxs("div", { className: "flex flex-wrap gap-2 text-sm text-gray-600 mt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiDroplet, {}), "Carbs: ", meal.carbs, "g"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiZap, {}), "Protein: ", meal.protein, "g"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiActivity, {}), "Fat: ", meal.fat, "g"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FiHeart, {}), "Calories: ", meal.calories, "kcal"] })] }), _jsxs("p", { className: "flex items-center gap-1 text-sm text-gray-500 mt-1", children: [_jsx(FiClock, {}), " ", formatCookingTime(meal.cooking_time)] })] })] }), showDetail && (_jsx(RecipeDetails, { recipe: recipes.find(r => r.name === meal.name) || meal, onClose: () => setShowDetail(false) }))] }));
}
