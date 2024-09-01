import React from 'react';
import { Panel } from 'rsuite';
import Table from './Table';
// import Copyright from '@/components/Copyright';
import PageToolbar from '@/components/PageToolbar';

const Page = () => {
  return (
    <Panel>
      <PageToolbar />
      <Table />
      {/* <Copyright /> */}
    </Panel>
  );
};

export default Page;
