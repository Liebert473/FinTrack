import { useAuth } from "../AuthContext";
import { useNotify } from "../NotificationContext";

export function useFetchAuth() {
    const { logout } = useAuth();
    const { notify } = useNotify();

    return async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem("token");

        let response;
        try {
            response = await fetch(url, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(options.headers || {})
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notify(data.error || "Unauthorized", "error");
                    logout();
                }
                throw new Error(data.message || "Request failed");
            }

            return data;
        } catch (err) {
            notify(err.message || "Fetch error", "error");
            throw err;
        }
    };
}
