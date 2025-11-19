import { useState } from "react";
import { apiPost } from "../api"; // đổi nếu bạn dùng axios instance khác
export function useGenerateFamilyMeal() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const generateFamilyMeal = async (payload) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await apiPost("/api/llm-services/generate-family-meal", payload);
            if (res?.message) {
                setSuccess(res.message);
            }
            else {
                setSuccess("Tạo thực đơn thành công");
            }
            return res;
        }
        catch (err) {
            const msg = err?.response?.data?.error ||
                err?.message ||
                "Lỗi không xác định khi tạo thực đơn gia đình";
            setError(msg);
            throw err;
        }
        finally {
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
