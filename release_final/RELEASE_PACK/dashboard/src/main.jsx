import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const GOOGLE_CLIENT_ID = '1036541899634-3toas1dve2qqusjt63oqm7m5cb63sd44.apps.googleusercontent.com'; // Use your Client ID here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> // Wrap App with GoogleOAuthProvider
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
