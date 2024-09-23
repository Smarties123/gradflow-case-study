import React from 'react';
import { Panel, PanelProps } from 'rsuite';
import TermsAndConditions from '@/components/LandingPage/TermsAndConditions';  // Make sure this path is correct

interface PageContentProps extends PanelProps {
  showTermsAndConditions?: boolean;  // Rename prop to make it clear we are using Terms and Conditions
}

const PageContent = (props: PageContentProps) => {
  const { showTermsAndConditions = true, ...panelProps } = props;
  
  return (
    <>
      {/* Render the main panel content */}
      <Panel className="page-content" {...panelProps} />
      
      {/* Conditionally render the Terms and Conditions */}
      {showTermsAndConditions && <TermsAndConditions />}
    </>
  );
};

export default PageContent;
