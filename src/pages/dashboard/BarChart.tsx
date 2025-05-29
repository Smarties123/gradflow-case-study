import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useData } from '../../data/useData';
import './Styles/BarChart.less';
import BarChartIcon from '@mui/icons-material/BarChart';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  dateRange: [Date, Date] | null;
  filteredColumns: any[];
  isLight: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ title, dateRange, filteredColumns, isLight }) => {
  const [timeFrame, setTimeFrame] = useState('Select Period');
  const [stage, setStage] = useState('Select Type');


  const data = useData({ columns: filteredColumns, timeFrame, stage, dateRange });

  const rawValues = data.map(item => item.value);
  const maxYValue = Math.max(...rawValues, 0);
  const suggestedMax = Math.ceil(maxYValue + 1);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: stage === 'Select Type' ? 'Count' : stage,
        data: data.map(item => item.value),
        backgroundColor: 'rgba(255, 98, 0, 0.8)',
        borderColor: 'rgba(255, 98, 0, 1)',
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${new Intl.NumberFormat().format(context.raw)}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: suggestedMax,
        ticks: {
          stepSize: 3,
          callback: function (value: any) {
            return Math.floor(value);
          },
          color: isLight ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
          font: {
            size: 12,
          },
        },
        grid: {
          // color: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        border: {
          // color: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isLight ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
          font: {
            fontWeight: 900,
            size: 12,

          },
        },
        grid: {
          color: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
        border: {
          color: isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bar-chart-container" style={{ position: 'relative' }}>
      {/* Header row: title left, dropdowns right */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Title on the left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChartIcon style={{ color: '#F26203', fontSize: '22px' }} />
          <h4 className="bar-chart-title" style={{ fontWeight: 600, fontSize: '19px' }}>{title}</h4>
        </div>

        {/* Dropdowns on the right */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            id="dropdownSelect"
            value={timeFrame}
            aria-label="Select Period"
            onChange={(e) => setTimeFrame(e.target.value)}
          >
            <option value="Select Period">Select Period</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <select
            id="dropdownSelect"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="Select Type">Select Type</option>
            {filteredColumns.map((column, index) => (
              <option key={index} value={column.title}>
                {column.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bar-chart-scroll-container">
        <div className="bar-chart-inner" style={{ height: '340px' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );

};

export default BarChart;
