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
          const res = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${API_KEY}`);
          const data = await res.json();
          const top50 = data.slice(0, 50); // Keep only top 50
          setSymbols(top50);
          localStorage.setItem(cacheKey, JSON.stringify({ data: top50, timestamp: Date.now() }));
        } catch(err) {
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
    const current = parseFloat(currentPrice);
    const purchase = parseFloat(purchasePrice);
    const qty = parseInt(quantity);
  
    if (
      symbol &&
      !isNaN(current) &&
      !isNaN(purchase) &&
      !isNaN(qty)
    ) {
      const profitLoss = (current - purchase) * qty;
      addStock({
        id: Date.now(),
        symbol,
        currentPrice: current,
        quantity: qty,
        purchasePrice: purchase,
        profitLoss,
      });
      // Reset form
      setSymbol('');
      setCurrentPrice(null);
      setQuantity('');
      setPurchasePrice('');
    } else {
      alert('Please select a stock and ensure all values are valid numbers.');
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              symbol &&
              currentPrice !== null &&
              quantity &&
              purchasePrice
            ) {
              const profitLoss =
                (currentPrice - parseFloat(purchasePrice)) * parseInt(quantity);
              addStock({
                id: Date.now(),
                symbol,
                currentPrice,
                quantity: parseInt(quantity),
                purchasePrice: parseFloat(purchasePrice),
                profitLoss,
              });
              setSymbol('');
              setCurrentPrice(null);
              setQuantity('');
              setPurchasePrice('');
            } else {
              alert('Fill all fields and wait for current price.');
            }
          }}
          className="stock-form"
        >
          <div className="form-group">
            <label htmlFor="symbol">Symbol:</label>
            {loadingSymbols ? (
              <p>Loading symbols...</p>
            ) : (
              <select
                id="symbol"
                className="form-control"
                value={symbol}
                onChange={handleSymbolChange}
                required
              >
                <option value="">Select a stock</option>
                {symbols.map((s) => (
                  <option key={s.symbol} value={s.symbol}>{s.symbol} - {s.description}</option>
                ))}
              </select>
            )}
          </div>

          {currentPrice !== null && (
            <div className="current-price-box">
              <h3>{symbol}</h3>
              <p>Current Price: ${currentPrice.toFixed(2)}</p>
            </div>
          )}

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

          <button
            type="submit"
            disabled={!currentPrice}
            className="submit-button"
          >
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockForm;