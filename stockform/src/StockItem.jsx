// src/components/StockItem.jsx
import React from 'react';

const StockItem = ({ stock }) => {
    const profitLoss = (stock.currentPrice - stock.purchasePrice) * stock.quantity;

    // Safeguard for profitLoss in case it's invalid
    const profitLossDisplay = isNaN(profitLoss) ? '0.00' : Math.abs(profitLoss).toFixed(2);
    const profitSign = profitLoss >= 0 ? '+' : '-';

    return (
        <div className="stock-item">
            <h3>{stock.symbol}</h3>
            <p>Quantity: {stock.quantity}</p>
            <p>Current Price: ${stock.currentPrice?.toFixed(2) ?? 'N/A'}</p>
            <p>Purchase Price: ${stock.purchasePrice?.toFixed(2) ?? 'N/A'}</p>
            <p style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>
                Profit/Loss: {profitSign}${profitLossDisplay}
            </p>
        </div>
    );
};

export default StockItem;