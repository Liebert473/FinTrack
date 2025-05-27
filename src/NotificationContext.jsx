import { createContext, useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"

const NotifitcationContext = createContext()

export function NotificationProvider({ children }) {
    const [messages, setMessage] = useState([])

    const notify = (text, type = 'error', duration = 5000) => {
        const id = uuidv4()
        const message = { id, text, type }
        setMessage(prev => [...prev, message])

        if (duration > 0) {
            setTimeout(() => remove(id), duration)
        }
    }

    const remove = (id) => {
        setMessage(prev => prev.filter(x => x.id != id))
    }

    return (
        <NotifitcationContext.Provider value={{ messages, notify, remove }}>
            {children}
        </NotifitcationContext.Provider>
    )
}

export function useNotify() {
    return useContext(NotifitcationContext)
}