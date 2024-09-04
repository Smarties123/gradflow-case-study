import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartComponentProps {
    data: { name: string; value: number; color: string }[];
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="90%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="70%"
                        outerRadius="90%"
                        fill="#8884d8"
                        paddingAngle={5}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ padding: 20 }}
                        formatter={(value, entry) => `${value} (${entry.payload.value})`}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChartComponent;
