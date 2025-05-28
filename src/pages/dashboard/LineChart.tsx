import React, { useMemo, useRef, useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import { BsGraphUp } from "react-icons/bs";
import './Styles/LineChart.less';

interface LineChartProps {
  columns: { title: string; cards: { date_applied: string }[] }[];
  title: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ columns = [], title }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [isLight, setIsLight] = useState(document.body.classList.contains('rs-theme-light'));

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsLight(document.body.classList.contains('rs-theme-light'));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const { lineChartData, columnTitles } = useMemo(() => {
    const dataMap: { [key: string]: any } = {};
    let latestDate: Date = new Date();

    const columnTitles = columns && Array.isArray(columns)
      ? columns.map(col => col.title)
      : [];

    // Calculate the last 6 months from the latest date
    const lastSixMonths = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
      return date;
    }).reverse();

    const months = lastSixMonths.map((date) =>
      date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );

    // Initialize the dataMap with last 6 months and columns as 0
    months.forEach((month) => {
      dataMap[month] = { name: month };
      columnTitles.forEach((title) => {
        dataMap[month][title] = 0;
      });
    });

    // Count activities by month
    if (Array.isArray(columns)) {
      columns.forEach((column) => {
        if (column.cards && Array.isArray(column.cards)) {
          column.cards.forEach((card) => {
            if (card.date_applied) {
              const cardDate = new Date(card.date_applied);
              const cardMonth = cardDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

              if (dataMap[cardMonth]) {
                dataMap[cardMonth][column.title] += 1;
              }
            }
          });
        }
      });
    }

    return {
      lineChartData: Object.values(dataMap),
      columnTitles
    };
  }, [columns]);

  const colors = [
    '#FF6200', // Primary orange
    '#FF8533', // Light orange
    '#FFA366', // Lighter orange
    '#FFC299', // Very light orange
    '#FFE0CC', // Lightest orange
    '#FF4500'  // Dark orange
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    const series = columnTitles.map(title => ({
      name: title,
      data: lineChartData.map(item => item[title])
    }));

    // Calculate max value for y-axis
    const maxValue = Math.max(
      ...lineChartData.map(item =>
        Math.max(...columnTitles.map(title => item[title]))
      )
    );
    const suggestedMax = Math.ceil(maxValue + 2);

    const options = {
      series: series,
      chart: {
        height: 400,
        type: 'line',
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
        },
        background: 'transparent'
      },
      stroke: {
        width: 3,
        curve: 'smooth',
        lineCap: 'round'
      },
      markers: {
        size: 6,
        strokeWidth: 0,
        hover: {
          size: 8
        }
      },
      xaxis: {
        categories: lineChartData.map(item => item.name),
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
        min: 0,
        max: suggestedMax,
        forceNiceScale: true,
        tickAmount: 5,
        title: {
          text: 'Number of Activities',
          style: {
            color: isLight ? '#000000' : '#ffffff',
            fontSize: '12px',
            fontWeight: 500
          }
        },
        labels: {
          style: {
            colors: isLight ? '#000000' : '#ffffff',
            fontSize: '12px',
            fontWeight: 500
          },
          formatter: function (val: number) {
            return Math.floor(val);
          }
        }
      },
      grid: {
        borderColor: isLight ? '#e0e0e0' : '#333333',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
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
      legend: {
        position: 'right',
        horizontalAlign: 'left',
        offsetY: 0,
        labels: {
          colors: isLight ? '#000000' : '#ffffff'
        },
        markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          radius: 12,
          offsetX: 0,
          offsetY: 0
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5
        }
      },
      colors: colors,
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.8,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      }
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [lineChartData, columnTitles, isLight]);

  return (
    <div className="line-chart-container" style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        alignSelf: 'flex-start',
      }}>
        <BsGraphUp style={{ color: '#F26203', fontSize: '22px' }} />
        <h4 className="line-chart-title" style={{
          fontWeight: 600,
          fontSize: '19px',
          color: isLight ? '#000000' : '#ffffff'
        }}>{title}</h4>
      </div>

      <div ref={chartRef} style={{ padding: '0 10px' }} />
    </div>
  );
};

export default LineChartComponent;
