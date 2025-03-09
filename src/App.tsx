import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Add useLocation for tracking routes
import { IntlProvider } from 'react-intl';
import locales from './locales';
import Frame from './components/Frame';
import Error404Page from './components/ErrorPage/Error404';
import Error401 from './components/ErrorPage/Error401'; 
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
import TermsAndConditions from './components/LandingPage/TermsAndConditions'; 
import PrivacyPolicyGDPR from './components/LandingPage/PrivacyPolicyGDPR';
import AboutUs from './components/LandingPage/AboutUs';
import ComingSoon from './components/ComingSoon/ComingSoon';
import ComingSoonCalendar from './pages/calendar/ComingSoonCalendar'; 
import Files from './pages/files/Files'; 

import FeedbackButton from './components/FeedbackButton/FeedbackButton';

// Import logEvent to track user navigation
import { logEvent, analytics } from '../firebaseConfig';

const App = () => {
  const { user } = useUser();
  const isAuthenticated = !!user;
  const location = useLocation();

  useEffect(() => {
    // Log event when a page is viewed
    logEvent(analytics, 'page_view', { page: location.pathname });
  }, [location]);

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
        <Route path="/AboutUs" element={<AboutUs />} />

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy-GDPR" element={<PrivacyPolicyGDPR />} />
        {/* Routes that require UserContext */}
        <Route
          path="/main"
          element={
            isAuthenticated ? (
              <UserProvider>
                <BoardProvider user={user}>
                  <Frame />
                </BoardProvider>
              </UserProvider>
            ) : (
              <Navigate to="/401" /> // Redirect to 401 if not authenticated
            )
          }
        >
          <Route index element={<Page />} />
          <Route path="/main/table" element={<TableComponent />} />
          <Route path="/main/dashboard" element={<Dashboard />} />
          <Route path="/main/calendar" element={<ComingSoonCalendar />} />
          <Route path="/main/files" element={<Files />} /> 
        </Route>

        {/* 401 Unauthorized Page */}
        <Route path="/401" element={<Error401 />} /> 

        {/* Catch-all for 404 Errors */}
        <Route path="*" element={<Error404Page />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
      </Routes>
    </IntlProvider>
  );
};

export default App;
