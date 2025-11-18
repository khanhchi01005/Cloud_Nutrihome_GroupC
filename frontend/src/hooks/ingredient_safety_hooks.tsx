import { useState } from "react";

export function useScanAllergen() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scanAllergen = async (file: File) => {
        if (!file) return [];

        setLoading(true);
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const user_id = user.user_id;

            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", user_id.toString());

            const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

            const res = await fetch(`${API_BASE_URL}/api/ingredient_safety/scan_allergen`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.status === "success") {
                // Nếu server trả rỗng string, trả về []
                if (!data.allergen_found) return [];
                // Chia string thành array, loại bỏ khoảng trắng thừa
                return data.allergen_found.split(",").map(a => a.trim());
            } else {
                setError(data.message || "Quét nguyên liệu thất bại");
                return [];
            }
        } catch (err: any) {
            setError(err.message || "Quét nguyên liệu thất bại");
            return [];
        } finally {
            setLoading(false);
        }
    };

    return { scanAllergen, loading, error };
}
