import { useState } from "react";
import type { WeeklyMenu } from "../datatypes/WeeklyMenuDataTypes";
import { FiPlay, FiCoffee, FiSun, FiMoon } from "react-icons/fi";
import { useGenerateFamilyMeal } from "../hooks/create_weekly_menu_hooks";

export default function CreateWeeklyMenuPage() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  const suggestedEndDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(suggestedEndDate);
  const [availableIngredients, setAvailableIngredients] = useState("");
  const [menuResult, setMenuResult] = useState<WeeklyMenu | null>(null);

  // === Hook thật ===
  const {
    generateFamilyMeal,
    loading: isLoading,
    error,
    success,
  } = useGenerateFamilyMeal();

  const canGenerate =
    startDate && endDate && availableIngredients.trim() !== "" && !isLoading;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const family_id = user ? user.family_id : "";

  const handleGenerateMenu = async () => {
    setMenuResult(null);

    try {
      const response = await generateFamilyMeal({
        family_id: family_id,
        start_date: startDate,
        end_date: endDate,
        available_ingredients: availableIngredients,
      });

      // Nếu server trả về kết quả thực đơn thì parse:
      // API wrapper returns { status, data } so check response.data
      if (response?.data?.menu) {
        setMenuResult(response.data as WeeklyMenu);
      }

      localStorage.removeItem("weekly_menu");
    } catch (err) {
      console.error("Generate menu failed:", err);
    }
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    const maxEndDate = new Date(
      new Date(newStart).getTime() + 6 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    if (endDate < newStart || endDate > maxEndDate) {
      setEndDate(maxEndDate);
    }
  };

  return (
    <div className="flex w-150 mx-auto space-x-6 my-8 mt-27">
      <div className="flex-1 bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold">Tạo thực đơn hàng tuần</h1>
        <p className="text-gray-600">
          Nhập các thông tin bên dưới để hệ thống gợi ý thực đơn phù hợp với
          nguyên liệu, tình trạng sức khỏe và dị ứng của bạn.
        </p>

        {/* Ngày bắt đầu */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="font-semibold w-32">Ngày bắt đầu:</label>
          <input
            type="date"
            className="border p-2 rounded flex-1"
            value={startDate}
            min={todayStr}
            onChange={(e) => handleStartDateChange(e.target.value)}
          />
        </div>

        {/* Ngày kết thúc */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="font-semibold w-32">Ngày kết thúc:</label>
          <input
            type="date"
            className="border p-2 rounded flex-1"
            value={endDate}
            min={startDate}
            max={
              new Date(new Date(startDate).getTime() + 6 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            onChange={(e) => setEndDate(e.target.value)}
          />
          <span className="text-gray-500 text-sm">
            Không quá 7 ngày từ ngày bắt đầu
          </span>
        </div>

        {/* Nguyên liệu */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Nguyên liệu hiện có:</label>
          <textarea
            className="border p-2 rounded min-h-[150px]"
            placeholder="Nhập danh sách nguyên liệu..."
            value={availableIngredients}
            onChange={(e) => setAvailableIngredients(e.target.value)}
          />
        </div>

        {/* Nút hành động */}
        <div className="flex gap-4 mt-4">
          <button
            className={`flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition
                            ${
                              canGenerate
                                ? "hover:bg-blue-700 cursor-pointer"
                                : "opacity-50 cursor-not-allowed"
                            }`}
            onClick={handleGenerateMenu}
            disabled={!canGenerate}
          >
            {isLoading ? (
              <span>Đang gợi ý...</span>
            ) : (
              <>
                <FiPlay size={18} />
                <span>Gợi ý thực đơn</span>
              </>
            )}
          </button>
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </div>
    </div>
  );
}
