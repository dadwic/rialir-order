import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import AppProvider from './AppProvider';
import Loading from './components/Loading';
import VazirmatnWoff2 from './fonts/Vazirmatn-Regular.woff2';

const OrderForm = React.lazy(() => import('./components/Order/Form'));

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
  typography: {
    fontFamily: 'Vazirmatn',
    htmlFontSize: 10,
  },
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
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Vazirmatn';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Vazirmatn'), local('Vazirmatn-Regular'), url(${VazirmatnWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
});

createRoot(shadowContainer).render(
  <React.StrictMode>
    <AppProvider>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <React.Suspense fallback={<Loading />}>
            <OrderForm />
          </React.Suspense>
        </ThemeProvider>
      </CacheProvider>
    </AppProvider>
  </React.StrictMode>
);
