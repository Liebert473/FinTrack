import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
    { name: "Thu", date: "2025-05-08", amount: 0 },
    { name: "Fri", date: "2025-05-09", amount: 0 },
    { name: "Sat", date: "2025-05-10", amount: 0 },
    { name: "Sun", date: "2025-05-11", amount: 0 },
    { name: "Mon", date: "2025-05-12", amount: 0 },
    { name: "Tue", date: "2025-05-13", amount: 0 },
    { name: "Wed", date: "2025-05-14", amount: 0 },
    { name: "Thu", date: "2025-05-15", amount: 0 }
];

const BarChartComponent = () => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                        dataKey="amount"
                        fill="#4CAF50"
                        radius={[10, 10, 0, 0]} // Rounded top corners
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
