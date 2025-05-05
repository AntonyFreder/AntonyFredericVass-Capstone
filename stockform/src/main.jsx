import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { StockProvider } from './StockContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StockProvider>
      <App />
    </StockProvider>
  </React.StrictMode>
);