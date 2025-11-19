import { useState } from "react";
import { apiPost } from "../api"; // đổi nếu bạn dùng axios instance khác

export interface GenerateFamilyMealPayload {
  family_id: number;
  start_date?: string; // yyyy-mm-dd
  end_date?: string; // yyyy-mm-dd
  available_ingredients?: string; // string
}

export function useGenerateFamilyMeal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateFamilyMeal = async (payload: GenerateFamilyMealPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await apiPost<{
        status: string;
        data?: any;
        message?: string;
      }>("/api/llm-services/generate-family-meal", payload);

      if (res?.message) {
        setSuccess(res.message);
      } else {
        setSuccess("Tạo thực đơn thành công");
      }

      return res;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Lỗi không xác định khi tạo thực đơn gia đình";

      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateFamilyMeal,
    loading,
    error,
    success,
  };
}
