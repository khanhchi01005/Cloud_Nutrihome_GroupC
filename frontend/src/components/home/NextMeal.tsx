import { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import MiniFoodCard from "../MiniFoodCard";
import type { Meal } from "../../datatypes/MealDataTypes";

interface NextMealProps {
    meals: Meal[];
}

export default function NextMeal({ meals }: NextMealProps) {
    const [nextMeals, setNextMeals] = useState<Meal[]>([]);

    useEffect(() => {
        setNextMeals(meals);
    }, [meals]);

    return (
        <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiFileText size={20} />
                Bữa tiếp theo
            </h2>

            <div className="p-4 bg-white rounded-lg shadow max-h-74 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nextMeals.map((meal) => (
                        <MiniFoodCard key={meal.name} meal={meal} />
                    ))}
                </div>
            </div>
        </section>
    );
}
