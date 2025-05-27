import s from '../../css/profile.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function Profile() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    return (
        <div className={s.screen}>
            <div className={s.cover}></div>

            <div className={s.top}>
                <span onClick={() => navigate('/home')} className={`${s.bi} bi bi-arrow-left-short`}></span>
            </div>

            <div className={s.profile}>
                <img src="/src/assets/profile.jpg" alt="Profile" />
                <p>Liebert</p>
            </div>

            <div className={s.body}>
                <div className={s.option} onClick={() => navigate('/profile/personal_information')}>
                    <div>
                        <i className={`${s.bi} bi bi-info-circle`}></i>
                        <p>Personal information</p>
                    </div>
                    <i className={`${s.bi} bi bi-chevron-right`}></i>
                </div>

                <div className={s.option} onClick={() => navigate('/profile/settings')}>
                    <div>
                        <i className={`${s.bi} bi bi-gear`}></i>
                        <p>Settings</p>
                    </div>
                    <i className={`${s.bi} bi bi-chevron-right`}></i>
                </div>

                <div className={s.option} onClick={logout}>
                    <div>
                        <i className={`${s.bi} bi bi-box-arrow-left`}></i>
                        <p>Log out</p>
                    </div>
                    <i className={`${s.bi} bi bi-chevron-right`}></i>
                </div>
            </div>
        </div>
    );
}

export default Profile;