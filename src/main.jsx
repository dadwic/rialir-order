import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import OrderForm from './components/Order/Form';
import AppProvider from './AppProvider';
import theme from './utils/theme';
import RTL from './RTL';

const rootElement = document.getElementById('order-app');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AppProvider>
      <RTL>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <OrderForm />
          </ThemeProvider>
        </StyledEngineProvider>
      </RTL>
    </AppProvider>
  </React.StrictMode>
);
