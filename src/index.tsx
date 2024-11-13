import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.less';
import { UserProvider } from './components/User/UserContext';
import { BoardProvider } from './pages/board/BoardContext';
import '../public/global.css';

// Import analytics to ensure it's initialized
import { analytics, logEvent } from '../firebaseConfig'; // Correct the path

const root = ReactDOM.createRoot(document.getElementById('root'));

// Example of logging a custom event when app loads
logEvent(analytics, 'app_rendered');

root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);
