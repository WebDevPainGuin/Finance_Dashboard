import React, { useContext, useEffect, useCallback, useState } from 'react';
import { StockContext } from './StockContext';

var lastUpdate = Date.now();

const StockList = () => {
    const { stocks, setStocks, deleteStock } = useContext(StockContext);

    const fetchCurrentPrices = useCallback(async () => {

        if (Date.now() - lastUpdate < 1000)
            return;
        lastUpdate = Date.now();

        const apiKey = '8EGZ3Z9BYUWC4U7X';
        const updatedStocks = await Promise.all(stocks.map(async (stock) => {
            try {
                const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.symbol}&interval=5min&apikey=${apiKey}`);
                const data = await response.json();

                const timeSeries = data['Time Series (5min)'];
                if (timeSeries) {
                    const latestTimestamp = Object.keys(timeSeries)[0];
                    const latestPrice = parseFloat(timeSeries[latestTimestamp]['1. open']);

                    return {
                        ...stock,
                        currentPrice: latestPrice,
                        profitLoss: ((latestPrice - stock.price) * stock.quantity).toFixed(2),
                    };
                } else {
                    return stock;
                }
            } catch (error) {
                return stock;
            }
        }));

        setStocks(updatedStocks);
    }, [stocks, setStocks]);

    useEffect(() => {
        fetchCurrentPrices();
    }, [fetchCurrentPrices]);

    const getProfitLossClass = (profitLoss) => {
        if (profitLoss > 0) {
            return 'profit';
        } else if (profitLoss < 0) {
            return 'loss';
        } else {
            return '';
        }
    };

    return (
        <div>
            {stocks.length === 0 ? (
                <p>No stocks available.</p>
            ) : (
                <>
                    <table className='stock-table'>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Quantity</th>
                                <th>Purchase Price</th>
                                <th>Current Price</th>
                                <th>Profit/Loss</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock, index) => (
                                <tr key={index}>
                                    <td>{stock.symbol}</td>
                                    <td>{stock.quantity}</td>
                                    <td>{stock.price}</td>
                                    <td>{stock.currentPrice ? stock.currentPrice : 'Loading...'}</td>
                                    <td className={getProfitLossClass(stock.profitLoss)}>
                                        {stock.profitLoss ? stock.profitLoss : 'Calculating...'}
                                    </td>
                                    <td>
                                        <button onClick={() => deleteStock(stock.symbol)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ol className='stock-list'>
                        {stocks.map((stock, index) => (
                            <li key={index}>
                                <strong>Symbol:</strong> {stock.symbol}<br/>
                                <strong>Quantity:</strong> {stock.quantity}<br/>
                                <strong>Purchase Price:</strong> {stock.price}<br/>
                                <strong>Current Price:</strong> {stock.currentPrice ? stock.currentPrice : 'Loading...'}<br/>
                                <strong>Profit/Loss:</strong> 
                                <span className={getProfitLossClass(stock.profitLoss)}>
                                    {stock.profitLoss ? stock.profitLoss : 'Calculating...'}
                                </span><br/>
                                <button onClick={() => deleteStock(stock.symbol)}>Delete</button>
                            </li>
                        ))}
                    </ol>
                </>
            )}
        </div>
    );
};

export default StockList;
