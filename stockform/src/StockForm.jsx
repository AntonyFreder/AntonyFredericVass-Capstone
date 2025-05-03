import React, { useState, useEffect } from 'react';
import { useStocks } from './StockContext';

const StockForm = () => {
    const { addStock } = useStocks();
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [stockList, setStockList] = useState([]); // State to hold stock symbols
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch stock symbols from a public API
        const fetchStockSymbols = async () => {
            // This is a placeholder API link; make sure to replace it with the appropriate endpoint
            const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your own API key
            try {
                const response = await fetch(`https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`);
                const data = await response.json();
                
                // Map the stock symbols to an array
                setStockList(data.map(stock => ({ symbol: stock.symbol, name: stock.name })));
            } catch (error) {
                console.error('Error fetching stock symbols:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStockSymbols();
    }, []); // Fetch once when the component mounts

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate and add the stock with the selected symbol
        // Here, you would also include stock price fetching and validation to ensure the stock symbol is valid
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
            const data = await response.json();
            const currentPrice = parseFloat(data['Global Quote']['05. price']);

            if (currentPrice) {
                addStock({ symbol, quantity: Number(quantity), price: Number(price), currentPrice });
                // Reset the form fields
                setSymbol('');
                setQuantity('');
                setPrice('');
            } else {
                alert('Invalid stock symbol');
            }
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} required>
                <option value="">Select a stock symbol...</option> {/* Default option */}
                {loading ? (
                    <option disabled>Loading stocks...</option>
                ) : (
                    stockList.map(stock => (
                        <option key={stock.symbol} value={stock.symbol}>
                            {stock.symbol} - {stock.name}
                        </option>
                    ))
                )}
            </select>
            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Purchase Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
            />
            <button type="submit">Add Stock</button>
        </form>
    );
};

export default StockForm;