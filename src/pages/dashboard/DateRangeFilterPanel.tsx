

import React from 'react';
import { Row, Col, Panel, DateRangePicker } from 'rsuite';
import './Styles/DateRangeFilterPanel.less';

type DateRange = [Date, Date] | null;

interface DateRangeFilterPanelProps {
    onChange: (value: DateRange) => void;
}

const DateRangeFilterPanel: React.FC<DateRangeFilterPanelProps> = ({ onChange }) => {
    return (
        <div className='date-range-filter-panel'>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Left side: vertical text */}
                <div className='date-range-filter-panel-text' style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ marginBottom: '4px' }}><strong>Filter By Date Range</strong></p>
                    <a>Select a custom date range to analyse your data</a>
                </div>

                {/* Right side: Date picker */}
                <DateRangePicker
                    appearance="default"
                    placeholder="Select Date Range"
                    style={{ margin: '0px' }}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default DateRangeFilterPanel;
