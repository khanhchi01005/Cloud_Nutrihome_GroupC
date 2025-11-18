import { useState, useEffect } from "react";
import { apiGet } from "../api"; // đường dẫn tới file api của bạn

interface NutrientData {
    carbs: number;
    protein: number;
    fat: number;
    calories: number;
}

interface HistoryData {
    [day: string]: NutrientData;
}

export function useHistory(user_id?: string) {
    const [data, setData] = useState<HistoryData>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user_id) return;

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet<{ status: string; data: HistoryData }>("/api/personal/history", { user_id });
                if (res.status === "success") {
                    setData(res.data);
                } else {
                    setError("Failed to fetch history");
                }
            } catch (err: any) {
                setError(err.message || "Error fetching history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user_id]);

    return { data, loading, error };
}

interface RecipeItem {
    recipe_id: number;
    name: string;
    image: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    cooking_time: string;
    eaten: number;
}

interface MealData {
    items: RecipeItem[];
    nutrients: {
        calories: number;
        carbs: number;
        protein: number;
        fat: number;
    };
}

interface DayMenuData {
    breakfast: MealData;
    lunch: MealData;
    dinner: MealData;
    [meal: string]: MealData;
}

export function useDayMenu(user_id?: string, day?: string) {
    const [data, setData] = useState<DayMenuData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user_id || !day) return;

        const fetchDayMenu = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet<{ status: string; data: DayMenuData }>("/api/personal/history_menu", { user_id, day });
                if (res.status === "success") {
                    setData(res.data);
                } else {
                    setError("Failed to fetch day menu");
                }
            } catch (err: any) {
                setError(err.message || "Error fetching day menu");
            } finally {
                setLoading(false);
            }
        };

        fetchDayMenu();
    }, [user_id, day]);

    return { data, loading, error };
}