import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { apiPost, apiGet } from "../api";

interface LoginResponse {
    data: {
        user: any;
    };
}

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useContext(AuthContext);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            // --- LOGIN ---
            const data = await apiPost<LoginResponse>("/api/credentials/login", {
                username,
                password
            });

            // --- LẤY RECIPES SAU KHI LOGIN THÀNH CÔNG ---
            try {
                const recipesRes = await apiGet("/api/recipes/get-all");

                if (recipesRes?.data) {
                    localStorage.setItem("recipes", JSON.stringify(recipesRes.data));
                    console.log("Saved recipes to localStorage");
                }
            } catch (recipesErr) {
                console.error("Không fetch được recipes:", recipesErr);
            }

            const user = data.data.user;

            // Cập nhật context + localStorage
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));

            return user;
        } catch (err: any) {
            setError(err.message || "Không kết nối được server");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
}
