import React from 'react';
import { Row, Col, Panel } from 'rsuite';

/*Chart Imports */
import FunnelChart from './FunnelChart';
import BarChart from './BarChart';

const Dashboard: React.FC = () => {
  const funnelData1 = [
    { name: 'Jobs Saved', value: 14, percent: 100, color: '#FF6200' },
    { name: 'Applications', value: 12, percent: 85, color: '#FF7433' },
    { name: 'Interviews', value: 8, percent: 66, color: '#FF8666' },
    { name: 'Offers', value: 3, percent: 37, color: '#FF987F' },
  ];

  const funnelData2 = [
    { name: 'Stage 1', value: 20, percent: 100, color: '#FF6200' },
    { name: 'Stage 2', value: 15, percent: 75, color: '#FF7433' },
    { name: 'Stage 3', value: 10, percent: 50, color: '#FF8666' },
    { name: 'Stage 4', value: 5, percent: 25, color: '#FF987F' },
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

  return (
    <Row>
      <Col xs={24} md={12}>
        <Panel style={{ background: 'none', boxShadow: 'none' }}>
          <FunnelChart data={funnelData1} title="Job Search Funnel" />
        </Panel>
        </Col>
        <Col xs={24} md={12}>
        <Panel style={{ background: 'none', boxShadow: 'none' }}>
          <BarChart data={barChartData} title="Jobs Created" timeFrame="Weekly" />
        </Panel>
      </Col>
      {/* <Col xs={24} md={12}>
        <Panel style={{ background: 'none', boxShadow: 'none' }}>
          <FunnelChart data={funnelData2} title="Another Funnel" />
        </Panel>*/}
    </Row>
  );
};

export default Dashboard;
