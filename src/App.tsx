// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Timeline from './components/LandingPage/TimelinePage';
import ComingSoon from './components/ComingSoon/ComingSoon';
import UnderConstruction from './components/UnderConstruction/UnderConstruction';
import ComingSoonCalendar from './pages/calendar/ComingSoonCalendar';
import Files from './pages/files/Files';
import StripeCheckout from './components/StripeCheckout';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import logEvent to track user navigation
import { logEvent, analytics } from '../firebaseConfig';
import ResendVerification from './pages/resend-verification/resend-verification';
import VerifyUser from './pages/verify-user/verify-user';

export const notifyError = (message: string) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
  });
};

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
      {/* toast container in bottom-right */}
      <ToastContainer position="bottom-right" />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<UnderConstruction />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy-GDPR" element={<PrivacyPolicyGDPR />} />
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/verify" element={<VerifyUser />} />


        {/* Protected routes */}
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
              <Navigate to="/401" />
            )
          }
        >
          <Route index element={<Page />} />
          <Route path="table" element={<TableComponent />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="calendar" element={<ComingSoonCalendar />} />
          <Route path="files" element={<Files />} />
        </Route>

        {/* 401 & 404 */}
        <Route path="/401" element={<Error401 />} />
        <Route path="*" element={<Error404Page />} />

        {/* Stripe checkout */}
        <Route path="/checkout" element={<StripeCheckout />} />
      </Routes>
    </IntlProvider>
  );
};

export default App;
