import { FiClock, FiDroplet, FiHeart, FiActivity, FiZap, FiX } from "react-icons/fi";
import type { Meal } from "../datatypes/MealDataTypes";
import { useRemoveCustomMeal } from "../hooks/weekly_menu_hooks";
import { useState } from "react";
import { RecipeDetails } from "./RecipeDetails"; // import component modal

interface MiniFoodCardProps {
    meal: Meal;
    canDelete?: boolean;
    dayKey?: string;
    mealType?: string;
}

export default function MiniFoodCard({ meal, canDelete = false, dayKey, mealType }: MiniFoodCardProps) {
    const { removeCustomMeal } = useRemoveCustomMeal();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDetail, setShowDetail] = useState(false); // state hiển thị modal

    const formatCookingTime = (time?: string) => {
        if (!time) return "";
        const [h, m, s] = time.split(":").map(Number);
        const parts: string[] = [];
        if (h) parts.push(`${h} giờ`);
        if (m) parts.push(`${m} phút`);
        if (s) parts.push(`${s} giây`);
        return parts.join(" ");
    };

    const handleDelete = async () => {
        if (!dayKey || !mealType) return;

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const user_id = user.user_id;
        if (!user_id) return;

        setIsDeleting(true);
        const res = await removeCustomMeal(user_id, meal.name, dayKey, mealType);
        setIsDeleting(false);

        if (res?.status === "success") {
            window.location.reload();
        }
    };

    const recipesJSON = localStorage.getItem("recipes");
    const recipes: Meal[] = recipesJSON ? JSON.parse(recipesJSON) : [];

    return (
        <>
            <div
                className="relative flex flex-row p-3 bg-gray-50 rounded-lg shadow hover:shadow-md transition h-40 cursor-pointer hover:scale-105"
                onClick={() => setShowDetail(true)} // mở modal
            >
                {canDelete && (
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                        disabled={isDeleting}
                    >
                        <FiX size={25} />
                    </button>
                )}

                {meal.image && (
                    <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-28 h-full object-cover rounded-md mr-4"
                    />
                )}

                <div className="flex-1 flex flex-col justify-between">
                    <h3 className="font-semibold text-lg">{meal.name}</h3>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1"><FiDroplet />Carbs: {meal.carbs}g</span>
                        <span className="flex items-center gap-1"><FiZap />Protein: {meal.protein}g</span>
                        <span className="flex items-center gap-1"><FiActivity />Fat: {meal.fat}g</span>
                        <span className="flex items-center gap-1"><FiHeart />Calories: {meal.calories}kcal</span>
                    </div>

                    <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <FiClock /> {formatCookingTime(meal.cooking_time)}
                    </p>
                </div>
            </div>

            {showDetail && (
                <RecipeDetails
                    recipe={recipes.find(r => r.name === meal.name) || meal} // fallback meal nếu không tìm thấy
                    onClose={() => setShowDetail(false)}
                />
            )}
        </>
    );
}
