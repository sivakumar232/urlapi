import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { UserProvider } from './context/UserContext';


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<UserProvider>
<App />
</UserProvider>
</BrowserRouter>
</React.StrictMode>
);