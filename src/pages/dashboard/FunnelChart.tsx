import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import './Styles/FunnelChart.less';
interface FunnelChartData {
  name: string;
  value: number;
  percent: number;
  color: string;
}

interface FunnelChartProps {
  title: string;
  mode: 'light' | 'dark'; // Mode prop to handle light or dark mode
}


const FunnelChart: React.FC<FunnelChartProps> = ({ data = [], title, mode }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    // Filter and sort data (dummy data is already sorted)
    const filteredData = data.filter(entry => entry.value > 0);
    const sortedData = filteredData.sort((a, b) => b.value - a.value);


    // Prepare series and categories for ApexCharts
    const seriesData = sortedData.map(entry => entry.value);
    const categories = sortedData.map(entry => entry.name);

    const options = {
      series: [
        {
          name: "",
          data: seriesData,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }

      },
      plotOptions: {
        bar: {
          horizontal: true,
          isFunnel: true,
          barHeight: '80%',
          borderRadius: 0,
          // distributed: true,

        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
        },
        dropShadow: {
          enabled: true,
        },
      },

      xaxis: {
        categories: categories,

      },
      legend: {
        show: false,
      },
      tooltip: {
        style: {
          fontSize: '14px',
          color: '#000000', // Dynamic text color based on mode
        },
        // shared: true,
        // intersect: false,

      },
      colors: ['#ff6200']
    };

    // Render the chart
    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      // Clean up chart instance on component unmount
      return () => chart.destroy();
    }
  }, [title, mode]);

  return (
    <div>
      <h4>{title}</h4>
      <div ref={chartRef}></div>
    </div>
  );
};

export default FunnelChart;
