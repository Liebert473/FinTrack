import s from '../css/notifications.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchAuth } from '../components/fetchAuth';

function Notifications() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'

    const fetchAuth = useFetchAuth()

    const navigate = useNavigate()
    const [selected, setSelected] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(false)

    async function fetchNotifications() {
        setLoading(true)
        try {
            const rs = await fetchAuth(`${API_BASE}/api/notifications`)
            setNotifications(rs)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    async function Read(id) {
        try {
            await fetchAuth(`${API_BASE}/api/notifications/read/${id}`, {
                method: "PUT"
            })

            fetchNotifications()
        } catch (err) {
            console.log(err)
        }
    }

    async function ReadAll() {
        try {
            await fetchAuth(`${API_BASE}/api/notifications/readAll`, {
                method: 'PUT'
            })

            fetchNotifications()
        } catch (err) {
            console.log(err)
        }

        fetchNotifications()
    }

    async function deleteNotification(id) {
        try {
            await fetchAuth(`${API_BASE}/api/notifications/${id}`, {
                method: 'DELETE'
            })

        } catch (err) {
            console.log(err)
        }

        fetchNotifications()
    }

    useEffect(() => {
        fetchNotifications()
    }, [])


    return (
        <div className={s.screen}>
            <div className={s.top}>
                <span className={`${s.bi} bi-arrow-left-short`} onClick={() => navigate('/home')}></span>
                <div className={s.headding}>
                    <h1>Notifications</h1>
                </div>
                <span className={`bi-envelope-open ${s.icon}`} onClick={ReadAll}></span>
            </div>

            <div className={s.body}>
                <div className={s.container}>
                    {notifications.map(x => (
                        <div key={x._id} className={`${s.noti} ${!x.isRead ? s.unread : ''} ${selected.includes(x._id) ? s.open : ''}`} >
                            <p onClick={() => {
                                if (selected.includes(x._id)) {
                                    const update = selected.filter(i => i != x._id)
                                    setSelected(update)
                                } else {
                                    setSelected([...selected, x._id])
                                }

                                if (!x.isRead) {
                                    Read(x._id)
                                }
                            }}>
                                {x.message}
                            </p>
                            <span className={`bi-trash-fill ${s.bi}`} onClick={() => deleteNotification(x._id)}></span>
                        </div>
                    ))}


                    {notifications.length == 0 && !loading && <p className={s.no}>No notifications yet.</p>}
                    {loading && <p className={s.no}>Loading...</p>}
                </div>
            </div>
        </div>
    );
}

export default Notifications;
