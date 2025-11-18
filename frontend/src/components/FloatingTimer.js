import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
export default function FloatingTimer() {
    const [time, setTime] = useState(new Date());
    const [collapsed, setCollapsed] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // Hàm format ngày giờ
    const formatDateTime = (date) => {
        const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        const dayName = days[date.getDay()];
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // tháng từ 0-11
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${dayName}, ${dd}/${mm}/${yyyy}, ${hh}:${min}:${ss}`;
    };
    return (_jsx("div", { className: `fixed bottom-4 right-4 z-50 transition-all duration-300 ${collapsed ? "w-12 h-12" : "w-auto h-12"}`, children: _jsxs("button", { onClick: () => setCollapsed(!collapsed), className: `flex items-center justify-center ${collapsed ? "" : "justify-between px-3"} h-full w-full bg-blue-600 text-white font-bold rounded-full
       shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer`, children: [_jsx(FiClock, { size: 20 }), !collapsed && (_jsx("span", { className: "ml-2 text-sm", children: formatDateTime(time) }))] }) }));
}
