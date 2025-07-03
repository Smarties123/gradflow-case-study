import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Panel, DateRangePicker } from 'rsuite';
import { motion, useInView } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './styles.less';
import '../../components/skelton.less';

/* Chart Imports */
import FunnelChart from './FunnelChart';
import BarChart from './BarChart';
import LineChartComponent from './LineChart';
import HighlightTiles from './HighlightTiles';
import { useBoardData } from '../../hooks/useBoardData';
import DonutChartComponent from './DonutChartComponent';
import { useUser } from '../../components/User/UserContext';
import RadarChartComponent from './RadarChart';


import { useRef } from 'react';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import DateRangeFilterPanel from './DateRangeFilterPanel';

export const AnimateInView: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const { columns, loading } = useBoardData(user);
  const [selectedDateRange, setSelectedDateRange] = useState<[Date, Date] | null>(null);
  const maxHeight = '500px'; // Set your desired max height here

  const hasColumns = columns && columns.length > 0;

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

  const filteredColumns = useMemo(() => {
    if (!hasColumns) return [];
    if (!selectedDateRange) return columns.slice(0, 1000);

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
    percent: maxCards ? Math.round((column.cards.length / maxCards) * 100) : 0,
    color: `hsl(24, 100%, ${30 + (index * 7)}%)`,
  })) : [];

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

  const funnelData = hasColumns
    ? filteredColumns.map((column, index) => {
      const h = 24;
      const s = 100;
      const l = 30 + index * 7;
      const hexColor = hslToHex(h, s, l);

      return {
        name: column.title,
        value: column.cards.length,
        percent: maxCards ? Math.round((column.cards.length / maxCards) * 100) : 0,
        color: hexColor,
      };
    })
    : [];

  const highlightData = hasColumns ? filteredColumns.map((column, index) => ({
    title: column.title,
    value: column.cards.length,
    icon: <div>{column.title[0]}</div>,
  })) : [];

  const keyForCharts = hasColumns ? JSON.stringify(filteredColumns.map(column => column.title + column.cards.length)) : '';

  // Remove the useEffect hook for loading state
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  if (loading) {
    return (
      // ... your loading skeletons ...
      <div className="scroll-container">
        {/* HighlightTiles skeleton */}
        <Row style={{ marginRight: '-5px', marginBottom: '5px' }}>
          <Col xs={24}>
            <Skeleton height={300} />
          </Col>
        </Row>

        {/* Date Range */}
        <Row>
          <Col xs={24}>
            <Skeleton height={40} width="10%" style={{ margin: '0px 10px 10px 0px' }} />
          </Col>
        </Row>

        {/* Bar chart and Donut Chart  */}
        <Row gutter={16} style={{ marginRight: '10px' }}>
          <Col xs={24} md={12}>
            <Skeleton height={500} style={{ margin: '10px 0' }} />
          </Col>
          <Col xs={24} md={12}>
            <Skeleton height={500} style={{ margin: '10px 0' }} />
          </Col>
        </Row>

        {/* Application Activity  */}
        <Row style={{ marginRight: '-5px' }}>
          <Col xs={24}>
            <Skeleton height={600} style={{ margin: '10px 0' }} />
          </Col>
        </Row>

        {/* Funnel and Radar */}
        <Row gutter={16} style={{ marginRight: '10px' }}>
          <Col xs={24} md={12}>
            <Skeleton height={300} style={{ margin: '10px 0' }} />
          </Col>
          <Col xs={24} md={12}>
            <Skeleton height={300} style={{ margin: '10px 0' }} />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="scroll-container">
      <Row style={{ marginRight: '0px' }}>
        <Col xs={24} style={{ paddingLeft: '0px' }}>
          <AnimateInView delay={0}>

            <HighlightTiles data={highlightData} isLight={isLight} />
          </AnimateInView>
        </Col>
      </Row>


      {/* <Row>
      <Col xs={24}>
        <AnimateInView delay={0.1}>
          <Panel style={{ background: 'none', margin: '10px 0px', height: '100%' }}>
            <DateRangeFilterPanel
              value={selectedDateRange}
              onChange={(value: DateRange) => setSelectedDateRange(value)}
            />
          </Panel>
        </AnimateInView>
      </Col>
    </Row> */}





      <Row gutter={16} style={{ margin: '0px -8px' }}>
        <Col xs={24} md={12}>
          <AnimateInView delay={0.1}>
            <Panel style={{ background: 'none', margin: '10px 0px', height: '100%' }}>
              <BarChart
                key={keyForCharts}
                dropdownType={filteredColumns.map(column => column.title)}
                title="Jobs Created"
                dateRange={selectedDateRange}
                filteredColumns={filteredColumns}
                isLight={isLight}
              />
            </Panel>
          </AnimateInView>
        </Col>
        <Col xs={24} md={12}>
          <AnimateInView delay={0.1}>
            <Panel style={{ background: 'none', margin: '10px 0px', height: '483px' }}>
              <DonutChartComponent
                style={{ margin: 'auto 0px' }}
                key={keyForCharts}
                data={donutData}
                isLight={isLight}
              />
            </Panel>
          </AnimateInView>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <AnimateInView delay={0.1}>
            <Panel style={{ background: 'none', margin: '10px 0px' }}>
              <LineChartComponent
                key={keyForCharts}
                columns={filteredColumns}
                title="Application Activity"
                dateRange={selectedDateRange}
                isLight={isLight}
              />
            </Panel>
          </AnimateInView>

        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <AnimateInView delay={0.1}>

            <Panel style={{ background: 'none', margin: '10px 0px', height: '100%', overflow: 'hidden' }}>
              <FunnelChart
                key={keyForCharts}
                data={funnelData}
                title="Recruitment Funnel"
                style={{ height: '100%', maxHeight }}
                isLight={isLight}
              />
            </Panel>
          </AnimateInView>

        </Col>
        <Col xs={24} md={12}>
          <AnimateInView delay={0.1}>

            <Panel style={{ background: 'none', margin: '10px 0px', height: '100%', overflow: 'hidden', maxHeight: 535 }}>
              <RadarChartComponent
                key={keyForCharts}
                data={funnelData}
                title="Performance Radar"
                style={{ height: '100%' }}
                isLight={isLight}
              />
            </Panel>
          </AnimateInView>

        </Col>
      </Row>
    </div >
  );
};

export default Dashboard;
