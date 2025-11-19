import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import { FiAlertCircle } from "react-icons/fi"; // icon khi không có thực đơn
import MiniFoodCard from "../MiniFoodCard";

export default function NextMeal({ meals }) {
    const [nextMeals, setNextMeals] = useState([]);

    useEffect(() => {
        setNextMeals(meals);
    }, [meals]);

    return _jsxs("section", {
        children: [
            _jsxs("h2", {
                className: "text-xl font-bold mb-4 flex items-center gap-2",
                children: [_jsx(FiFileText, { size: 20 }), "Bữa tiếp theo"]
            }),
            _jsx("div", {
                className: "p-4 bg-white rounded-lg shadow max-h-74 overflow-y-auto",
                children: nextMeals.length > 0
                    ? _jsx("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: nextMeals.map((meal) =>
                            _jsx(MiniFoodCard, { meal: meal }, meal.name)
                        )
                    })
                    : _jsxs("div", {
                        className: "flex flex-col items-center justify-center text-gray-500 py-8",
                        children: [
                            _jsx(FiAlertCircle, { size: 24 }),
                            _jsx("span", { className: "mt-2", children: "Không có thực đơn" })
                        ]
                    })
            })
        ]
    });
}
