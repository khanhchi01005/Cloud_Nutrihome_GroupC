import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

import HomePage from "./pages/Home";
import WeeklyMenuPage from "./pages/WeeklyMenu";
import CreateWeeklyMenuPage from "./pages/CreateWeeklyMenu";
import RecipesPage from "./pages/Recipes"
import HistoryPage from "./pages/History";
import FamilyPage from "./pages/Family";
import IngredientSafetyPage from "./pages/IngredientSafety";
import ChatBox from "./pages/Chatbot";
import ComingSoon from "./pages/ComingSoon";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/Login";
import SignUp from "./pages/Signup";

export default function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Trang chủ: nếu chưa login thì hiển thị Welcome */}
      <Route path="/" element={user ? <HomePage /> : <Welcome />} />
      <Route path="/weekly_menu" element={user ? <WeeklyMenuPage /> : <LoginPage />} />
      <Route path="/create_weekly_menu" element={user ? <CreateWeeklyMenuPage /> : <LoginPage />} />
      <Route path="/recipes" element={user ? <RecipesPage /> : <LoginPage />} />
      <Route path="/history" element={user ? <HistoryPage /> : <LoginPage />} />
      <Route path="/family" element={user ? <FamilyPage /> : <LoginPage />} />
      <Route path="/ingredient_safety" element={user ? <IngredientSafetyPage /> : <LoginPage />} />

      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Các trang khác */}
      <Route path="/ai" element={<ChatBox />} />

      {/* 404 fallback */}
      <Route path="*" element={<ComingSoon />} />
    </Routes>
  );
}