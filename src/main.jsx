import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import OrderForm from './components/Order/Form';
import AppProvider from './AppProvider';

const container = document.querySelector('#order-app');
const shadowContainer = container.attachShadow({ mode: 'open' });
const shadowRootElement = document.createElement('div');
shadowContainer.appendChild(shadowRootElement);

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  prepend: true,
  container: shadowContainer,
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
  components: {
    MuiPopover: {
      defaultProps: {
        container: shadowRootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: shadowRootElement,
      },
    },
    MuiModal: {
      defaultProps: {
        container: shadowRootElement,
      },
    },
  },
});

createRoot(shadowContainer).render(
  <React.StrictMode>
    <AppProvider>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <OrderForm />
        </ThemeProvider>
      </CacheProvider>
    </AppProvider>
  </React.StrictMode>
);
