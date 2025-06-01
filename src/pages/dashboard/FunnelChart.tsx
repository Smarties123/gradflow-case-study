import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import './Styles/FunnelChart.less';
import { LiaBullseyeSolid } from "react-icons/lia";

interface FunnelChartData {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface FunnelChartProps {
  title: string;
  data: FunnelChartData[];
  mode: 'light' | 'dark';
  maxHeight?: string;
  isLight: boolean;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data = [], title, mode, maxHeight, isLight }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Filter and sort data
    const filteredData = data.filter(entry => entry.value > 0);
    const sortedData = filteredData.sort((a, b) => b.value - a.value);

    // Calculate total for percentages
    const total = sortedData.reduce((sum, item) => sum + item.value, 0);

    // Prepare series and categories
    const seriesData = sortedData.map(entry => entry.value);
    const categories = sortedData.map(entry => entry.name);
    const percentages = sortedData.map(entry => ((entry.value / total) * 100).toFixed(1));

    const options = {
      series: [{
        name: "",
        data: seriesData,
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          isFunnel: true,
          barHeight: '80%',
          borderRadius: 4,
          distributed: true,
          dataLabels: {
            position: 'center'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opt: any) {
          const index = opt.dataPointIndex;
          return `${categories[index]}: ${val.toLocaleString()} (${percentages[index]}%)`;
        },
        style: {
          fontSize: '12px',
          fontWeight: 500,
          colors: [isLight ? '#000000' : '#ffffff']
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 1,
          left: 0,
          top: 0
        }
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: isLight ? '#000000' : '#ffffff',
            fontSize: '12px',
            fontWeight: 500
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: isLight ? '#000000' : '#ffffff',
            fontSize: '12px',
            fontWeight: 500
          }
        }
      },
      grid: {
        borderColor: isLight ? '#e0e0e0' : '#333333',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      tooltip: {
        theme: isLight ? 'light' : 'dark',
        y: {
          formatter: function (val: number) {
            return val.toLocaleString();
          }
        }
      },
      colors: ['#FF6200', '#FF8533', '#FFA366', '#FFC299', '#FFE0CC'],
      fill: {
        opacity: 0.9,
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.85,
          stops: [0, 100]
        }
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [data, isLight]);

  return (
    <div className="funnel-chart-container">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        alignSelf: 'flex-start',
      }}>
        <LiaBullseyeSolid style={{ color: '#F26203', fontSize: '22px' }} />
        <h4 className="funnel-chart-title" style={{
          fontWeight: 600,
          fontSize: '19px',
          color: isLight ? '#000000' : '#ffffff'
        }}>{title}</h4>
      </div>

      <div
        ref={chartRef}
        style={{
          height: '100%',
          maxHeight,
          position: 'relative',
          top: '-30px',
          padding: '0 10px'
        }}
      />
    </div>
  );
};

export default FunnelChart;
