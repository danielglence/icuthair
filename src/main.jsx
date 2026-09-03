import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OwnerApp from './owner/OwnerApp';
import './styles.css';
import './owner/owner.css';

const isOwnerRoute = window.location.pathname.startsWith('/owner');
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isOwnerRoute ? <OwnerApp /> : <App />}</React.StrictMode>
);
