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



const App = () => {
  return (
    <IntlProvider locale="en" messages={locales.en}>
      <Routes>
        {/* Landing and Auth Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Main App Layout Wrapped in Frame */}
        <Route path="/main" element={<Frame />}>
          <Route index element={<Page />} />
          <Route path="/main/dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch-all for 404 Errors */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </IntlProvider>
  );
};

export default App;