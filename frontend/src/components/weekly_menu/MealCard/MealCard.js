import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState, useEffect } from "react";
import { FiPlus, FiCamera, FiBox } from "react-icons/fi";
import NutritionChart from "./NutritionChart";
import NutritionTable from "./NutritionTable";
import MiniFoodCard from "../../MiniFoodCard";
import { useAddCustomMeal, useEaten, useUndoEaten } from "../../../hooks/weekly_menu_hooks"; // <-- import hook
export default function MealCard({ mealName, data, items = [], mealType, dayKey, eaten, history }) {
    const mealItems = useMemo(() => (items || []).map((item) => ({
        name: item.name,
        image: item.image,
        cooking_time: item.cooking_time || "00:30:00",
        carbs: item.carbs || 0,
        protein: item.protein || 0,
        fat: item.fat || 0,
        calories: item.calories || 0,
    })), [items] // mealItems sẽ reset mỗi khi items thay đổi
    );
    // Dialog states
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [newMealName, setNewMealName] = useState("");
    const [showScanDialog, setShowScanDialog] = useState(false);
    const { addCustomMeal, loading: adding, error } = useAddCustomMeal();
    const handleAddMeal = async () => {
        const name = newMealName.trim();
        if (!name)
            return;
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const user_id = user.user_id;
        console.log({ user_id, name, dayKey, mealType });
        const res = await addCustomMeal(user_id, name, dayKey, mealType);
        if (res?.status === "success") {
            setShowAddDialog(false);
            setNewMealName("");
            window.location.reload();
            // Có thể trigger fetch menu lại hoặc update local state nếu muốn
        }
        else {
            alert(error || "Thêm món ăn thất bại");
        }
    };
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const handleScanReceipt = async () => {
        if (!selectedFile)
            return;
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
            }
            else {
                alert(res?.message || "Quét hoá đơn thất bại");
            }
        }
        catch (err) {
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
            }
            else {
                alert("Hoàn tác thất bại!");
            }
        }
        else {
            // Mark eaten
            const res = await markEaten(user_id, dayKey, mealType);
            if (res?.status === "success") {
                setIsEaten(true);
                localStorage.removeItem("weekly_menu");
                window.location.reload();
            }
            else {
                alert("Đánh dấu thất bại!");
            }
        }
    };
    return (_jsxs("div", { className: "bg-white p-4 rounded-xl shadow-md relative", children: [!history && (_jsxs("div", { className: "absolute top-4 right-4 flex gap-2", children: [_jsxs("button", { className: "flex items-center gap-1 px-3 py-1 bg-white border-2 border-blue-600 text-blue-600 rounded shadow hover:bg-blue-600 hover:text-white transition cursor-pointer", onClick: () => setShowAddDialog(true), children: [_jsx(FiPlus, {}), " Th\u00EAm m\u00F3n \u0103n"] }), _jsxs("button", { className: "flex items-center gap-1 px-3 py-1 bg-white border-2 border-blue-600 text-blue-600 rounded shadow hover:bg-blue-600 hover:text-white transition cursor-pointer", onClick: () => setShowScanDialog(true), children: [_jsx(FiCamera, {}), " Qu\u00E9t ho\u00E1 \u0111\u01A1n"] }), _jsx("button", { className: `flex items-center gap-1 px-3 py-1 rounded shadow transition cursor-pointer
        ${isEaten ? "bg-gray-500 text-white hover:bg-gray-600" : "bg-green-500 text-white hover:bg-green-600"}
        ${(eating || undoing) ? "opacity-50 cursor-not-allowed" : ""}
      `, disabled: eating || undoing, onClick: handleToggleEaten, children: eating || undoing
                            ? "Đang xử lý..."
                            : isEaten
                                ? "Hoàn tác đã ăn"
                                : "Đã ăn bữa này" })] })), _jsx("h2", { className: "text-xl font-bold mb-4", children: mealName }), _jsx("div", { className: "flex flex-row w-full", children: mealItems.length > 0 ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-none flex flex-row gap-8 basis-[40%]", children: [_jsx("div", { className: "flex-none basis-[33%]", children: _jsx(NutritionChart, { carbs: data.carbs, fat: data.fat, protein: data.protein }) }), _jsx("div", { className: "flex-none basis-[67%]", children: _jsx(NutritionTable, { calories: data.calories, carbs: data.carbs, fat: data.fat, protein: data.protein }) })] }), _jsx("div", { className: "flex-none basis-3/5 max-h-[200px] overflow-y-auto", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 p-4", children: mealItems.map((meal) => (_jsx(MiniFoodCard, { meal: meal, canDelete: history ? false : true, dayKey: dayKey, mealType: mealType }, meal.name))) }) })] })) : (
                /* Nền trống bao cả vùng chart + table + món ăn */
                _jsxs("div", { className: "flex-none flex-1 container overflow-y-auto flex flex-col items-center justify-center p-6 bg-gray-200/50 gap-4", children: [_jsx(FiBox, { className: "text-5xl text-gray-400" }), _jsx("p", { className: "text-lg font-bold text-gray-500", children: "Kh\u00F4ng c\u00F3 th\u1EF1c \u0111\u01A1n" })] })) }), showAddDialog && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96 relative transform scale-95 animate-scaleIn", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Th\u00EAm m\u00F3n \u0103n" }), _jsx("input", { type: "text", placeholder: "T\u00EAn m\u00F3n \u0103n", className: "w-full border px-3 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500", value: newMealName, onChange: (e) => setNewMealName(e.target.value), onKeyDown: (e) => {
                                if (e.key === "Enter")
                                    handleAddMeal();
                            } }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: `flex-1 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition cursor-pointer ${adding ? "opacity-50 cursor-not-allowed" : ""}`, onClick: handleAddMeal, disabled: adding, children: adding ? "Đang thêm..." : "Thêm món ăn" }), _jsx("button", { className: "flex-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer", onClick: () => setShowAddDialog(false), children: "\u0110\u00F3ng" })] })] }) })), showScanDialog && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-96 relative transform scale-95 animate-scaleIn", children: [_jsx("h3", { className: "text-lg font-bold mb-4", children: "Qu\u00E9t ho\u00E1 \u0111\u01A1n" }), _jsx("div", { className: "w-full h-52 bg-gray-100 rounded-lg border border-dashed relative flex items-center justify-center mb-4 overflow-hidden", children: selectedFile ? (_jsx("img", { src: URL.createObjectURL(selectedFile), alt: "Preview", className: "w-full h-full object-contain bg-black" })) : (_jsxs("label", { className: "flex flex-col items-center justify-center absolute inset-0 cursor-pointer", children: [_jsx(FiCamera, { className: "text-4xl mb-2 text-gray-500" }), _jsx("span", { className: "text-gray-700 font-semibold", children: "Ch\u1ECDn \u1EA3nh..." }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                setSelectedFile(file);
                                        } })] })) }), _jsxs("div", { className: "flex gap-2 flex-col", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("label", { className: "flex-1 py-2 flex items-center justify-center gap-2 rounded border-2 border-blue-600 text-blue-600 cursor-pointer hover:bg-blue-600 hover:text-white transition", children: [_jsx(FiCamera, {}), " Ch\u1ECDn \u1EA3nh", _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file)
                                                            setSelectedFile(file);
                                                    } })] }), _jsx("button", { className: `flex-1 py-2 rounded text-white ${selectedFile
                                                ? uploading
                                                    ? "bg-blue-400 cursor-not-allowed" // màu nhạt khi đang quét
                                                    : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                                : "bg-gray-400 cursor-not-allowed"}`, disabled: !selectedFile || uploading, onClick: () => handleScanReceipt(), children: uploading ? "Đang quét..." : "Quét hoá đơn" })] }), _jsx("button", { className: "w-full py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer", onClick: () => setShowScanDialog(false), children: "\u0110\u00F3ng" })] })] }) }))] }));
}
