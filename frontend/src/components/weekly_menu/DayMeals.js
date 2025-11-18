import { jsx as _jsx } from "react/jsx-runtime";
import MealCard from "./MealCard/MealCard";
export default function DayMeals({ dayData, dayIndex, date, history, }) {
    const meals = ["breakfast", "lunch", "dinner"];
    const dayNames = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
    ];
    const toDate = (d) => typeof d === "string" ? new Date(d) : d;
    const formatDate = (dateStr) => {
        const d = toDate(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };
    const formatDate2 = (dateStr) => {
        const d = toDate(dateStr);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    };
    return (_jsx("div", { className: "grid grid-cols-1 gap-4", children: meals.map((mealKey) => {
            const mealData = dayData[mealKey];
            const mealName = (mealKey === "breakfast"
                ? "Bữa sáng"
                : mealKey === "lunch"
                    ? "Bữa trưa"
                    : "Bữa tối") + `, ${dayNames[dayIndex]}, ngày ${formatDate(date)}`;
            return (_jsx(MealCard, { mealName: mealName, data: mealData.nutrients, items: mealData.items, mealType: mealKey, dayKey: formatDate2(date), eaten: mealData.eaten, history: history }, mealKey));
        }) }));
}
