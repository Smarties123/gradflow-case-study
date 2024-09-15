import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import locales from './locales';
import Frame from './components/Frame';
import Error404Page from './pages/authentication/404';
import Page from './pages/board';
import LandingPage from './components/LandingPage/LandingPage';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './pages/dashboard/Dashboard';
import TableComponent from './pages/table/Table';
import { UserProvider, useUser } from './components/User/UserContext'; // Import useUser
import { BoardProvider } from './pages/board/BoardContext'; // Import BoardProvider

const App = () => {
  const { user } = useUser(); // Extract user from the context

  return (
    <IntlProvider locale="en" messages={locales.en}>
      <Routes>
        {/* Landing and Auth Pages - No UserContext */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Routes that require UserContext */}
        <Route
          path="/main"
          element={
            <UserProvider>
              <BoardProvider user={user}>
                <Frame />
              </BoardProvider>
            </UserProvider>
          }
        >
          <Route index element={<Page />} />
          <Route path="/main/table" element={<TableComponent />} />
          <Route path="/main/dashboard" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch-all for 404 Errors */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </IntlProvider>
  );
};

export default App;
