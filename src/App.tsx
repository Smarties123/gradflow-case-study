import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import locales from './locales';
import Frame from './components/Frame';
import Error404Page from './pages/authentication/404';
import MembersPage from './pages/members';
import CalendarPage from './pages/calendar';
import BoardsPage from './pages/board-list';
import BoardPage from './pages/board';
import CreateBoardPage from './pages/board-create';
import LandingPage from './components/LandingPage/LandingPage';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';


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
          <Route index element={<BoardsPage />} />
          <Route path="boards/new" element={<CreateBoardPage />} />
          <Route path="boards/:id" element={<BoardPage />} />
          <Route path="boards" element={<BoardsPage />} />
          <Route path="members" element={<MembersPage />} />
          <Route path="calendar" element={<CalendarPage />} />
        </Route>
        
        {/* Catch-all for 404 Errors */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </IntlProvider>
  );
};

export default App;