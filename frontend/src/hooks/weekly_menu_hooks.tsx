import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "../api"; // apiGet là wrapper fetch/axios GET
import type { WeeklyMenu } from "../datatypes/WeeklyMenuDataTypes";

export function useWeeklyMenu() {
  const [menu, setMenu] = useState<WeeklyMenu["menu"] | null>(() => {
    // Kiểm tra localStorage lúc init
    const storedMenu = localStorage.getItem("weekly_menu");
    return storedMenu ? JSON.parse(storedMenu) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyMenu = useCallback(async () => {
    // Nếu đã có menu trong state/localStorage thì không gọi API nữa
    if (menu) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("User not found in localStorage");
      return;
    }

    const user = JSON.parse(storedUser);
    const user_id = user.user_id;
    if (!user_id) {
      setError("user_id missing in localStorage user object");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiGet<{ status: string; data: WeeklyMenu }>(
        "/api/weekly_menu/get_weekly_menu",
        { user_id }
      );

      if (response.status === "success") {
        setMenu(response.data.menu);
        localStorage.setItem("weekly_menu", JSON.stringify(response.data.menu));
      } else {
        setError("Failed to fetch weekly menu");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching weekly menu");
    } finally {
      setLoading(false);
    }
  }, [menu]);

  useEffect(() => {
    fetchWeeklyMenu();
  }, [fetchWeeklyMenu]);

  return { menu, loading, error, fetchWeeklyMenu };
}

type MealType = "breakfast" | "lunch" | "dinner";

export function useMealByDayAndType() {
  const { menu, loading, error, fetchWeeklyMenu } = useWeeklyMenu();
  const [meals, setMeals] = useState<
    WeeklyMenu["menu"]["mon"]["breakfast"]["items"]
  >([]);
  const [mealType, setMealType] = useState<MealType>("breakfast");

  // Xác định bữa theo giờ
  const getMealTypeByHour = (hour: number): MealType => {
    if (hour >= 0 && hour < 9) return "breakfast";
    if (hour >= 9 && hour < 16) return "lunch";
    return "dinner";
  };

  // Xác định key ngày hiện tại (mon, tue,...)
  const getDayKey = (date: Date): keyof WeeklyMenu["menu"] => {
    return date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase() as keyof WeeklyMenu["menu"];
  };

  const loadMeals = useCallback(() => {
    let storedMenu: WeeklyMenu["menu"] | null = null;
    const wmenu = localStorage.getItem("weekly_menu");

    if (wmenu) {
      try {
        storedMenu = JSON.parse(wmenu);
      } catch {
        storedMenu = null;
      }
    }

    if (storedMenu) {
      const now = new Date();
      const dayKey = getDayKey(now);
      const type = getMealTypeByHour(now.getHours());
      setMealType(type);
      setMeals(storedMenu[dayKey][type].items);
    } else {
      // Nếu chưa có trong localStorage thì fetch từ API
      fetchWeeklyMenu();
    }
  }, [fetchWeeklyMenu]);

  // Khi menu mới được fetch xong, update meals
  useEffect(() => {
    if (!menu) return;

    const now = new Date();
    const dayKey = getDayKey(now);
    const type = getMealTypeByHour(now.getHours());

    setMealType(type);
    setMeals(menu[dayKey][type].items);
  }, [menu]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  return { meals, mealType, loading, error };
}

/* -------------------------------------------------------
   1) Hook: thêm món ăn thủ công
------------------------------------------------------- */
export function useAddCustomMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCustomMeal = async (
    user_id: number,
    name: string,
    day: string,
    meal: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost<{
        status: string;
        data?: any;
        message?: string;
      }>("/api/weekly_menu/add-custom-meal", {
        user_id,
        name,
        day,
        meal,
      });

      // Chỉ xoá cache khi action thành công
      if (res?.status === "success") {
        localStorage.removeItem("weekly_menu");
      }

      return res;
    } catch (err: any) {
      setError(err.message || "Failed to add custom meal");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { addCustomMeal, loading, error };
}

/* -------------------------------------------------------
   2) Hook: xoá món ăn thủ công
------------------------------------------------------- */
export function useRemoveCustomMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeCustomMeal = async (
    user_id: number,
    name: string,
    day: string,
    meal: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost<{
        status: string;
        data?: any;
        message?: string;
      }>("/api/weekly_menu/remove-custom-meal", {
        user_id,
        name,
        day,
        meal,
      });

      if (res?.status === "success") {
        localStorage.removeItem("weekly_menu");
      }

      return res;
    } catch (err: any) {
      setError(err.message || "Failed to remove custom meal");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { removeCustomMeal, loading, error };
}

/* -------------------------------------------------------
   3) Hook: upload hoá đơn OCR
------------------------------------------------------- */
export function useUploadReceipt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadReceipt = async (
    user_id: number,
    image_path: string,
    day: string,
    meal: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost<{
        status: string;
        data?: any;
        message?: string;
      }>("/api/weekly_menu/upload", {
        user_id,
        image_path,
        day,
        meal,
      });

      if (res?.status === "success") {
        localStorage.removeItem("weekly_menu");
      }

      return res;
    } catch (err: any) {
      setError(err.message || "Failed to upload receipt");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadReceipt, loading, error };
}

/* -------------------------------------------------------
   4) Hook: đánh dấu đã ăn
------------------------------------------------------- */
export function useEaten() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markEaten = async (user_id: number, day: string, meal: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost<{
        status: string;
        data?: any;
        message?: string;
      }>("/api/weekly_menu/eaten", {
        user_id,
        day,
        meal,
      });

      if (res?.status === "success") {
        localStorage.removeItem("weekly_menu");
      }

      return res;
    } catch (err: any) {
      setError(err.message || "Failed to mark eaten");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { markEaten, loading, error };
}

/* -------------------------------------------------------
   5) Hook: undo đã ăn
------------------------------------------------------- */
export function useUndoEaten() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const undoEaten = async (user_id: number, day: string, meal: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost<{
        status: string;
        data?: any;
        message?: string;
      }>("/api/weekly_menu/undo-eaten", {
        user_id,
        day,
        meal,
      });

      if (res?.status === "success") {
        localStorage.removeItem("weekly_menu");
      }

      return res;
    } catch (err: any) {
      setError(err.message || "Failed to undo eaten");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { undoEaten, loading, error };
}
