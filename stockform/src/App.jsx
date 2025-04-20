import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import StockPurchaseForm from './PurchaseForm';

function App() {
    return (
        <div className="dashboard">
            <h1>Finance Dashboard</h1>
            <StockPurchaseForm />
            {/* Add additional components like stock lists, summaries, etc. */}
        </div>
    );
}

export default App;