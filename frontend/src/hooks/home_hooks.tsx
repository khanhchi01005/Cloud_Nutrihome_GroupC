import { useState } from "react";
import { apiPost } from "../api";

export interface EatenData {
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

export interface SyncNutritionPayload {
  user_id: number;
  eaten: EatenData;
}

export interface SyncNutritionResponse {
  status: "success" | "error";
  message: string;
  data?: {
    eaten_calories: number;
    eaten_carbs: number;
    eaten_fat: number;
    eaten_protein: number;
  };
}

export function useSyncNutrition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SyncNutritionResponse | null>(null);

  const syncNutrition = async (payload: SyncNutritionPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiPost<SyncNutritionResponse>(
        "/api/home/sync_nutrition",
        payload
      );
      setResult(data);

      // Cập nhật eaten trong localStorage nếu API trả current khác
      if (data?.data) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = {
            ...user,
            eaten_calories: data.data.eaten_calories ?? user.eaten_calories,
            eaten_carbs: data.data.eaten_carbs ?? user.eaten_carbs,
            eaten_fat: data.data.eaten_fat ?? user.eaten_fat,
            eaten_protein: data.data.eaten_protein ?? user.eaten_protein,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      }

      return data;
    } catch (err: any) {
      setError(err.message || "Failed to sync nutrition");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { syncNutrition, loading, error, result };
}

interface ResetEatenPayload {
  user_id: number;
}

interface ResetEatenResponse {
  status: "success" | "error";
  message: string;
}

export function useResetEaten() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResetEatenResponse | null>(null);

  const resetEaten = async (payload: ResetEatenPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiPost<ResetEatenResponse>(
        "/api/home/reset_eaten",
        payload
      );
      setResult(data);

      // Cập nhật luôn trong localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = {
          ...user,
          eaten_calories: 0,
          eaten_carbs: 0,
          eaten_fat: 0,
          eaten_protein: 0,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return data;
    } catch (err: any) {
      setError(err.message || "Failed to reset eaten values");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { resetEaten, loading, error, result };
}
