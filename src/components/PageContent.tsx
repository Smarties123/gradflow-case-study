import React from 'react';
import { Panel, PanelProps } from 'rsuite';
import TermsAndConditions from '@/components/LandingPage/TermsAndConditions';

interface PageContentProps extends PanelProps {
  showTermsAndConditions?: boolean;  // Controls whether to show the Terms and Conditions
}

const PageContent = (props: PageContentProps) => {
  const { showTermsAndConditions = true, ...panelProps } = props;
  
  return (
    <>
      {/* Render the main panel content */}
      <Panel className="page-content" {...panelProps} />
      
      {/* Conditionally render the Terms and Conditions based on the prop */}
      {showTermsAndConditions && <TermsAndConditions />}
    </>
  );
};

export default PageContent;
