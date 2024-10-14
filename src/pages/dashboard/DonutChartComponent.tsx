import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './Styles/DonutChartComponent.less';

interface DonutChartComponentProps {
  data: { name: string; value: number; color: string }[];
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({ data }) => {
  const series = data.map(item => item.value); // Values for the chart
  const labels = data.map(item => item.name); // Labels for each section
  const colors = data.map(item => item.color); // Colors for each section

  const options = {
    chart: {
      width: '100%',
      type: 'donut'
    },
    labels: labels,
    colors: colors,
    fill: {
      opacity: 1
    },
    stroke: {
      width: 1,
      colors: undefined
    },
    legend: {
      position: 'right',
      labels: {
        colors: '#333'
      }
    },
    tooltip: {
      y: {
        formatter: val => `${val}`
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom',
            labels: {
              colors: '#333'
            }
          }
        }
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="donut" width={380} />
      </div>
    </div>
  );
};

export default DonutChartComponent;
