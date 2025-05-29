import { useNotify } from "../NotificationContext";
import s from "../css/notification.module.css"

export function Notification() {
    const { messages, remove } = useNotify()

    return (
        <div className={s.notifications}>
            {messages.map(({ id, text, type }) => (
                <div className={`${s.noti} ${type == "error" ? s.error : s.success}`} key={id}>
                    <p>{text}</p>
                    <span className={`${s.bi} bi-x`} onClick={() => remove(id)}></span>
                </div>
            ))}
        </div>
    )
}