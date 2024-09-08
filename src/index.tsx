import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/index.less';
import { BoardProvider } from './pages/board/BoardContext';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-G_U_O0-HSEoYOfRymXd9pxIPaivI5NQ",
  authDomain: "gradflow2-a74cd.firebaseapp.com",
  projectId: "gradflow2-a74cd",
  storageBucket: "gradflow2-a74cd.appspot.com",
  messagingSenderId: "83557003613",
  appId: "1:83557003613:web:1d47e2fcf4633b102bb8b4",
  measurementId: "G-FSC58746EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <BoardProvider>
      <App />
    </BoardProvider>

  </BrowserRouter>
);
