import React from 'react';
import Board from './Board';
import PageContent from '@/components/PageContent';
import boards, { CardList } from '@/data/boards';

const Page = () => {
  const board = boards[0];

  return (
    <PageContent
      className="board-wrapper"
      showCopyright={false}

    >
      <Board data={board?.data as CardList} />
    </PageContent>
  );
};

export default Page;
