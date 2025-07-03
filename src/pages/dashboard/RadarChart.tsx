import React, { useRef } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import './Styles/RadarChart.less';
import { AiOutlineRadarChart } from "react-icons/ai";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface RadarChartComponentProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    isLight: boolean;
    title: string;
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data, isLight, title }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);

    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const labels = sortedData.map(item => item.name);
    const datasetValues = sortedData.map(item => item.value);
    const maxValue = Math.max(...datasetValues);
    const suggestedMax = Math.ceil(maxValue + 2);

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Job Applications',
                data: datasetValues,
                backgroundColor: 'rgba(255, 98, 0, 0.2)',
                borderColor: '#FF6200',
                borderWidth: 2,
                pointBackgroundColor: '#FF6200',
                pointBorderColor: '#FF6200',
                pointHoverBackgroundColor: '#FF6200',
                pointHoverBorderColor: '#FF6200',
                pointRadius: 3,
                pointHoverRadius: 4
            }
        ]
    };

    const options: ChartOptions<'radar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                type: 'radialLinear',
                beginAtZero: true,
                angleLines: {
                    display: true,
                    color: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    lineWidth: 1
                },
                grid: {
                    color: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    circular: true
                },
                pointLabels: {
                    color: isLight ? '#000000' : '#ffffff',
                    font: {
                        size: 12,
                        weight: 'normal'
                    }
                },
                ticks: {
                    color: isLight ? '#000000' : '#ffffff',
                    backdropColor: 'transparent',
                    font: {
                        size: 12,
                        weight: 'normal'
                    },
                    stepSize: Math.ceil(suggestedMax / 5),
                    suggestedMax: suggestedMax,
                    suggestedMin: 0
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                titleColor: isLight ? '#000000' : '#ffffff',
                bodyColor: isLight ? '#000000' : '#ffffff',
                borderColor: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return `${context.parsed.r.toLocaleString()} applications`;
                    }
                }
            }
        }
    };

    return (
        <div className="radar-chart-container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'flex-start', marginBottom: '20px',

            }}>
                <AiOutlineRadarChart style={{ color: '#F26203', fontSize: '22px' }} />
                <h4 className="radar-chart-title" style={{
                    fontWeight: 600,
                    fontSize: '19px',
                    color: isLight ? '#000000' : '#ffffff'
                }}>{title}</h4>
            </div>

            <div
                ref={chartRef} style={{
                    height: '100%',
                    width: '100%', position: 'relative', padding: '0 10px'

                }}>
                <Radar data={chartData} options={options} height={365} />
            </div>
        </div>
    );
};

export default RadarChartComponent;
