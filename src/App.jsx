import React from 'react';
import { StockProvider } from './StockContext';
import StockForm from './StockForm';
import StockList from './StockList';
import './App.css';

const App = () => {
    return (
        <StockProvider>
            <div className="app">
                <h1 className='title'>
                    Stock 
                    <span className='last-word'> Dashboard</span>
                </h1>
                <StockForm />
                <StockList />
            </div>
        </StockProvider>
    );
};

export default App;
