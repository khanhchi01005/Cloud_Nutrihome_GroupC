import { useState } from "react";
import { FiClock, FiDroplet, FiHeart, FiActivity, FiZap, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { RecipeDetails } from "./RecipeDetails";

export interface Recipe {
  id?: number;
  name: string;
  image: string;
  carbs?: number;
  protein?: number;
  fat?: number;
  calories?: number;
  cooking_time?: string; // dạng "HH:MM:SS"
  ingredients?: string; // markdown
  steps?: string;
}

interface FoodCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: FoodCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatCookingTime = (time?: string) => {
    if (!time) return "";
    const [h, m, s] = time.split(":").map(Number);
    const parts: string[] = [];
    if (h) parts.push(`${h} giờ`);
    if (m) parts.push(`${m} phút`);
    if (s) parts.push(`${s} giây`);
    return parts.join(" ");
  };

  return (
    <>
      <div
        className="flex flex-col items-center p-2 bg-white rounded-lg shadow hover:shadow-md cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setShowDetails(true)}
      >
        <img src={recipe.image} alt={recipe.name} className="w-full aspect-square object-cover rounded-md mb-2" />
        <h3 className="font-semibold text-lg text-center mb-2">{recipe.name}</h3>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 mb-2">
          {recipe.carbs !== undefined && (
            <span className="flex items-center gap-1">
              <FiDroplet size={12} /> Carbs: {recipe.carbs}g
            </span>
          )}
          {recipe.protein !== undefined && (
            <span className="flex items-center gap-1">
              <FiZap size={12} /> Protein: {recipe.protein}g
            </span>
          )}
          {recipe.fat !== undefined && (
            <span className="flex items-center gap-1">
              <FiActivity size={12} /> Fat: {recipe.fat}g
            </span>
          )}
          {recipe.calories !== undefined && (
            <span className="flex items-center gap-1">
              <FiHeart size={12} /> Calories: {recipe.calories}kcal
            </span>
          )}
        </div>
        {recipe.cooking_time && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <FiClock size={12} /> {formatCookingTime(recipe.cooking_time)}
          </p>
        )}
      </div>

      {showDetails && <RecipeDetails recipe={recipe} onClose={() => setShowDetails(false)} />}
    </>
  );
}