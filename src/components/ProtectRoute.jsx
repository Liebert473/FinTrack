import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export function ProtectRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return null

    return user ? children : <Navigate to="/login" replace />
}