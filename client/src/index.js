import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './logic/scrollToTop';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006064',
    },
    secondary: {
      main: '#f50057',
    },
    mode: 'light'
  },

});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
      <ScrollToTop/>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

