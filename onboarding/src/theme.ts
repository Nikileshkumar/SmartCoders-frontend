import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Your primary color
    },
    secondary: {
      main: '#dc004e', // Your secondary color
    },
  },
  typography: {
    // You can customize fonts, sizes, etc.
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  // You can further customize spacing, breakpoints, component styles, etc.
});

export default theme;
