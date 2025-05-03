// src/components/StockItem.jsx
import React from 'react';

const StockItem = ({ stock }) => {
    const profitLoss = (stock.currentPrice - stock.price) * stock.quantity;

    return (
        <div className="stock-item">
            <h3>{stock.symbol}</h3>
            <p>Quantity: {stock.quantity}</p>
            <p>Purchase Price: ${stock.price.toFixed(2)}</p>
            <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
            <p style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
                Profit/Loss: ${profitLoss.toFixed(2)}
            </p>
        </div>
    );
};

export default StockItem;