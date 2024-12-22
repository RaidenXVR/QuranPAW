import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import { BrowserRouter } from 'react-router-dom'; // Pastikan ini ada di sini
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { AuthProvider } from './context/AuthContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
