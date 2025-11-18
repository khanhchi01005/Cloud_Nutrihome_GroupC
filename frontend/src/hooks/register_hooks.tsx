import { useState } from "react";
import { apiPost } from "../api";

interface RegisterForm {
    fullname: string;
    username: string;
    password: string;
    confirm_password: string;
    dob: string;
    height: number;
    weight: number;
    activity_level: string;
    disease?: string | null;
    allergen?: string | null;
    gender: string;
}

export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const register = async (form: RegisterForm) => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiPost("/api/credentials/register", form);
            setResult(data);
            return data;
        } catch (err: any) {
            setError(err.message || "Register failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { register, loading, error, result };
}
