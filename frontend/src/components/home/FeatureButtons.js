import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function FeatureButtons({ features }) {
    return (_jsx("section", { children: _jsx("div", { className: "grid grid-cols-7 gap-4", children: features.map((f) => (_jsxs("a", { href: f.href, className: "flex flex-col items-center p-4 bg-white rounded-lg \r\n                        border-1 border-blue-600 shadow cursor-pointer \r\n                        hover:shadow-xl hover:scale-105 transition-transform", children: [_jsx("div", { className: "text-2xl text-blue-600", children: f.icon }), _jsx("span", { className: "mt-2 text-sm font-semibold", children: f.name })] }, f.name))) }) }));
}
