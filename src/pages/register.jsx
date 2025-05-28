import s from '../css/register_login.module.css'
import '../css/bootstrap-icons.css'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useNotify } from '../NotificationContext';
import { useAuth } from '../AuthContext';

function Register() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const { from } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { notify } = useNotify()
    const { login } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            notify("Passwords do not match. Please re-enter the same password.", "error");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    name,
                    username,
                    password,
                })
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            notify('Registration success.', 'success')

            const token = data.token

            login(token)

        } catch (err) {
            notify(err.message)
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }

    }, [])

    return (
        <div className={s.screen}>
            <div className={s["signup-page"]}>
                <div className={s["top"]}>
                    <div className={s["headding"]}>
                        <h1>Welcome!</h1>
                        <p>Enter your credentials to sign up</p>
                    </div>
                </div>

                <div className={s["signup"]}>
                    <form className={s["signup-form"]} onSubmit={handleSubmit}>
                        <div className={s["inputs"]}>
                            <input
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Create username"
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
                                minLength={8}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                        </div>

                        <button type="submit" className={s["btn1"]}>Sign up</button>
                    </form>
                </div>

                <div className={s["or"]}>
                    <span>Or</span>
                    <p>Already have an account? <a onClick={() => navigate('/login')}>Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;