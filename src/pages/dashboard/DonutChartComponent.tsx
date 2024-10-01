import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DonutChartComponentProps {
    data: { name: string; value: number; color: string }[];
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({ data }) => {

    const filteredData = data.filter(entry => entry.value > 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="90%" height={400}>
                <PieChart>
                    <Pie
                        data={filteredData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius="70%" // Adjust inner radius
                        outerRadius="90%" // Adjust outer radius to make it larger
                        fill="#8884d8"
                        paddingAngle={10} // Add padding between segments
                    // label // Enable labels outside of the pie
                    // labelLine={true} // Draw label lines
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        layout="vertical"
                        verticalAlign="top"
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
