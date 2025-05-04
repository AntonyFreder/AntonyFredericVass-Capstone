// src/components/StockList.jsx
import React from 'react';
import { useStocks } from './StockContext';
import StockItem from './StockItem';

const StockList = () => {
    const { stocks } = useStocks(); // Get stocks from the Stock context

    if (stocks.length === 0) {
        return <p>No stocks available. Please add some stocks.</p>; // Message when there are no stocks
    }

    return (
        <div>
            <h2>Stock List</h2>
            {stocks.map(stock => (
                <StockItem key={stock.symbol} stock={stock} /> // Render each stock item
            ))}
        </div>
    );
};

export default StockList;