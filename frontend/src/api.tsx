// src/utils/api.tsx
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Lỗi server");
    }

    return data as T;
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const query = new URLSearchParams(params as any).toString();
        url += `?${query}`;
    }

    const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Lỗi server");
    }

    return data as T;
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, body: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Lỗi server");
    }

    return data as T;
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string, body?: any): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || data.error || "Lỗi server");
    }

    return data as T;
}
