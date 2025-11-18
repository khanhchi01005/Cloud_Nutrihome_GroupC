import { useState, useEffect } from "react";
import { FiClock, FiDroplet, FiHeart, FiActivity, FiZap, FiX } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import type { Recipe } from "./RecipeCard";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface RecipeDetailsProps {
    recipe: Recipe;
    onClose: () => void;
}

export function RecipeDetails({ recipe, onClose }: RecipeDetailsProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 200);
    };

    const formatCookingTime = (time?: string) => {
        if (!time) return "";
        const [h, m, s] = time.split(":").map(Number);
        const parts: string[] = [];
        if (h) parts.push(`${h} giờ`);
        if (m) parts.push(`${m} phút`);
        if (s) parts.push(`${s} giây`);
        return parts.join(" ");
    };

    const markdownComponents = {
        p: ({ node, ...props }: any) => <p className="mb-2 text-gray-700 text-sm" {...props} />,
        li: ({ node, ...props }: any) => <li className="ml-4 list-disc text-gray-700 text-sm" {...props} />,
        h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold my-2" {...props} />,
        h2: ({ node, ...props }: any) => <h2 className="text-lg font-semibold my-2" {...props} />,
        h3: ({ node, ...props }: any) => <h3 className="text-base font-semibold my-1" {...props} />,
    };

    const COLORS = ["#3b82f6", "#f97316", "#10b981"];
    const data = [
        { name: "Carbs", value: recipe.carbs || 0 },
        { name: "Fat", value: recipe.fat || 0 },
        { name: "Protein", value: recipe.protein || 0 },
    ];
    const total = data.reduce((sum, d) => sum + d.value, 0);

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
        <div
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"
                }`}
            onClick={handleClose}
        >
            <div
                className={`bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6 transform transition-transform duration-200 ${visible ? "scale-100" : "scale-95"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                    onClick={handleClose}
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center">{recipe.name}</h2>

                {recipe.image && (
                    <img src={recipe.image} alt={recipe.name} className="w-full h-64 object-cover rounded mb-4" />
                )}

                <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-700 text-sm">
                    {recipe.carbs !== undefined && (
                        <span className="flex items-center gap-1"><FiDroplet /> Carbs: {recipe.carbs}g</span>
                    )}
                    {recipe.protein !== undefined && (
                        <span className="flex items-center gap-1"><FiZap /> Protein: {recipe.protein}g</span>
                    )}
                    {recipe.fat !== undefined && (
                        <span className="flex items-center gap-1"><FiActivity /> Fat: {recipe.fat}g</span>
                    )}
                    {recipe.calories !== undefined && (
                        <span className="flex items-center gap-1"><FiHeart /> Calories: {recipe.calories}kcal</span>
                    )}
                    {recipe.cooking_time && (
                        <span className="flex items-center gap-1"><FiClock /> {formatCookingTime(recipe.cooking_time)}</span>
                    )}
                </div>

                {/* Phần dưới: 30% PieChart, 70% Markdown */}
                <div className="flex gap-4 border rounded-lg p-4">
                    <div className="w-1/4 flex items-center justify-center">
                        <PieChart width={180} height={180}>
                            <Pie
                                data={data}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                paddingAngle={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip content={renderTooltip} />
                        </PieChart>
                    </div>

                    <div className="w-3/4 flex flex-col gap-4">
                        {recipe.ingredients && (
                            <div>
                                <ReactMarkdown components={markdownComponents}>{recipe.ingredients}</ReactMarkdown>
                            </div>
                        )}

                        {recipe.steps && (
                            <div>
                                <ReactMarkdown components={markdownComponents}>{recipe.steps}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
