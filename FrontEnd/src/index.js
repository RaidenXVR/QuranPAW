import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import { BrowserRouter } from 'react-router-dom'; // Pastikan ini ada di sini
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);