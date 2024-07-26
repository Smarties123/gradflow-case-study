import React from 'react';
import Board from './Board';
import PageContent from '@/components/PageContent';

const Page: React.FC = () => {

  return (
    <PageContent
      className="board-wrapper"
      showCopyright={false} // Ensure this prop is correctly handled in PageContent
    >
      <Board />
    </PageContent>
  );
};

export default Page;
