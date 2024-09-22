import React from 'react';
import { Panel } from 'rsuite';
import Dashboard from './Dashboard';
// import Copyright from '@/components/Copyright';
import PageToolbar from '@/components/PageToolbar';

const Page = () => {
  return (
    <Panel>
      <PageToolbar />
      <Dashboard />
      {/* <Copyright /> */}
    </Panel>
  );
};

export default Page;
