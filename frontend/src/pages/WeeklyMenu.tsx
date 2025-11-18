import WeekNavbar from "../components/weekly_menu/WeekNavbar";
import DayMeals from "../components/weekly_menu/DayMeals";
import { useState } from "react";
import type { WeeklyMenu } from "../datatypes/WeeklyMenuDataTypes";
import { useWeeklyMenu } from "../hooks/weekly_menu_hooks";

export default function WeeklyMenuPage() {
  const { menu: weeklyMenu } = useWeeklyMenu();
  const [selectedDay, setSelectedDay] = useState(0); // 0 = Thứ 2

  const orderedDays: (keyof WeeklyMenu["menu"])[] = [
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "sun",
  ];

  const getDateOfWeek = (dayIndex: number) => {
    const today = new Date();
    const day = today.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    const diff = dayIndex + 1 - (day === 0 ? 7 : day); // 1 = Thứ 2
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    return targetDate;
  };

  const selectedDate = getDateOfWeek(selectedDay);

  if (!weeklyMenu) {
    return (
      <div className="pt-27 container mx-auto px-4">Đang tải thực đơn...</div>
    );
  }

  return (
    <div className="px-4 py-6 pt-27 container mx-auto">
      <WeekNavbar
        selectedDay={selectedDay}
        onSelect={(idx) => setSelectedDay(idx)}
      />

      <div className="mt-6">
        <DayMeals
          dayData={weeklyMenu[orderedDays[selectedDay]]}
          dayIndex={selectedDay}
          date={selectedDate.toISOString().split("T")[0]}
        />
      </div>
    </div>
  );
}
