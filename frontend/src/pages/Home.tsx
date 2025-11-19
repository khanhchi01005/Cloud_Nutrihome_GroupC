import { useEffect, useState, useMemo } from "react";
import { FiCoffee, FiBook, FiCpu, FiHeart, FiCalendar, FiClock, FiUsers, FiCamera, FiMessageCircle } from "react-icons/fi";
import { GiKnifeFork } from "react-icons/gi";

import NutritionOverview from "../components/home/NutritionOverview";
import NextMeal from "../components/home/NextMeal";
import FeatureButtons from "../components/home/FeatureButtons";
import HotFoods from "../components/home/HotFoods";
import LatestArticles from "../components/home/LatestArticles";

import { useSyncNutrition, useResetEaten } from "../hooks/home_hooks";
import { useMealByDayAndType } from "../hooks/weekly_menu_hooks";

export default function HomePage() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { syncNutrition } = useSyncNutrition();
  const { resetEaten } = useResetEaten();

  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    if (user && !hasSynced) {
      syncNutrition({
        user_id: user.user_id,
        eaten: {
          calories: user.eaten_calories ?? 0,
          carbs: user.eaten_carbs ?? 0,
          fat: user.eaten_fat ?? 0,
          protein: user.eaten_protein ?? 0,
        },
      });
      setHasSynced(true);
    }
  }, [user, hasSynced]);


  // 2. Reset eaten mỗi 0h
  useEffect(() => {
    if (!user) return;

    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      resetEaten({ user_id: user.user_id });

      // Lặp lại mỗi 24h
      setInterval(() => resetEaten({ user_id: user.user_id }), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, [user]);

  const nutritionData = user
    ? {
      calories: { value: user.eaten_calories ?? 0, goal: user.target_calories ?? 0 },
      carbs: { value: user.eaten_carbs ?? 0, goal: user.target_carbs ?? 0 },
      fat: { value: user.eaten_fat ?? 0, goal: user.target_fat ?? 0 },
      protein: { value: user.eaten_protein ?? 0, goal: user.target_protein ?? 0 },
    }
    : { calories: { value: 0, goal: 0 }, carbs: { value: 0, goal: 0 }, fat: { value: 0, goal: 0 }, protein: { value: 0, goal: 0 } };

  const hotFoods = useMemo(() => {
    const recipes = JSON.parse(localStorage.getItem("recipes") || "[]");
    return recipes.sort(() => Math.random() - 0.5).slice(0, 10);
  }, []);

  const { meals, mealType, loading: mealsLoading, error: mealsError } = useMealByDayAndType();

  console.log(meals)

  const features = [
    { name: "Thực đơn hàng tuần", icon: <FiCalendar />, href: "/weekly_menu" },
    { name: "Tạo Thực đơn hàng tuần", icon: <FiCpu />, href: "/create_weekly_menu" },
    { name: "Món ăn", icon: <GiKnifeFork />, href: "/recipes" },
    { name: "Lịch sử ăn uống", icon: <FiClock />, href: "/history" },
    { name: "Gia đình", icon: <FiUsers />, href: "/family" },
    { name: "Quét nguyên liệu", icon: <FiCamera />, href: "/ingredient_safety" },
    { name: "Cộng đồng", icon: <FiMessageCircle />, href: "/community" },
  ];

  const articles = [
    {
      title: "6 món ăn giàu protein giúp bạn khỏe mạnh hơn",
      summary: "Protein là dưỡng chất thiết yếu cho cơ thể. Dưới đây là danh sách 6 món vừa ngon vừa bổ.",
      image: "https://nutrihome-assets.s3.ap-southeast-1.amazonaws.com/images/posts/1.jpg",
      author: "Nguyễn Phước Ngưỡng Long",
      date: "2025-11-12",
    },
    {
      title: "Cách lên thực đơn giảm cân an toàn cho sinh viên",
      summary: "Chỉ cần vài mẹo nhỏ bạn có thể giảm cân mà không cần ăn kiêng khắc nghiệt.",
      image: "https://nutrihome-assets.s3.ap-southeast-1.amazonaws.com/images/posts/2.jpg",
      author: "Hoàng Khánh Chi",
      date: "2025-11-10",
    },
    {
      title: "Top 5 món ăn nhanh nhưng vẫn đủ dinh dưỡng",
      summary: "Bận rộn không có nghĩa là ăn thiếu chất. Đây là 5 lựa chọn tối ưu.",
      image: "https://nutrihome-assets.s3.ap-southeast-1.amazonaws.com/images/posts/3.jpg",
      author: "Đinh Minh Vũ",
      date: "2025-11-08",
    },
  ];


  return (
    <div className="pt-27 container mx-auto px-4 mb-10 space-y-6">
      {/* Hai ô cùng hàng */}
      <div className="grid grid-cols-1 md:grid-cols-[30%_70%] gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 h-96">
          <NutritionOverview data={nutritionData} />
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 h-96">
          <NextMeal meals={meals} />
        </div>
      </div>

      <FeatureButtons features={features} />
      <HotFoods foods={hotFoods} />
      <LatestArticles articles={articles} />
    </div>
  );
}
