import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { StockProvider } from './StockContext.jsx' // ensure this path is correct

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StockProvider>
      <App />
    </StockProvider>
  </StrictMode>,
)