import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './Styles/DonutChartComponent.less';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from 'react-tooltip';


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
      height: '100%',
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
      position: 'bottom',
      labels: {
        colors: '#333',
        font: {
          size: 12
        }
      },
      formatter: (label: string, { seriesIndex }: { seriesIndex: number }) => {
        const value = data[seriesIndex].value; // Get the value for the current series

        // Show the label with "(0)" only if the value is 0
        return value === 0 ? `${label} (0%)` : label;
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
            },
            formatter: (label: string, { seriesIndex }: { seriesIndex: number }) => {
              const value = data[seriesIndex].value;

              return value === 0 ? `${label} (0%)` : label;
            }
          }
        }
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: '37px', left: '85%', zIndex: '10001' }}> {/* Ensure positioning context */}
        {/* Icon button with a data-tooltip-id */}
        <a data-tooltip-id="tooltip">
          <IconButton style={{ color: '#FFF' }}>
            <InfoIcon />
          </IconButton>
        </a>
        {/* Tooltip with id that matches data-tooltip-id */}
        <Tooltip id="tooltip" place="left" >
          Hover above the values to view your applications
        </Tooltip>
      </div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="donut" width={450} />
      </div>

    </div>
  );
};

export default DonutChartComponent;
