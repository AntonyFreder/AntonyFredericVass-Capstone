// StockPurchaseForm.jsx
import React, { useState } from 'react';
import './StockPurchaseForm.css'; // Import the CSS for the form

const PurchaseForm = () => {
    const [stockSymbol, setStockSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent the default form submission behavior
        console.log(`Stock Symbol: ${stockSymbol}, Quantity: ${quantity}, Purchase Price: ${purchasePrice}`);
        // Here you would typically handle adding the stock to your state or context
    };

    return (
        <div className="stock-purchase-form">
            <h2>Stock Purchase</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <div className="input-field">
                        <label htmlFor="stockSymbol">Stock Symbol:</label>
                        <input
                            type="text"
                            id="stockSymbol"
                            value={stockSymbol}
                            onChange={(e) => setStockSymbol(e.target.value)}
                            placeholder="e.g., AAPL"
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Number of shares"
                            required
                        />
                    </div>
                    <div className="input-field">
                        <label htmlFor="purchasePrice">Purchase Price:</label>
                        <input
                            type="number"
                            id="purchasePrice"
                            value={purchasePrice}
                            onChange={(e) => setPurchasePrice(e.target.value)}
                            placeholder="Price per share"
                            required
                        />
                    </div>
                </div>
                <button type="submit">Add Stock</button>
            </form>
        </div>
    );
};

export default PurchaseForm; 