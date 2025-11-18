import MealCard from "./MealCard/MealCard";
import type { WeeklyMenu } from "../../datatypes/WeeklyMenuDataTypes";

interface SimpleMeal {
  items: any[];
  nutrients?: any;
  eaten?: boolean;
}

type DayDataGeneric = {
  breakfast: SimpleMeal;
  lunch: SimpleMeal;
  dinner: SimpleMeal;
};

interface DayMealsProps {
  dayData: DayDataGeneric; // permissive type to accept history/day-menu shapes
  dayIndex: number; // 0 = Thứ 2
  date: string | Date; // "YYYY-MM-DD" hoặc Date object
  history?: boolean; // <-- ngày tương ứng
}

export default function DayMeals({
  dayData,
  dayIndex,
  date,
  history,
}: DayMealsProps) {
  const meals: (keyof typeof dayData)[] = ["breakfast", "lunch", "dinner"];
  const dayNames = [
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
    "Chủ nhật",
  ];

  const toDate = (d: string | Date) =>
    typeof d === "string" ? new Date(d) : d;

  const formatDate = (dateStr: string | Date) => {
    const d = toDate(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatDate2 = (dateStr: string | Date) => {
    const d = toDate(dateStr);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {meals.map((mealKey) => {
        const mealData = dayData[mealKey];

        const mealName =
          (mealKey === "breakfast"
            ? "Bữa sáng"
            : mealKey === "lunch"
            ? "Bữa trưa"
            : "Bữa tối") + `, ${dayNames[dayIndex]}, ngày ${formatDate(date)}`;

        return (
          <MealCard
            key={mealKey}
            mealName={mealName}
            data={mealData.nutrients}
            items={mealData.items}
            mealType={mealKey} // <-- loại bữa: breakfast/lunch/dinner
            dayKey={formatDate2(date)}
            eaten={mealData.eaten}
            history={history}
          />
        );
      })}
    </div>
  );
}
