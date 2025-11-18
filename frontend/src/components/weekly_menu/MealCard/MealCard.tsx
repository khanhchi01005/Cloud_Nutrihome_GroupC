import { useMemo, useState, useEffect } from "react";
import { FiPlus, FiCamera, FiCheck, FiBox } from "react-icons/fi";
import NutritionChart from "./NutritionChart";
import NutritionTable from "./NutritionTable";
import MiniFoodCard from "../../MiniFoodCard";
import type { Meal } from "../../../datatypes/MealDataTypes";
import { useAddCustomMeal, useEaten, useUndoEaten } from "../../../hooks/weekly_menu_hooks"; // <-- import hook
import { apiPost } from "../../../api";

interface MealCardProps {
    mealName: string;
    eaten?: boolean;
    data: {
        calories?: number;
        carbs?: number;
        fat?: number;
        protein?: number;
    };
    items?: Meal[];
    mealType: string; // <-- loại bữa: breakfast/lunch/dinner
    dayKey: string;
    history?: boolean;   // <-- ngày tương ứng
}

export default function MealCard({ mealName, data, items = [], mealType, dayKey, eaten, history }: MealCardProps) {
    const mealItems: Meal[] = useMemo(
        () =>
            (items || []).map((item) => ({
                name: item.name,
                image: item.image,
                cooking_time: item.cooking_time || "00:30:00",
                carbs: item.carbs || 0,
                protein: item.protein || 0,
                fat: item.fat || 0,
                calories: item.calories || 0,
            })),
        [items] // mealItems sẽ reset mỗi khi items thay đổi
    );

    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newMealName, setNewMealName] = useState("");

    const [showScanDialog, setShowScanDialog] = useState(false);

    const { addCustomMeal, loading: adding, error } = useAddCustomMeal();

    const handleAddMeal = async () => {
        const name = newMealName.trim();
        if (!name) return;

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const user_id = user.user_id;

        console.log({ user_id, name, dayKey, mealType });

        const res = await addCustomMeal(user_id, name, dayKey, mealType);
        if (res?.status === "success") {
            setShowAddDialog(false);
            setNewMealName("");
            window.location.reload();
            // Có thể trigger fetch menu lại hoặc update local state nếu muốn
        } else {
            alert(error || "Thêm món ăn thất bại");
        }
    };

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleScanReceipt = async () => {
        if (!selectedFile) return;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const user_id = user.user_id;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("user_id", user_id.toString());
        formData.append("day", dayKey);
        formData.append("meal", mealType);

        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

        try {
            const res = await fetch(`${API_BASE_URL}/api/weekly_menu/upload`, {
                method: "POST",
                body: formData,
            }).then(r => r.json());

            if (res?.status === "success") {
                setShowScanDialog(false);
                setSelectedFile(null);
                localStorage.removeItem("weekly_menu");
                window.location.reload();
            } else {
                alert(res?.message || "Quét hoá đơn thất bại");
            }
        } catch (err: any) {
            alert(err.message || "Quét hoá đơn thất bại");
        }
    };

    const [isEaten, setIsEaten] = useState(false);
    useEffect(() => {
        setIsEaten(!!eaten);
    }, [eaten]);

    const { markEaten, loading: eating } = useEaten();
    const { undoEaten, loading: undoing } = useUndoEaten();

    const handleToggleEaten = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const user_id = user.user_id;

        if (isEaten) {
            // Undo
            const res = await undoEaten(user_id, dayKey, mealType);
            if (res?.status === "success") {
                setIsEaten(false);
                localStorage.removeItem("weekly_menu");
                window.location.reload();
            } else {
                alert("Hoàn tác thất bại!");
            }
        } else {
            // Mark eaten
            const res = await markEaten(user_id, dayKey, mealType);
            if (res?.status === "success") {
                setIsEaten(true);
                localStorage.removeItem("weekly_menu");
                window.location.reload();
            } else {
                alert("Đánh dấu thất bại!");
            }
        }
    };


    return (
        <div className="bg-white p-4 rounded-xl shadow-md relative">
            {/* Top-right buttons */}
            {/* Top-right buttons */}
            {!history && (
                <div className="absolute top-4 right-4 flex gap-2">
                    <button
                        className="flex items-center gap-1 px-3 py-1 bg-white border-2 border-blue-600 text-blue-600 rounded shadow hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        onClick={() => setShowAddDialog(true)}
                    >
                        <FiPlus /> Thêm món ăn
                    </button>

                    <button
                        className="flex items-center gap-1 px-3 py-1 bg-white border-2 border-blue-600 text-blue-600 rounded shadow hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        onClick={() => setShowScanDialog(true)}
                    >
                        <FiCamera /> Quét hoá đơn
                    </button>

                    <button
                        className={`flex items-center gap-1 px-3 py-1 rounded shadow transition cursor-pointer
        ${isEaten ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-green-500 text-white hover:bg-green-600"}
        ${(eating || undoing) ? "opacity-50 cursor-not-allowed" : ""}
      `}
                        disabled={eating || undoing}
                        onClick={handleToggleEaten}
                    >
                        {eating || undoing
                            ? "Đang xử lý..."
                            : isEaten
                                ? "Hoàn tác đã ăn"
                                : "Đã ăn bữa này"
                        }
                    </button>
                </div>
            )}

            <h2 className="text-xl font-bold mb-4">{mealName}</h2>

            <div className="flex flex-row w-full">
                {mealItems.length > 0 ? (
                    <>
                        {/* Chart + Table */}
                        <div className="flex-none flex flex-row gap-8 basis-[40%]">
                            <div className="flex-none basis-[33%]">
                                <NutritionChart carbs={data.carbs} fat={data.fat} protein={data.protein} />
                            </div>
                            <div className="flex-none basis-[67%]">
                                <NutritionTable calories={data.calories} carbs={data.carbs} fat={data.fat} protein={data.protein} />
                            </div>
                        </div>

                        {/* Danh sách món ăn */}
                        <div className="flex-none basis-3/5 max-h-[200px] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                                {mealItems.map((meal) => (
                                    <MiniFoodCard
                                        key={meal.name}
                                        meal={meal}
                                        canDelete={history ? false : true}
                                        dayKey={dayKey}
                                        mealType={mealType}
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Nền trống bao cả vùng chart + table + món ăn */
                    <div className="flex-none flex-1 container overflow-y-auto flex flex-col items-center justify-center p-6 bg-gray-200/50 gap-4">
                        <FiBox className="text-5xl text-gray-400" />
                        <p className="text-lg font-bold text-gray-500">Không có thực đơn</p>
                    </div>
                )}
            </div>


            {/* Add Meal Dialog */}
            {showAddDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative transform scale-95 animate-scaleIn">
                        <h3 className="text-lg font-bold mb-4">Thêm món ăn</h3>

                        <input
                            type="text"
                            placeholder="Tên món ăn"
                            className="w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newMealName}
                            onChange={(e) => setNewMealName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddMeal();
                            }}
                        />

                        <div className="flex gap-2">
                            <button
                                className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition cursor-pointer ${adding ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                onClick={handleAddMeal}
                                disabled={adding}
                            >
                                {adding ? "Đang thêm..." : "Thêm món ăn"}
                            </button>

                            <button
                                className="flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                                onClick={() => setShowAddDialog(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Scan Dialog */}
            {showScanDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative transform scale-95 animate-scaleIn">

                        <h3 className="text-lg font-bold mb-4">Quét hoá đơn</h3>

                        {/* Box Upload & Preview */}
                        <div className="w-full h-52 bg-gray-100 rounded-lg border border-dashed relative flex items-center justify-center mb-4 overflow-hidden">
                            {selectedFile ? (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="Preview"
                                    className="w-full h-full object-contain bg-black"
                                />
                            ) : (
                                <label className="flex flex-col items-center justify-center absolute inset-0 cursor-pointer">
                                    <FiCamera className="text-4xl mb-2 text-gray-500" />
                                    <span className="text-gray-700 font-semibold">Chọn ảnh...</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setSelectedFile(file);
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 flex-col">
                            {/* Nút chọn ảnh riêng */}
                            <div className="flex gap-2">
                                {/* Nút Chọn ảnh */}
                                <label className="flex-1 py-2 flex items-center justify-center gap-2 rounded border-2 border-blue-600 text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white transition">
                                    <FiCamera /> Chọn ảnh
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setSelectedFile(file);
                                        }}
                                    />
                                </label>

                                {/* Nút Quét hoá đơn */}
                                <button
                                    className={`flex-1 py-2 rounded text-white ${selectedFile
                                        ? uploading
                                            ? "bg-blue-400 cursor-not-allowed"  // màu nhạt khi đang quét
                                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={!selectedFile || uploading}
                                    onClick={() => handleScanReceipt()}
                                >
                                    {uploading ? "Đang quét..." : "Quét hoá đơn"}
                                </button>
                            </div>

                            <button
                                className="w-full py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
                                onClick={() => setShowScanDialog(false)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
