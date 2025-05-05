// src/components/StockList.jsx
import React from 'react';
import { useStocks } from './StockContext';

const StockList = () => {
  const { stocks, deleteStock } = useStocks();

  if (!stocks || stocks.length === 0) {
    return <p>No stocks available. Please add some.</p>;
  }

  return (
    <div className="stock-list">
      {stocks.map((stock) => (
        <div key={stock.id} className="stock-item">
          <div className="stock-header">
            <h4>{stock.symbol}</h4>
            <button
              className="delete-btn"
              onClick={() => deleteStock(stock.id)}
              title="Delete"
            >
              &times;
            </button>
          </div>
          <p>Quantity: {stock.quantity}</p>
          <p>Purchase Price: ${stock.purchasePrice.toFixed(2)}</p>
          <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>
          <p
            style={{
              color: stock.profitLoss >= 0 ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            {stock.profitLoss >= 0 ? '+' : '-'}
            ${Math.abs(stock.profitLoss).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StockList;