import React from 'react';
import './index.css'; // Import your CSS file
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Optional: for consistent baseline styles across browsers
import App from './App';
import theme from './theme'; // Adjust path as needed

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
       <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Optional: ensures consistent baseline styles */}
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
