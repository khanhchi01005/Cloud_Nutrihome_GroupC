import { useState, useEffect } from "react";
import DayMeals from "../components/weekly_menu/DayMeals";
import NutritionBarChart from "../components/history/NutritionBarChart";
import { useHistory, useDayMenu } from "../hooks/history_hooks";

export default function HistoryPage() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user ? user.user_id : "";

    console.log("User ID in HistoryPage:", userId);

    // History 5 ngày
    const { data: historyData, loading: loadingHistory, error: historyError } = useHistory(userId);

    // Selected day cho DayMeals (30 ngày gần nhất)
    const todayStr = new Date().toISOString().split("T")[0];
    const maxDate = todayStr;
    const minDate = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState<string>(todayStr);

    // Hook gọi API day meal khi selectedDate thay đổi
    const { data: dayMenu, loading: loadingMenu, error: menuError } = useDayMenu(
        userId,
        selectedDate
    );

    // Chuẩn bị dữ liệu chart 5 ngày gần nhất từ historyData
    const last5Days = historyData
        ? Object.keys(historyData)
            .sort((a, b) => (a > b ? -1 : 1))
            .slice(0, 5)
            .reverse()
        : [];

    const chartData = last5Days.map((date) => {
        const day = historyData[date];
        return {
            date,
            calories: day.calories,
            carbs: day.carbs,
            fat: day.fat,
            protein: day.protein,
        };
    });

    const LoadingOverlay = ({ text = "Đang tải..." }: { text?: string }) => (
        <div className="flex flex-1 items-center justify-center p-6 bg-gray-200/50 gap-4">
            <svg
                className="animate-spin h-10 w-10 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                />
            </svg>
            <p className="text-lg font-bold text-gray-500">{text}</p>
        </div>
    );

    return (
        <div className="px-4 py-6 pt-27 container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Lịch sử dinh dưỡng</h1>

            {/* Chart 5 ngày */}
            {loadingHistory ? (
                <LoadingOverlay text="Đang tải lịch sử..." />
            ) : historyError ? (
                <p className="text-red-500">{historyError}</p>
            ) : (
                <NutritionBarChart data={chartData} />
            )}

            {/* Chọn ngày để xem DayMeals */}
            <div className="flex items-center gap-4 mt-4">
                <label className="font-semibold">Chọn ngày để xem lịch sử ăn uống:</label>
                <input
                    type="date"
                    value={selectedDate}
                    max={maxDate}
                    min={minDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border p-2 rounded"
                />
            </div>

            {/* Hiển thị DayMeals */}
            {loadingMenu ? (
                <LoadingOverlay text="Đang tải bữa ăn..." />
            ) : menuError ? (
                <p className="text-red-500">{menuError}</p>
            ) : dayMenu ? (
                <div className="mt-6">
                    <DayMeals
                        dayData={dayMenu}
                        dayIndex={new Date(selectedDate).getDay() - 1}
                        date={selectedDate}
                        history={true}
                    />
                </div>
            ) : null}
        </div>
    );
}
