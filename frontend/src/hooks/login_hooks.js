import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { apiPost, apiGet } from "../api";

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { setUser } = useContext(AuthContext);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            // --- LOGIN ---
            const data = await apiPost("/api/credentials/login", {
                username,
                password,
            });

            const user = data.data.user;

            // --- GỌI API TÍNH LẠI CALO SAU LOGIN ---
            try {
                await apiPost("/api/home/update_calories", {
                    user_id: user.user_id,
                });
                console.log("Đã cập nhật eaten_* cho user sau login");
            } catch (err) {
                console.error("Không cập nhật được calories:", err);
            }

            // --- LẤY RECIPES SAU KHI LOGIN ---
            try {
                const recipesRes = await apiGet("/api/recipes/get-all");

                if (recipesRes && recipesRes.data) {
                    localStorage.setItem("recipes", JSON.stringify(recipesRes.data));
                    console.log("Saved recipes to localStorage");
                }
            } catch (recipesErr) {
                console.error("Không fetch được recipes:", recipesErr);
            }

            // Lưu user vào context & localStorage
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            return user;
        } catch (err) {
            setError(err.message || "Không kết nối được server");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}
