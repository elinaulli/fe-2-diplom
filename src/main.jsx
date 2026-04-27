import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import BookingProvider from './context/BookingContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <BookingProvider>
        <App />
      </BookingProvider>
    </HashRouter>
  </React.StrictMode>
);