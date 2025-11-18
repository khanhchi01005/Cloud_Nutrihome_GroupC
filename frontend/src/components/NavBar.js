import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// NavBar.tsx
import { FiArrowLeft, FiHome, FiCpu, FiMenu, FiCalendar, FiClock, FiUsers, FiCamera, FiMessageCircle } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";
export default function NavBar({ open, onClose }) {
    return (_jsxs("div", { className: `fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white to-blue-50 shadow-2xl z-50
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}`, children: [_jsxs("div", { className: "flex justify-between items-center px-4 h-22 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FiMenu, { className: "text-2xl text-blue-600" }), _jsx("span", { className: "font-extrabold text-2xl tracking-wider text-blue-600", children: "MENU" })] }), _jsx(FiArrowLeft, { className: "text-3xl cursor-pointer text-blue-600 hover:text-red-500 transition rounded-full p-1 hover:bg-gray-200", onClick: onClose })] }), _jsx("div", { className: "flex flex-col px-4 py-4 space-y-3 font-medium text-gray-700", children: [
                    { href: "/", icon: _jsx(FiHome, {}), label: "Trang chủ" },
                    { href: "/weekly_menu", icon: _jsx(FiCalendar, {}), label: "Thực đơn hàng tuần" },
                    { href: "/create_weekly_menu", icon: _jsx(FiCpu, {}), label: "Tạo Thực đơn hàng tuần" },
                    { href: "/recipes", icon: _jsx(GiKnifeFork, {}), label: "Món ăn" },
                    { href: "/history", icon: _jsx(FiClock, {}), label: "Lịch sử ăn uống" },
                    { href: "/family", icon: _jsx(FiUsers, {}), label: "Gia đình" },
                    { href: "/ingredient_safety", icon: _jsx(FiCamera, {}), label: "Quét nguyên liệu" },
                    { href: "/community", icon: _jsx(FiMessageCircle, {}), label: "Cộng đồng" },
                ].map((item, idx) => (_jsxs("a", { href: item.href, className: "flex items-center space-x-3 p-3 rounded-lg\r\n                            hover:bg-blue-100 hover:shadow-md hover:scale-105\r\n                            transition-all duration-200 cursor-pointer", children: [_jsx("div", { className: "text-blue-600 text-xl", children: item.icon }), _jsx("span", { className: "font-semibold", children: item.label })] }, idx))) })] }));
}
