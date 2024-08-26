import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/index.less';
import { BoardProvider } from './pages/board/BoardContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <BoardProvider>
      <App />
    </BoardProvider>

  </BrowserRouter>
);
