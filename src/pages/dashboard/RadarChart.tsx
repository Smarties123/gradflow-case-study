import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartComponentProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(document.body.classList.contains('rs-theme-dark'));

    // Use effect to listen for theme changes dynamically
    useEffect(() => {
        const handleThemeChange = () => {
            setIsDarkTheme(document.body.classList.contains('rs-theme-dark'));
        };

        // Add event listener to detect changes in classList
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.body, {
            attributes: true, // Observe attributes changes like classList
            attributeFilter: ['class'], // Focus on class attribute changes
        });

        // Cleanup the observer when the component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);

    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const labels = sortedData.map(item => item.name);
    const datasetValues = sortedData.map(item => item.value);
    const maxValue = Math.max(...datasetValues);

    const orange = 'rgb(255, 98, 0)';

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Job Applications',
                data: datasetValues,
                fill: true,
                borderColor: isDarkTheme ? orange : 'rgb(255, 99, 132)',
                pointBackgroundColor: isDarkTheme ? orange : 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        elements: {
            line: {
                borderWidth: 3,
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: isDarkTheme ? 'white' : 'black', // Customize the legend text color
                },
            },
        },
        scales: {
            r: {
                angleLines: {
                    display: true,
                },
                grid: {
                    color: isDarkTheme ? 'rgb(232, 232, 232)' : '#ececec',
                },
                pointLabels: {
                    color: isDarkTheme ? 'white' : 'black',
                },
                suggestedMin: 0,
                suggestedMax: maxValue + 5,
                ticks: {
                    stepSize: 2,
                    showLabelBackdrop: true,
                    color: isDarkTheme ? 'white' : 'black',
                    backdropColor: isDarkTheme ? 'black' : 'white'


                },
            },
        },
    };

    return (
        <div className="radar-chart" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            maxHeight: '400px',
            width: '100%',
            position: 'relative',

        }}>
            <Radar data={chartData} options={options} />
        </div>
    );
};

export default RadarChartComponent;
