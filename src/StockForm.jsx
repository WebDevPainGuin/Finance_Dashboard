import React, { useState, useContext } from 'react';
import { StockContext } from './StockContext';

const StockForm = () => {
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const { stocks, setStocks } = useContext(StockContext);

    const addStock = async (event) => {
        event.preventDefault();

        const apiKey = '8EGZ3Z9BYUWC4U7X';
        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`);
            const data = await response.json();
            
            console.log(data);  // Log the API response for debugging

            if (data['Meta Data']) {
                const newStock = {
                    symbol,
                    quantity: parseInt(quantity),
                    price: parseFloat(price),
                    currentPrice: null,
                    profitLoss: null,
                };
                setStocks([...stocks, newStock]);
                setSymbol('');
                setQuantity('');
                setPrice('');
            } else {
                alert('Invalid stock symbol. Please check the stock symbol and try again.');
            }
        } catch (error) {
            alert('Error fetching stock data. Please try again.');
        }
    };

    return (
        <form className='stock-form' onSubmit={addStock}>
            <div>
                <label>Stock Symbol:</label>
                <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
            </div>
            <div>
                <label>Quantity:</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div>
                <label>Purchase Price:</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <button type="submit">Add Stock</button>
        </form>
    );
};

export default StockForm;
