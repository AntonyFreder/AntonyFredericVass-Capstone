import React, { useState, useEffect } from 'react';
import { useStocks } from './StockContext';

const StockForm = () => {
  const { addStock } = useStocks();

  const API_KEY = 'd0bdjr9r01qo0h63hcbgd0bdjr9r01qo0h63hcc0';

  // State for symbol list and inputs
  const [symbols, setSymbols] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  // List of added stocks
  const [stockList, setStockList] = useState([]);

  // Loading & error states
  const [loadingSymbols, setLoadingSymbols] = useState(true);
  const [error, setError] = useState('');

  // Fetch symbols with cache
  useEffect(() => {
    const fetchSymbolsWithCache = async () => {
      const cacheKey = 'symbolCache';
      const cacheTTL = 24 * 60 * 60 * 1000; // 24 hours
      const cached = localStorage.getItem(cacheKey);
      let shouldFetch = true;

      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < cacheTTL) {
          setSymbols(data);
          setLoadingSymbols(false);
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        try {
          const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`);
          const data = await response.json();
          setSymbols(data);
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        } catch (err) {
          console.error('Error fetching symbols:', err);
        } finally {
          setLoadingSymbols(false);
        }
      }
    };
    fetchSymbolsWithCache();
  }, []);

  // Handle symbol change: fetch current price
  const handleSymbolChange = async (e) => {
    const selectedSymbol = e.target.value;
    setSymbol(selectedSymbol);
    if (selectedSymbol) {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${selectedSymbol}&token=${API_KEY}`);
        const data = await response.json();
        if (data && data.c !== undefined) {
          setCurrentPrice(data.c);
        } else {
          setError('Data not available for selected symbol');
          setCurrentPrice(null);
        }
      } catch {
        setError('Error fetching current price');
        setCurrentPrice(null);
      }
    } else {
      setCurrentPrice(null);
    }
  };

  // Handle adding stock to list
  const handleAddStock = () => {
    if (symbol && currentPrice !== null && quantity && purchasePrice) {
      const profitLoss = (currentPrice - parseFloat(purchasePrice)) * parseInt(quantity);
      setStockList(prev => [
        ...prev,
        {
          id: Date.now(),
          symbol,
          quantity: parseInt(quantity),
          purchasePrice: parseFloat(purchasePrice),
          currentPrice,
          profitLoss,
        },
      ]);
      // Reset inputs
      setSymbol('');
      setCurrentPrice(null);
      setQuantity('');
      setPurchasePrice('');
      setError('');
    } else {
      alert('Fill all fields and select a stock.');
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    setStockList((prev) => prev.filter(s => s.id !== id));
  };

  // Local state to display only when a stock is added
  const [firstRender, setFirstRender] = useState(false);
  return (
    <div className="page-background">
      <div className="form-box">
        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (symbol && currentPrice !== null && quantity && purchasePrice) {
              const profitLoss = (currentPrice - parseFloat(purchasePrice)) * parseInt(quantity);
              setStockList(prev => [
                ...prev,
                {
                  id: Date.now(),
                  symbol,
                  currentPrice,
                  quantity: parseInt(quantity),
                  purchasePrice: parseFloat(purchasePrice),
                  profitLoss,
                },
              ]);
              // reset inputs
              setSymbol('');
              setQuantity('');
              setPurchasePrice('');
              setCurrentPrice(null);
            } else {
              alert('Select symbol, enter quantity and purchase price.');
            }
          }}
          className="stock-form"
        >
          {/* Symbol dropdown */}
          <div className="form-group">
            <label htmlFor="symbol">Symbol:</label>
            {loadingSymbols ? (
              <p>Loading symbols...</p>
            ) : (
              <select
                id="symbol"
                className="form-control"
                value={symbol}
                onChange={(e) => handleSymbolChange(e)}
                required
              >
                <option value="">Select a stock</option>
                {symbols.map((s) => (
                  <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.description}</option>
                ))}
              </select>
            )}
          </div>

          {/* Show current price */}
          {currentPrice !== null && (
            <div className="current-price-box">
              <h3>{symbol}</h3>
              <p>Current Price: ${currentPrice.toFixed(2)}</p>
            </div>
          )}

          {/* Quantity input */}
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              id="quantity"
              className="form-control"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          {/* Purchase Price input */}
          <div className="form-group">
            <label htmlFor="purchasePrice">Purchase Price:</label>
            <input
              id="purchasePrice"
              className="form-control"
              type="number"
              min="0"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </div>

          {/* Add button */}
          <button
            type="submit"
            disabled={!currentPrice}
            className="submit-button"
          >
            Add Stock
          </button>
        </form>

        {/* Stocks list */}
        <div className="stock-list">
          {stockList.map((stock) => (
            <div key={stock.id} className="stock-item">
              <div className="stock-header">
                <h4>{stock.symbol}</h4>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(stock.id)}
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
      </div>
    </div>
  );
}; // closing the component function

export default StockForm;