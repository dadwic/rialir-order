import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: ['Vazirmatn', 'Open Sans'].join(','),
  },
  palette: {
    primary: {
      main: '#CE0E2D',
    },
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        wrapperVertical: {
          display: 'flex',
        },
      },
    },
  },
});

export default theme;
