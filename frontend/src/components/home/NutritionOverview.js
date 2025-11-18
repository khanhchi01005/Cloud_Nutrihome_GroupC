import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { FiBarChart2 } from 'react-icons/fi';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';
export default function NutritionOverview({ data }) {
    // Màu cho từng loại dinh dưỡng
    const colors = {
        calories: '#f87171', // đỏ
        carbs: '#fbbf24', // vàng
        fat: '#34d399', // xanh lá
        protein: '#60a5fa' // xanh dương
    };
    // State để tạo hiệu ứng tăng dần
    const [animatedValues, setAnimatedValues] = useState({
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setAnimatedValues(prev => {
                const next = { ...prev };
                let done = true;
                Object.entries(data).forEach(([key, { value, goal }]) => {
                    const percent = Math.min(Math.round((value / goal) * 100), 100);
                    if (prev[key] < percent) {
                        next[key] = Math.min(prev[key] + 2, percent); // tăng dần 2% mỗi tick
                        done = false;
                    }
                });
                if (done)
                    clearInterval(interval);
                return next;
            });
        }, 15); // tick 15ms
        return () => clearInterval(interval);
    }, [data]);
    return (_jsxs("section", { children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center gap-2", children: [_jsx(FiBarChart2, { size: 20 }), "Dinh d\u01B0\u1EE1ng h\u00F4m nay"] }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: Object.entries(data).map(([key, { value, goal }]) => {
                    const percent = animatedValues[key];
                    return (_jsxs("div", { className: "flex flex-col items-center p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all", children: [_jsx("div", { className: "w-24 h-24", children: _jsx(CircularProgressbar, { value: percent, text: `${value}/${goal}`, styles: buildStyles({
                                        textSize: '14px',
                                        pathColor: colors[key],
                                        textColor: '#111',
                                        trailColor: '#e5e7eb'
                                    }) }) }), _jsx("span", { className: "mt-2 capitalize text-sm font-medium", children: key })] }, key));
                }) })] }));
}
