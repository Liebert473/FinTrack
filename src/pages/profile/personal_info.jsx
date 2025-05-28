import s from '../../css/personal_info.module.css';
import { useNavigate } from 'react-router-dom';
import { useFetchAuth } from '../../components/fetchAuth';
import { useState, useEffect } from 'react';
import { useNotify } from '../../NotificationContext';

function Personal_Info() {
    const API_BASE = 'https://fintrack-api-easr.onrender.com'
    const navigate = useNavigate()
    const fetchAuth = useFetchAuth()
    const { notify } = useNotify()

    const [profile, setProfile] = useState('/src/assets/profile.jpg')
    const [oldProfile, setOldProfile] = useState('/src/assets/profile.jpg')
    const [name, setName] = useState('Loading...')
    const [email, setEmail] = useState('Loading...')
    const [username, setUsername] = useState('Loading...')
    const [file, setFile] = useState(null)

    async function fetchProfile() {
        try {
            const rs = await fetchAuth(`${API_BASE}/api/user/userProfile`)
            setProfile(rs.profileImage ? rs.profileImage : profile);
            setOldProfile(rs.profileImage ? rs.profileImage : profile)
            setName(rs.name);
            setEmail(rs.email)
            setUsername(rs.username)
        } catch (err) {
            console.error(err)
        }
    }

    const UploadFileHandle = (e) => {
        const file = e.target.files[0]
        setFile(file)
        setProfile(URL.createObjectURL(file))
    }

    async function MotifyProfile(e) {
        e.preventDefault();

        if (oldProfile != profile) {
            try {
                const formData = new FormData
                formData.append('profileImage', file)

                const rs = await fetchAuth(`${API_BASE}/api/user/uploadProfile`, {
                    method: "POST",
                    body: formData,
                    headers: {}
                });

                notify(rs.message, 'success')
            } catch (err) {
                console.error(err);
            }
        }

        try {
            const rs = await fetchAuth(`${API_BASE}/api/user/updateProfile`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, username })
            });

            notify(rs.message, 'success')
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <div className={s.screen}>
            <div className={s.top}>
                <span className={`${s.bi} bi-arrow-left-short`} onClick={() => navigate('/profile')}></span>
                <div className={s.headding}>
                    <h1>Personal information</h1>
                </div>
            </div>

            <div className={s.profile}>
                <img src={profile} alt="Profile" />
                <label className={`bi bi-pencil-square ${s.edit}`}>
                    <input
                        type="file"
                        name="profile-picture"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => UploadFileHandle(e)}
                    />
                </label>
            </div>

            <div className={s.body}>
                <form className={s['body-form']} onSubmit={MotifyProfile}>
                    <div className={s.input}>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} readOnly={name === 'Loading...'} required />
                    </div>

                    <div className={s.input}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={email === 'Loading...'} required />
                    </div>

                    <div className={s.input}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            readOnly={username === 'Loading...'}
                            required
                        />
                    </div>

                    <button type="submit" className={s.btn1}>Save</button>
                </form>
            </div>
        </div>
    );
}

export default Personal_Info;
