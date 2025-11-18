import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiCpu, FiGift, FiTarget, FiBarChart2, FiPackage, FiFileText } from "react-icons/fi";
import ChatBox from "./ChatBox";
const features = [
    { name: "Cửa hàng", route: "/search?type=shop", icon: _jsx(FiShoppingBag, {}) },
    { name: "Sản phẩm", route: "/search?type=product", icon: _jsx(FiPackage, {}) },
    { name: "AI gợi ý", isChat: true, icon: _jsx(FiCpu, {}) }, // đánh dấu mở chat
    { name: "Voucher", route: "/voucher", icon: _jsx(FiGift, {}) },
    { name: "Minigame", route: "/game", icon: _jsx(FiTarget, {}) },
    { name: "Bảng xếp hạng", route: "/ranking", icon: _jsx(FiBarChart2, {}) },
    { name: "Bài viết", route: "/posts", icon: _jsx(FiFileText, {}) },
];
export default function FeatureCards() {
    const [openChat, setOpenChat] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 my-6", children: features.map((f, i) => f.isChat ? (_jsxs("div", { onClick: () => setOpenChat(true), className: "bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg \r\n                        hover:scale-105 transition transform duration-300 p-4 flex flex-col \r\n                        items-center text-center cursor-pointer", children: [_jsx("div", { className: "text-3xl text-blue-600 mb-2", children: f.icon }), _jsx("p", { className: "font-bold text-base", children: f.name })] }, i)) : (_jsxs(Link, { to: f.route, className: "bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg \r\n                        hover:scale-105 transition transform duration-300 p-4 flex flex-col \r\n                        items-center text-center cursor-pointer", children: [_jsx("div", { className: "text-3xl text-blue-600 mb-2", children: f.icon }), _jsx("p", { className: "font-bold text-base", children: f.name })] }, i))) }), openChat && (_jsx("div", { className: "fixed bottom-20 right-18 w-96 h-[510px] z-50", children: _jsx(ChatBox, { onClose: () => setOpenChat(false) }) }))] }));
}
