import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface NutritionBarChartProps {
    data: { date: string; calories: number; carbs: number; fat: number; protein: number }[];
}

export default function NutritionBarChart({ data }: NutritionBarChartProps) {
    const nutrients: { key: string; label: string; color: string }[] = [
        { key: "calories", label: "Calories", color: "#EF4444" },
        { key: "carbs", label: "Carbs", color: "#3B82F6" },
        { key: "fat", label: "Fat", color: "#F59E0B" },
        { key: "protein", label: "Protein", color: "#10B981" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {nutrients.map((nutrient) => (
                <div key={nutrient.key} className="bg-white p-4 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">{nutrient.label}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data} barCategoryGap={10}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey={nutrient.key} fill={nutrient.color} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ))}
        </div>
    );
}
