import React, { useContext, useMemo, useState } from 'react';
import { Row, Col, Panel, DateRangePicker } from 'rsuite';
import './styles.less';
import useData from "../../data/useData";

/* Chart Imports */
import FunnelChart from './FunnelChart';
import BarChart from './BarChart';
import LineChartComponent from './LineChart';
import HighlightTiles from './HighlightTiles';
import { BoardContext } from '../board/BoardContext'; // Adjust the path as needed
import DonutChartComponent from './DonutChartComponent';


const Dashboard: React.FC = () => {
  // src\pages\board\BoardContext.tsx
  const { columns } = useContext(BoardContext);
  const [dropdownType, setDropdownTypes] = useState<string[]>([]);


  if (!columns || columns.length === 0) {
    return <div>Loading...</div>;
  }


  const funnelData1 = [
    { name: 'Jobs Saved', value: 14, percent: 100, color: '#FF6200' },
    { name: 'Applications', value: 12, percent: 85, color: '#FF7433' },
    { name: 'Interviews', value: 8, percent: 66, color: '#FF8666' },
    { name: 'Offers', value: 3, percent: 37, color: '#FF987F' },
  ];


  const maxCards = Math.max(...columns.map(column => column.cards.length), 0); // Ensuring 0 as a fallback

  const donutData = columns.map((column, index) => ({
    name: column.title,
    value: column.cards.length,
    percent: Math.round((column.cards.length / maxCards) * 100),
    color: `hsl(24, 100%, ${50 + (index * 10)}%)`,
  }));

  const funnelData = columns.map((column, index) => ({
    name: column.title,
    value: column.cards.length,
    percent: Math.round((column.cards.length / maxCards) * 100), // Calculate percentage based on the maximum
    color: `hsl(24, 100%, ${50 + (index * 10)}%)`, // Dynamic color generation based on index
  }));








  // const dailyData = useMemo(() => {
  // ), [columns]);

  // const monthandAppliedData = useMemo(() => {
  // ), [columns]);

  // const monthandInternalData = useMemo(() => {
  // ), [columns]);




  const lineChartData = [
    { name: 'March 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'April 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'May 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'June 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'July 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'August 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'September 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'October 2020', Apply: 0, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'November 2020', Apply: 2, 'Phone Interview': 1, 'Phone Call': 1, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
    { name: 'December 2020', Apply: 6, 'Phone Interview': 4, 'Phone Call': 2, 'On Site Interview': 3, 'Offer Received': 2, 'Received Offer': 1 },
    { name: 'January 2021', Apply: 12, 'Phone Interview': 10, 'Phone Call': 6, 'On Site Interview': 5, 'Offer Received': 4, 'Received Offer': 3 },
    { name: 'February 2021', Apply: 6, 'Phone Interview': 5, 'Phone Call': 3, 'On Site Interview': 2, 'Offer Received': 1, 'Received Offer': 0 },
    { name: 'March 2021', Apply: 1, 'Phone Interview': 0, 'Phone Call': 0, 'On Site Interview': 0, 'Offer Received': 0, 'Received Offer': 0 },
  ];

  // Construct the highlightData using the columns from BoardContext
  const highlightData = columns.map((column, index) => ({
    title: column.title,
    value: column.cards.length,
    color: `hsl(24, 100%, ${50 + (index * 10)}%)`, // Dynamic color generation based on index
    icon: <div>{column.title[0]}</div>,
  }));



  return (
    <div className="scroll-container">
      <Row style={{marginRight:'10px'}}>
        <Col xs={24} id="border-line">
          <HighlightTiles data={highlightData} />
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <DateRangePicker
            appearance="default"
            placeholder="Select Date Range"
            style={{ margin: '10px 10px' }}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ margin: 0, display: 'flex'}}>
        <Col id="border-line" xs={24} md={12} style={{ padding: 0 }}>
          <Panel style={{ background: 'none', boxShadow: 'none', margin: '0px 0px' }}>
            <BarChart
              dropdownType={columns.map(column => column.title)}
              title="Jobs Created" />
          </Panel>
        </Col>
        
        <Col xs={24} md={12} style={{ padding: 0 }}>
          <Panel id="border-line" style={{ background: 'none', boxShadow: 'none', margin:'10px 0px 10px 10px'}}>
            <DonutChartComponent data={donutData} />
          </Panel>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <Panel style={{ background: 'none', boxShadow: 'none' }}>
            <LineChartComponent data={lineChartData} title="Application Activity" />
          </Panel>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
