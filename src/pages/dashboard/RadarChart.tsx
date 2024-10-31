import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip as ChartTooltip, // Aliasing Tooltip from chart.js
    Legend,
} from 'chart.js';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Aliasing Tooltip from react-tooltip

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, ChartTooltip, Legend);

interface RadarChartComponentProps {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({ data, maxHeight }) => {
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
            height: '450px',
            width: '100%',
            position: 'relative',
        }}>
            <div style={{ position: 'absolute', top: '0px', left: '90%', zIndex: 1001 }}> {/* Ensure positioning context */}
                {/* Icon button with a data-tooltip-id */}
                <a data-tooltip-id="radar" style={{ cursor: 'pointer' }}>
                    <IconButton style={{ color: '#FFF' }}>
                        <InfoIcon />
                    </IconButton>
                </a>
                {/* Tooltip with id that matches data-tooltip-id */}
                <ReactTooltip id="radar" place="top" effect="solid">
                    Radar view of job applications across various statuses
                </ReactTooltip>
            </div>
            <Radar data={chartData} options={options} />
        </div>
    );
};

export default RadarChartComponent;
