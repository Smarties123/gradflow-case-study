import React from 'react';
import { Row, Col, Panel, DateRangePicker } from 'rsuite';
import './styles.less';

/* Chart Imports */
import FunnelChart from './FunnelChart';
import BarChart from './BarChart';
import LineChartComponent from './LineChart';
import HighlightTiles from './HighlightTiles';

const Dashboard: React.FC = () => {
  const funnelData1 = [
    { name: 'Jobs Saved', value: 14, percent: 100, color: '#FF6200' },
    { name: 'Applications', value: 12, percent: 85, color: '#FF7433' },
    { name: 'Interviews', value: 8, percent: 66, color: '#FF8666' },
    { name: 'Offers', value: 3, percent: 37, color: '#FF987F' },
  ];

  const barChartData = [
    { date: 'Jan 2 2023', value: 8 },
    { date: 'Jan 9 2023', value: 12 },
    { date: 'Jan 16 2023', value: 6 },
    { date: 'Jan 23 2023', value: 10 },
    { date: 'Jan 30 2023', value: 7 },
    { date: 'Feb 6 2023', value: 5 },
    { date: 'Feb 13 2023', value: 11 },
    { date: 'Feb 20 2023', value: 9 },
    { date: 'Feb 27 2023', value: 14 },
    { date: 'Mar 6 2023', value: 18 },
    { date: 'Mar 13 2023', value: 7 },
    { date: 'Mar 20 2023', value: 10 },
    { date: 'Mar 27 2023', value: 6 },
  ];

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

  const highlightData = [
    { title: 'Jobs Saved', value: 14, color: '#FF6200', icon: <div>PV</div> },
    { title: 'Applications', value: 12, color: '#FF7433', icon: <div>AP</div> },
    { title: 'Interviews', value: 8, color: '#FF8666', icon: <div>IV</div> },
    { title: 'Offers', value: 3, color: '#FF987F', icon: <div>OF</div> },
  ];

  return (
    <div className="scroll-container">
      <Row>
        <Col xs={24}>
          <DateRangePicker
            appearance="default"
            placeholder="Select Date Range"
            style={{ marginBottom: '20px', background: '#333', color: '#FFF', border: '1px solid #FFF' }}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <HighlightTiles data={highlightData} />
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={12}>
          <Panel style={{ background: 'none', boxShadow: 'none' }}>
            <FunnelChart data={funnelData1} title="Job Search Funnel" />
          </Panel>
        </Col>
        <Col xs={24} md={12}>
          <Panel style={{ background: 'none', boxShadow: 'none' }}>
            <BarChart data={barChartData} title="Jobs Created" />
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
