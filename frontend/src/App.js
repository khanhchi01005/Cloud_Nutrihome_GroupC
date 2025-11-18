import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import FloatingTimer from "./components/FloatingTimer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./AuthContext";
import { useContext } from "react";
function Layout() {
    const { user } = useContext(AuthContext);
    // // Nếu chưa login, chỉ render routes (ví dụ trang login/signup)
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex flex-col", children: _jsx("div", { className: "flex-grow", children: _jsx(AppRoutes, {}) }) }));
    }
    // Nếu đã login, hiện đủ Header, AppRoutes, FloatingChatButton, Footer
    return (_jsxs("div", { className: "min-h-screen flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-grow", children: _jsx(AppRoutes, {}) }), _jsx(FloatingTimer, {}), _jsx(Footer, {})] }));
}
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(Layout, {}) }) }));
}
export default App;
