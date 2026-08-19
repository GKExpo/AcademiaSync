import { Preferences } from '@capacitor/preferences';
const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const { value: token } = await Preferences.get({ key: "token" });

    console.log("Calling:", `${API_URL}${endpoint}`);
    console.log("Token:", token);

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw error;
    }

    return response.json();
}
