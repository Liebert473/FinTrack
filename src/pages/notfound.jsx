import s from '../css/notfound.module.css'
import BarChartComponent from './chart'
import { useState } from 'react'

function NotFound() {
    const [val, setVal] = useState("")
    return (
        <>
            <BarChartComponent />
        </>
    )
}

export default NotFound