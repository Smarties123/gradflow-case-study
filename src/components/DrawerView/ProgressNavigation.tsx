import React from 'react';
import { Divider } from 'rsuite';
import CircularProgress from '@mui/material/CircularProgress';

interface ProgressNavigationProps {
  currentView: 'details' | 'documents' | 'notes';
  setCurrentView: (view: 'details' | 'documents' | 'notes') => void;
  detailsProgress: number;
  documentsProgress: number;
  notesProgress: number;
}

const ProgressNavigation: React.FC<ProgressNavigationProps> = ({
  currentView,
  setCurrentView,
  detailsProgress,
  documentsProgress,
  notesProgress
}) => {
  // Helper to get progress ring color
  const getCircularProgressColor = (percentage: number) => {
    if (percentage === 100) {
      return '#28a745'; // green
    } else if (percentage >= 50) {
      return '#ffc107'; // yellow
    }
    return '#dc3545'; // red
  };

  const renderNavLink = (label: string, targetView: 'details' | 'documents' | 'notes', progress: number) => {
    return (
      <a
        onClick={() => setCurrentView(targetView)}
        className={currentView === targetView ? 'active' : ''}
      >
        {label}
        <div className="progress-ring">
          <CircularProgress
            variant="determinate"
            value={progress}
            size={40}
            thickness={4}
            style={{
              color: getCircularProgressColor(progress)
            }}
          />
          <span className="progress-percentage">{progress}%</span>
        </div>
      </a>
    );
  };

  return (
    <div id="ddn">
      {renderNavLink('Details', 'details', detailsProgress)}
      <Divider vertical />
      {renderNavLink('Documents', 'documents', documentsProgress)}
      <Divider vertical />
      {renderNavLink('Notes', 'notes', notesProgress)}
    </div>
  );
};

export default ProgressNavigation;
