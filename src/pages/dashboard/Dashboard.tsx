import React, { useMemo, useState } from 'react';
import { Row, Col, Panel, DateRangePicker } from 'rsuite';
import './styles.less';

/* Chart Imports */
import FunnelChart from './FunnelChart';
import BarChart from './BarChart';
import LineChartComponent from './LineChart';
import HighlightTiles from './HighlightTiles';
import { useBoardData } from '../../hooks/useBoardData';
import DonutChartComponent from './DonutChartComponent';
import { useUser } from '../../components/User/UserContext';
import RadarChartComponent from './RadarChart';


const Dashboard: React.FC = () => {
  const { user } = useUser(); // Ensure you have the user from context or another source
  const { columns } = useBoardData(user); // Correct usage of useBoardData
  const [selectedDateRange, setSelectedDateRange] = useState<[Date, Date] | null>(null);

  // Ensure columns is always defined to avoid conditional hooks
  const hasColumns = columns && columns.length > 0;

  // Filter columns based on the selected date range
  const filteredColumns = useMemo(() => {

    if (!hasColumns) return [];

    if (!selectedDateRange) return columns.slice(0, 1000); // Limit to first 6 columns


    const [startDate, endDate] = selectedDateRange;
    return columns.map(column => ({
      ...column,
      cards: column.cards.filter(card => {
        const cardDate = new Date(card.date_applied);
        return cardDate >= startDate && cardDate <= endDate;
      })
    }));
  }, [columns, selectedDateRange, hasColumns]);

  const maxCards = hasColumns ? Math.max(...filteredColumns.map(column => column.cards.length), 0) : 0;

  const donutData = hasColumns ? filteredColumns.map((column, index) => ({
    name: column.title,
    value: column.cards.length,
    percent: Math.round((column.cards.length / maxCards) * 100),

    color: `hsl(24, 100%, ${30 + (index * 7)}%)`,
  })) : [];


  // Function to convert HSL to HEX
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    return `#${[f(0), f(8), f(4)]
      .map(x => Math.round(x * 255).toString(16).padStart(2, '0'))
      .join('')}`;
  };

  // Assuming this is part of a function or component
  const funnelData = hasColumns
    ? filteredColumns.map((column, index) => {
      const h = 24; // H value (Hue)
      const s = 100; // S value (Saturation)
      const l = 30 + index * 7; // Lightness
      const hexColor = hslToHex(h, s, l); // Convert HSL to HEX

      return {
        name: column.title,
        value: column.cards.length,
        percent: Math.round((column.cards.length / maxCards) * 100),
        color: hexColor, // Set the color in HEX format
      };
    })
    : [];



  const highlightData = hasColumns ? filteredColumns.map((column, index) => ({
    title: column.title,
    value: column.cards.length,
    // color: `hsl(24, 100%, ${50 + (index * 2)}%)`,
    icon: <div>{column.title[0]}</div>,
  })) : [];

  const keyForCharts = hasColumns ? JSON.stringify(filteredColumns.map(column => column.title + column.cards.length)) : '';

  if (!hasColumns) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scroll-container">
      <Row style={{ marginRight: '10px' }}>
        <Col xs={24}>
          <HighlightTiles data={highlightData} />
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <DateRangePicker
            appearance="default"
            placeholder="Select Date Range"
            style={{ margin: '10px 10px' }}
            onChange={(value: [Date, Date]) => setSelectedDateRange(value)}  // Update the selected date range
          />
        </Col>
      </Row>
      {/* Charts Section */}
      <Row gutter={16} style={{ margin: 0 }} align="stretch">  {/* Add align="stretch" */}
        <Col xs={24} md={12} >
          <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin: '10px 0px', height: '100%' }}>
            <BarChart
              key={keyForCharts}  // Re-trigger BarChart animation
              dropdownType={filteredColumns.map(column => column.title)}
              title="Jobs Created"
              dateRange={selectedDateRange}
              filteredColumns={filteredColumns} // Pass the selected date range
            />
          </Panel>
        </Col>
        <Col xs={24} md={12} >
          <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin: '10px 0px', minHeight: '475px' }}>
            <DonutChartComponent
              style={{ margin: 'auto 0px' }}
              key={keyForCharts}  // Re-trigger DonutChart animation
              data={donutData}
            />
          </Panel>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin: '10px 0px' }}>
            <LineChartComponent
              key={keyForCharts}  // Re-trigger LineChartComponent animation
              columns={filteredColumns}
              title="Application Activity"
              dateRange={selectedDateRange}  // Pass the selected date range
            />
          </Panel>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin: '10px 0px' }}>
            <FunnelChart
              key={keyForCharts}  // Re-trigger FunnelChart animation
              data={funnelData}
              title="Recruitment Funnel"
            // dateRange={selectedDateRange}  // Pass the selected date range
            />
          </Panel>
        </Col>
        <Col xs={24} md={12}>
          <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin: '10px 0px' }}>
            <RadarChartComponent
              key={keyForCharts}  // Re-trigger FunnelChart animation
              data={funnelData}
            // dateRange={selectedDateRange}  // Pass the selected date range
            />
          </Panel>
        </Col>
      </Row>
      <Row style={{ marginBottom: '20px' }}>
        <Col xs={24}>
          {/* <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin: '10px 0px' }}> */}
          {/* <SankeyDiagram title="Application Flow" /> */}
          {/* </Panel> */}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
