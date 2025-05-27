import { createContext, use, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUser({ id: decoded.userId })
            } catch {
                localStorage.removeItem('token')
                setUser(null)
            }
        }

        setLoading(false)
    }, [])

    const login = (token) => {
        localStorage.setItem('token', token)
        const decoded = jwtDecode(token)
        setUser({ id: decoded.userId })
        navigate('/home')
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}