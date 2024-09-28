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
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ForgotPassword/ResetPassword';
import { UserProvider, useUser } from './components/User/UserContext';
import { BoardProvider } from './pages/board/BoardContext';
import TermsAndConditions from './components/LandingPage/TermsAndConditions'; // Import TermsAndConditions component
import ComingSoon from './components/ComingSoon/ComingSoon';
import FeedbackButton from './components/FeedbackButton/FeedbackButton';

const App = () => {
  const { user } = useUser(); // Extract user from the context

  return (
    <IntlProvider locale="en" messages={locales.en}>
      <Routes>
        {/* Landing and Auth Pages - No UserContext */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Terms and Conditions Page */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />{' '}
        {/* Add this route */}
        {/* Routes that require UserContext */}
        <Route
          path="/main"
          element={
            <UserProvider>
              <BoardProvider user={user}>
                <Frame />
              </BoardProvider>
              <FeedbackButton />
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
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
    </IntlProvider>
  );
};

export default App;
