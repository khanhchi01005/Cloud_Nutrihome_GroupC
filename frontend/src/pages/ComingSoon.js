import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useEffect } from "react";
export default function ComingSoon() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (_jsx("div", { className: "flex flex-col min-h-screen", children: _jsxs("main", { className: "flex-1 flex flex-col items-center justify-center text-white \r\n             bg-gradient-to-br from-sky-500 to-blue-600\r\n             relative overflow-hidden", children: [_jsx("div", { className: "absolute w-96 h-96 bg-sky-300 opacity-20 rounded-full blur-3xl top-10 left-10 animate-pulse" }), _jsx("div", { className: "absolute w-80 h-80 bg-blue-400 opacity-30 rounded-full blur-2xl bottom-10 right-10 animate-pulse" }), _jsx("div", { className: "absolute w-64 h-64 bg-sky-200 opacity-10 rounded-full blur-2xl top-1/3 left-1/4 animate-pulse" }), _jsx("div", { className: "absolute w-72 h-72 bg-blue-300 opacity-15 rounded-full blur-3xl bottom-1/3 right-1/3 animate-pulse" }), _jsx("h1", { className: "text-7xl font-extrabold drop-shadow-2xl animate-bounce text-center", children: "Coming Soon" }), _jsxs("p", { className: "mt-6 text-xl max-w-lg text-center animate-fadeIn", children: ["Trang b\u1EA1n \u0111ang t\u00ECm hi\u1EC7n \u0111ang \u0111\u01B0\u1EE3c ph\u00E1t tri\u1EC3n.", _jsx("br", {}), "H\u00E3y quay l\u1EA1i trang ch\u1EE7 v\u00E0 kh\u00E1m ph\u00E1 c\u00E1c t\u00EDnh n\u0103ng kh\u00E1c!"] }), _jsxs(Link, { to: "/", className: "mt-10 flex items-center gap-3 px-10 py-4 bg-white text-blue-700 \r\n               rounded-full font-semibold shadow-xl hover:shadow-2xl \r\n               hover:scale-110 transition-transform", children: [_jsx(FiArrowLeftCircle, { size: 24 }), "V\u1EC1 trang ch\u1EE7"] }), _jsxs("div", { className: "absolute bottom-10 text-sm text-white/80 animate-pulse", children: ["\u00A9 ", new Date().getFullYear(), " NutriHome Team"] })] }) }));
}
