// NavBar.tsx
import {
    FiArrowLeft,
    FiHome,
    FiCoffee,
    FiBookOpen,
    FiCpu,
    FiMenu,
    FiCalendar,
    FiClock,
    FiUsers,
    FiCamera,
    FiMessageCircle
} from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";

interface NavBarProps {
    open: boolean;
    onClose: () => void;
}

export default function NavBar({ open, onClose }: NavBarProps) {
    return (
        <div
            className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white to-blue-50 shadow-2xl z-50
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
            {/* Header */}
            <div className="flex justify-between items-center px-4 h-22 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
                <div className="flex items-center gap-2">
                    {/* Icon menu */}
                    <FiMenu className="text-2xl text-blue-600" />
                    <span className="font-extrabold text-2xl tracking-wider text-blue-600">
                        MENU
                    </span>
                </div>
                <FiArrowLeft
                    className="text-3xl cursor-pointer text-blue-600 hover:text-red-500 transition rounded-full p-1 hover:bg-gray-200"
                    onClick={onClose}
                />
            </div>

            {/* Menu Items */}
            <div className="flex flex-col px-4 py-4 space-y-3 font-medium text-gray-700">
                {[
                    { href: "/", icon: <FiHome />, label: "Trang chủ" },
                    { href: "/weekly_menu", icon: <FiCalendar />, label: "Thực đơn hàng tuần" },
                    { href: "/create_weekly_menu", icon: <FiCpu />, label: "Tạo Thực đơn hàng tuần" },
                    { href: "/recipes", icon: <GiKnifeFork />, label: "Món ăn" },
                    { href: "/history", icon: <FiClock />, label: "Lịch sử ăn uống" },
                    { href: "/family", icon: <FiUsers />, label: "Gia đình" },
                    { href: "/ingredient_safety", icon: <FiCamera />, label: "Quét nguyên liệu" },
                    { href: "/community", icon: <FiMessageCircle />, label: "Cộng đồng" },
                ].map((item, idx) => (
                    <a
                        key={idx}
                        href={item.href}
                        className="flex items-center space-x-3 p-3 rounded-lg
                            hover:bg-blue-100 hover:shadow-md hover:scale-105
                            transition-all duration-200 cursor-pointer"
                    >
                        <div className="text-blue-600 text-xl">{item.icon}</div>
                        <span className="font-semibold">{item.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
