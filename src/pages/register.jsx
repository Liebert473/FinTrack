import s from '../css/register_login.module.css'
import '../css/bootstrap-icons.css'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

function Register() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const { from } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add validation, send request, etc.
        console.log({ email, name, username, password, confirmPassword });
    };

    return (
        <div className={s.screen}>
            <div className={s["signup-page"]}>
                <div className={s["top"]}>
                    <span className={`${s.bi} bi-arrow-left-short`}></span>
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
                                required
                            />
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className={s["btn1"]}>Sign up</button>
                    </form>
                </div>

                <div className={s["or"]}>
                    <span>Or</span>
                    <p>Already have an account? <a href="">Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default Register;