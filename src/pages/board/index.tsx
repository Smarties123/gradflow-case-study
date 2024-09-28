import React from 'react';
import Board from './Board';
import PageContent from '@/components/PageContent';

const Page: React.FC = () => {
  return (
    <PageContent
      className="board-wrapper"
      showTermsAndConditions={false}  // Use the correct prop to hide Terms and Conditions
    >
      <Board />
    </PageContent>
  );
};

export default Page;
