import React, { createContext, useState } from 'react';

const StockContext = createContext();

const StockProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);

    const deleteStock = (symbol) => {
        setStocks(stocks.filter(stock => stock.symbol !== symbol));
    };

    return (
        <StockContext.Provider value={{ stocks, setStocks, deleteStock }}>
            {children}
        </StockContext.Provider>
    );
};

export { StockContext, StockProvider };


