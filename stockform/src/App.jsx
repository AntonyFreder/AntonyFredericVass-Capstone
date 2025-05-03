import React from 'react';
import { StockProvider } from './StockContext';
import StockForm from './StockForm';
import StockList from './StockList';
import './styles.css'; // Optionally, include your styles

function App() {
    return (
        <StockProvider>
            <div className="app-container">
                <h1>Finance Dashboard</h1>
                <StockForm /> {/* Component to add new stocks */}
                <StockList /> {/* Component to display the list of stocks */}
            </div>
        </StockProvider>
    );
}

export default App;