import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import HomePage from "./pages/Home";
import WeeklyMenuPage from "./pages/WeeklyMenu";
import CreateWeeklyMenuPage from "./pages/CreateWeeklyMenu";
import RecipesPage from "./pages/Recipes";
import HistoryPage from "./pages/History";
import FamilyPage from "./pages/Family";
import IngredientSafetyPage from "./pages/IngredientSafety";
import ChatBox from "./pages/Chatbot";
import ComingSoon from "./pages/ComingSoon";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/Login";
import SignUp from "./pages/Signup";
import Profile from "./pages/Profile";
export default function AppRoutes() {
    const { user } = useContext(AuthContext);
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: user ? _jsx(HomePage, {}) : _jsx(Welcome, {}) }), _jsx(Route, { path: "/weekly_menu", element: user ? _jsx(WeeklyMenuPage, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/create_weekly_menu", element: user ? _jsx(CreateWeeklyMenuPage, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/recipes", element: user ? _jsx(RecipesPage, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/history", element: user ? _jsx(HistoryPage, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/family", element: user ? _jsx(FamilyPage, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/ingredient_safety", element: user ? _jsx(IngredientSafetyPage, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/profile", element: user ? _jsx(Profile, {}) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUp, {}) }), _jsx(Route, { path: "/ai", element: _jsx(ChatBox, {}) }), _jsx(Route, { path: "*", element: _jsx(ComingSoon, {}) })] }));
}
