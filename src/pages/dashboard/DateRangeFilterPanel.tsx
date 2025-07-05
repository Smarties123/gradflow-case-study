import React from 'react';
import { DateRangePicker, Button } from 'rsuite';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';
import './Styles/DateRangeFilterPanel.less';

export type DateRange = [Date, Date] | null;

interface DateRangeFilterPanelProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
}

const DateRangeFilterPanel: React.FC<DateRangeFilterPanelProps> = ({ value, onChange }) => {
  const formatted = value
    ? `${value[0].toLocaleDateString()} — ${value[1].toLocaleDateString()}`
    : '';

  return (
    <div className="date-range-filter-panel">
      <div className="date-range-filter-panel-text">
        <AiOutlineCalendar className="calendar-icon" />
        <div>
          <p className="title">Filter By Date Range</p>
          <small className="subtitle">
            {formatted || 'Select a custom date range to analyze your data'}
          </small>
        </div>
      </div>
      <div className="picker-actions">
        <DateRangePicker
          appearance="default"
          placeholder="YYYY-MM-DD — YYYY-MM-DD"
          format="yyyy-MM-dd"
          oneTap
          style={{ minWidth: 220 }}
          value={value || undefined}
          onChange={onChange}
          placement="bottomStart"

        />
        {value && (
          <Button
            appearance="subtle"
            onClick={() => onChange(null)}
            className="clear-button"
            size="sm"
          >
            <MdClear />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilterPanel;
