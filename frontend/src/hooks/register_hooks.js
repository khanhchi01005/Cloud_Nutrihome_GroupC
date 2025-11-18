import { useState } from "react";
import { apiPost } from "../api";
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const register = async (form) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiPost("/api/credentials/register", form);
            setResult(data);
            return data;
        }
        catch (err) {
            setError(err.message || "Register failed");
            return null;
        }
        finally {
            setLoading(false);
        }
    };
    return { register, loading, error, result };
}
