import s from '../../css/password.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFetchAuth } from '../../components/fetchAuth';
import { useNotify } from '../../NotificationContext';

function Password() {
    const navigate = useNavigate()
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [rePassword, setRePassword] = useState('')

    const { notify } = useNotify()

    const fetchAuth = useFetchAuth()

    async function UpdatePassword(e) {
        e.preventDefault();

        if (newPassword != rePassword) {
            notify('Re-enter the same password.', 'error')
            return
        }

        try {
            const rs = await fetchAuth(`${API_BASE}/api/user/updatePassword`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword, newPassword
                })
            })

            notify(rs.message, 'success')
            setNewPassword('')
            setCurrentPassword('')
            setRePassword('')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={s.screen}>
            <div className={s.top}>
                <span className={`bi-arrow-left-short ${s.bi}`} onClick={() => navigate('/profile/settings')}></span>
                <div className={s.headding}>
                    <h1>Change Password</h1>
                </div>
            </div>

            <div className={s.body}>
                <form className={s["body-form"]} onSubmit={UpdatePassword}>
                    <div className={s.input}>
                        <label htmlFor="old-password">Enter old password</label>
                        <input type="password" name="old-password" id="old-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div className={s.input}>
                        <label htmlFor="new-password">Enter new password</label>
                        <input type="password" name="new-password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <div className={s.input}>
                        <label htmlFor="renew-password">Re-enter new password</label>
                        <input type="password" name="renew-password" id="renew-password" value={rePassword} onChange={e => setRePassword(e.target.value)} required />
                    </div>

                    <button type="submit" className={s.btn1}>Save</button>
                </form>
            </div>
        </div>
    );
}

export default Password;
