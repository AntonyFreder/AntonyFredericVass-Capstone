// src/context/StockContext.jsx
import React, { createContext, useContext, useState } from 'react';

const StockContext = createContext();

export const useStocks = () => useContext(StockContext);

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);

  const addStock = (stock) => setStocks(prev => [...prev, stock]);
  const deleteStock = (id) => setStocks(prev => prev.filter(s => s.id !== id));

  return (
    <StockContext.Provider value={{ stocks, addStock, deleteStock }}>
      {children}
    </StockContext.Provider>
  );
};