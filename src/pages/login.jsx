import styles from '../css/upload.module.css'
import '../css/bootstrap-icons.css'
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

function Login() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const { from } = useParams();
    const navigate = useNavigate();

    return (
        <>

        </>
    )
}

export default Login;