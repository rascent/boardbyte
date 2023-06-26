import ReactDOM from 'react-dom/client';
import App from './ui/views/App';

import './main.css';
import React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
