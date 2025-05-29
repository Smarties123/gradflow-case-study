import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './Styles/DonutChartComponent.less';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';

interface DonutChartComponentProps {
  data: { name: string; value: number; color: string }[];
  isLight: boolean;
}

const DonutChartComponent: React.FC<DonutChartComponentProps> = ({ data, isLight }) => {
  const series = data.map(item => item.value);
  const labels = data.map(item => item.name);
  const colors = data.map(item => item.color);
  const total = series.reduce((sum, val) => sum + val, 0);


  const options = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
    },
    labels,
    colors,
    stroke: { show: false },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: {
        color: isLight ? '#979FA9' : '#ffffff',
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
        offsetX: -2,
      },
      formatter: function (label: string, opts: any) {
        const val = series[opts.seriesIndex];
        return `${label}: ${val}`;
      },
    },
    tooltip: {
      y: {
        formatter: val => `${val} (${((val / total) * 100).toFixed(1)}%)`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            value: {
              fontSize: '18px',
              fontWeight: 600,
              color: isLight ? '#000000' : '#ffffff',
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              color: isLight ? '#979FA9' : '#ffffff',
              fontWeight: 600,
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  return (
    <div className="donut-chart-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Title with icon */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', alignSelf: 'flex-start',
      }}>
        <PieChartOutlineIcon style={{ color: '#F26203', fontSize: '22px' }} />
        <h4 className="donut-chart-title" style={{ fontWeight: 600, fontSize: '19px' }} >Application Status Distribution</h4>
      </div>

      {/* Tooltip Icon */}
      {/* <div style={{ position: 'absolute', top: '37px', left: '85%', zIndex: 10001 }}>
        <a data-tooltip-id="donut">
          <IconButton className="bar-icon-button">
            <InfoIcon />
          </IconButton>
        </a>
        <Tooltip id="donut" place="left">
          Percentage of applications across different job statuses.
        </Tooltip>
      </div> */}

      {/* Donut Chart */}
      <div id="chart">
        <ReactApexChart options={options} series={series} type="donut" width={420} />
      </div>
    </div>
  );
};

export default DonutChartComponent;
