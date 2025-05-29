import s from '../../css/settings.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useFetchAuth } from '../../components/fetchAuth';
import { useNotify } from '../../NotificationContext';

function Settings() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'

    const navigate = useNavigate()
    const [openDel, setOpenDel] = useState(false)
    const { logout } = useAuth()
    const { notify } = useNotify()

    const fetchAuth = useFetchAuth()

    async function DeleteAccount() {
        setOpenDel(false)
        try {
            const rs = await fetchAuth(`${API_BASE}/api/user/deleteProfile`, {
                method: "DELETE"
            })

            notify(rs.message, 'success')
            logout()

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className={s.screen}>
            <div className={s.top}>
                <span className={`bi-arrow-left-short ${s.bi}`} onClick={() => navigate('/profile')}></span>
                <div className={s.headding}>
                    <h1>Settings</h1>
                </div>
            </div>

            <div className={s.body}>

                <div className={s.option} onClick={() => navigate('/profile/settings/change_password')}>
                    <div>
                        <i className={`${s.bi} bi-shield-lock`}></i>
                        <p>Change Password</p>
                    </div>
                    <i className={`${s.bi} bi-chevron-right`}></i>
                </div>

                <div className={s.option} onClick={() => setOpenDel(true)}>
                    <div>
                        <i className={`${s.bi} bi-trash-fill`}></i>
                        <p>Delete Account</p>
                    </div>
                    <i className={`${s.bi} bi-chevron-right`}></i>
                </div>
            </div>

            {openDel &&
                <div className={s.wrapper}>
                    <div className={s["delete_w"]}>
                        <div className={s.close} onClick={() => setOpenDel(false)}>
                            <i className={`${s.bi} bi-x`}></i>
                        </div>
                        <div className={s.content}>
                            <p>Are you sure you want to delete this Account?</p>
                            <span>This action is irreversible. Once deleted, the account cannot be recovered.</span>
                            <button onClick={DeleteAccount} className={s.btn1}>Delete</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default Settings;