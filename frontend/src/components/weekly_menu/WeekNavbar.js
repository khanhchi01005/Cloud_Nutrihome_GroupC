import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FiCalendar } from "react-icons/fi";
const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
export default function WeekNavbar({ selectedDay, onSelect }) {
    return (_jsx("div", { className: "flex overflow-x-auto bg-white shadow-md \r\n    px-4 py-4 gap-4 rounded-xl w-fit", children: days.map((day, index) => {
            const isActive = selectedDay === index;
            return (_jsxs("button", { onClick: () => onSelect(index), className: `
                            flex items-center gap-2 whitespace-nowrap cursor-pointer
                            rounded-full px-4 py-2 font-semibold transition-all duration-300
                            active:scale-95 select-none
                            ${isActive
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"}
                        `, children: [_jsx(FiCalendar, { className: `text-lg transition ${isActive ? "text-white" : "text-blue-600"}` }), day] }, index));
        }) }));
}
