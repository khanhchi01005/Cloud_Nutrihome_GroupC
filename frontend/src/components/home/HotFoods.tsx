import { RecipeCard } from "../RecipeCard";
import type { Recipe } from "../RecipeCard";
import { FaFire } from "react-icons/fa";

interface HotFoodsProps {
    foods: Recipe[];
}

export default function HotFoods({ foods }: HotFoodsProps) {
    return (
        <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaFire size={20} className="text-red-500" />
                Món ăn hot
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {foods.map((food) => (
                    <RecipeCard key={food.name} recipe={food} />
                ))}
            </div>
            {/* Nút Xem thêm */}
            <div className="flex justify-center mt-4 cursor-pointer" onClick={() => window.location.href = "/food"}>
                <a className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
                    Xem thêm
                </a>
            </div>
        </section>
    );
}
