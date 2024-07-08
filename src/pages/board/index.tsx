import React from 'react';
import Board from './Board';
import PageContent from '@/components/PageContent';
import boards from '@/data/boards'; // Assuming this is correctly typed
import { CardList } from './types'; // Ensure this is the correct path to your types

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
