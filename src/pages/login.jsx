import s from '../css/register_login.module.css';
import '../css/bootstrap-icons.css';
import { useState } from "react";
import { useAuth } from '../AuthContext';
import { useNotify } from '../NotificationContext';

function Login() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com';
    const { login } = useAuth();
    const { notify } = useNotify()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            notify(data.message, 'success')
            login(data.token);
        } catch (err) {
            notify(err.message, 'error')
        }
    };

    return (
        <div className={s.screen}>
            <div className={s["login-page"]}>
                <div className={s["top"]}>
                    <div className={s["headding"]}>
                        <h1>Welcome back!</h1>
                        <p>Enter your credentials to login</p>
                    </div>
                </div>

                <div className={s["login"]}>
                    <form className={s["login-form"]} onSubmit={handleSubmit}>
                        <div className={s["inputs"]}>
                            <input
                                type="text"
                                placeholder="Enter username or email"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className={s["btn1"]}>Login</button>
                    </form>
                </div>

                <div className={s["or"]}>
                    <span>Or</span>
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
