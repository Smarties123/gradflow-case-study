import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.less';
import { UserProvider } from './components/User/UserContext';
import { BoardProvider } from './pages/board/BoardContext';

// Import `auth` and `provider` from `firebaseConfig.ts`
import { auth, provider } from "../firebaseConfig"; // Make sure this path is correct

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <UserProvider>
      <App />
    </UserProvider>
  </BrowserRouter>
);

export { auth, provider };
