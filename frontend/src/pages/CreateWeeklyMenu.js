import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { FiPlay } from "react-icons/fi";
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
    const [menuResult, setMenuResult] = useState(null);
    // === Hook thật ===
    const { generateFamilyMeal, loading: isLoading, error, success, } = useGenerateFamilyMeal();
    const canGenerate = startDate && endDate && availableIngredients.trim() !== "" && !isLoading;
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
                setMenuResult(response.data);
            }
            localStorage.removeItem("weekly_menu");
        }
        catch (err) {
            console.error("Generate menu failed:", err);
        }
    };
    const handleStartDateChange = (newStart) => {
        setStartDate(newStart);
        const maxEndDate = new Date(new Date(newStart).getTime() + 6 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
        if (endDate < newStart || endDate > maxEndDate) {
            setEndDate(maxEndDate);
        }
    };
    return (_jsx("div", { className: "flex w-150 mx-auto space-x-6 my-8 mt-27", children: _jsxs("div", { className: "flex-1 bg-white shadow-lg rounded-xl p-6 space-y-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "T\u1EA1o th\u1EF1c \u0111\u01A1n h\u00E0ng tu\u1EA7n" }), _jsx("p", { className: "text-gray-600", children: "Nh\u1EADp c\u00E1c th\u00F4ng tin b\u00EAn d\u01B0\u1EDBi \u0111\u1EC3 h\u1EC7 th\u1ED1ng g\u1EE3i \u00FD th\u1EF1c \u0111\u01A1n ph\u00F9 h\u1EE3p v\u1EDBi nguy\u00EAn li\u1EC7u, t\u00ECnh tr\u1EA1ng s\u1EE9c kh\u1ECFe v\u00E0 d\u1ECB \u1EE9ng c\u1EE7a b\u1EA1n." }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center", children: [_jsx("label", { className: "font-semibold w-32", children: "Ng\u00E0y b\u1EAFt \u0111\u1EA7u:" }), _jsx("input", { type: "date", className: "border p-2 rounded flex-1", value: startDate, min: todayStr, onChange: (e) => handleStartDateChange(e.target.value) })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center", children: [_jsx("label", { className: "font-semibold w-32", children: "Ng\u00E0y k\u1EBFt th\u00FAc:" }), _jsx("input", { type: "date", className: "border p-2 rounded flex-1", value: endDate, min: startDate, max: new Date(new Date(startDate).getTime() + 6 * 24 * 60 * 60 * 1000)
                                .toISOString()
                                .split("T")[0], onChange: (e) => setEndDate(e.target.value) }), _jsx("span", { className: "text-gray-500 text-sm", children: "Kh\u00F4ng qu\u00E1 7 ng\u00E0y t\u1EEB ng\u00E0y b\u1EAFt \u0111\u1EA7u" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("label", { className: "font-semibold", children: "Nguy\u00EAn li\u1EC7u hi\u1EC7n c\u00F3:" }), _jsx("textarea", { className: "border p-2 rounded min-h-[150px]", placeholder: "Nh\u1EADp danh s\u00E1ch nguy\u00EAn li\u1EC7u...", value: availableIngredients, onChange: (e) => setAvailableIngredients(e.target.value) })] }), _jsx("div", { className: "flex gap-4 mt-4", children: _jsx("button", { className: `flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition
                            ${canGenerate
                            ? "hover:bg-blue-700 cursor-pointer"
                            : "opacity-50 cursor-not-allowed"}`, onClick: handleGenerateMenu, disabled: !canGenerate, children: isLoading ? (_jsx("span", { children: "\u0110ang g\u1EE3i \u00FD..." })) : (_jsxs(_Fragment, { children: [_jsx(FiPlay, { size: 18 }), _jsx("span", { children: "G\u1EE3i \u00FD th\u1EF1c \u0111\u01A1n" })] })) }) }), error && _jsx("p", { className: "text-red-600 mt-2", children: error }), success && _jsx("p", { className: "text-green-600 mt-2", children: success })] }) }));
}
