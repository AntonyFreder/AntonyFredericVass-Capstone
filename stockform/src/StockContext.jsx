// src/context/StockContext.jsx
import React, { createContext, useState } from 'react';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);

    const addStock = (newStock) => {
        setStocks(prevStocks => [...prevStocks, newStock]);
    };

    return (
        <StockContext.Provider value={{ stocks, addStock }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStocks = () => {
    return React.useContext(StockContext);
};