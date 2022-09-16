import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserContextProvider } from './context/UserContext';
import { PerfContextProvider } from './context/PerfContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserContextProvider>
      <PerfContextProvider>
        <App />
      </PerfContextProvider>
    </UserContextProvider>
);
