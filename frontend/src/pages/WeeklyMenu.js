import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import WeekNavbar from "../components/weekly_menu/WeekNavbar";
import DayMeals from "../components/weekly_menu/DayMeals";
import { useState } from "react";
import { useWeeklyMenu } from "../hooks/weekly_menu_hooks";
export default function WeeklyMenuPage() {
    const { menu: weeklyMenu } = useWeeklyMenu();
    const [selectedDay, setSelectedDay] = useState(0); // 0 = Thứ 2
    const orderedDays = [
        "mon",
        "tue",
        "wed",
        "thu",
        "fri",
        "sat",
        "sun",
    ];
    const getDateOfWeek = (dayIndex) => {
        const today = new Date();
        const day = today.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
        const diff = dayIndex + 1 - (day === 0 ? 7 : day); // 1 = Thứ 2
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        return targetDate;
    };
    const selectedDate = getDateOfWeek(selectedDay);
    if (!weeklyMenu) {
        return (_jsx("div", { className: "pt-27 container mx-auto px-4", children: "\u0110ang t\u1EA3i th\u1EF1c \u0111\u01A1n..." }));
    }
    return (_jsxs("div", { className: "px-4 py-6 pt-27 container mx-auto", children: [_jsx(WeekNavbar, { selectedDay: selectedDay, onSelect: (idx) => setSelectedDay(idx) }), _jsx("div", { className: "mt-6", children: _jsx(DayMeals, { dayData: weeklyMenu[orderedDays[selectedDay]], dayIndex: selectedDay, date: selectedDate.toISOString().split("T")[0] }) })] }));
}
