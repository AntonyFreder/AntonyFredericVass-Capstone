import React from 'react';
import './styles.css';
import { StockProvider } from './StockContext';
import StockForm from './StockForm';
import StockList from './StockList';



function App() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', // stack vertically
          justifyContent: 'center', // vertical centering
          alignItems: 'center',     // horizontal centering
          minHeight: '100vh',       // full viewport height
          width: '100%',            // full width
          backgroundColor: '#f0f4f8'
        }}
      >
        <h1 style={{ marginBottom: '20px' }}>My Stock Dashboard</h1>
        <StockForm />
        <StockList />
      </div>
    );
  }
  
  export default App;