import { useState, useEffect } from "react";
import { apiGet } from "../api"; // đường dẫn tới file api của bạn
export function useHistory(user_id) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!user_id)
            return;
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet("/api/personal/history", { user_id });
                if (res.status === "success") {
                    setData(res.data);
                }
                else {
                    setError("Failed to fetch history");
                }
            }
            catch (err) {
                setError(err.message || "Error fetching history");
            }
            finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [user_id]);
    return { data, loading, error };
}
export function useDayMenu(user_id, day) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!user_id || !day)
            return;
        const fetchDayMenu = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiGet("/api/personal/history_menu", { user_id, day });
                if (res.status === "success") {
                    setData(res.data);
                }
                else {
                    setError("Failed to fetch day menu");
                }
            }
            catch (err) {
                setError(err.message || "Error fetching day menu");
            }
            finally {
                setLoading(false);
            }
        };
        fetchDayMenu();
    }, [user_id, day]);
    return { data, loading, error };
}
