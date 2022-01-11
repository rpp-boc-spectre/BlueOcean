import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({
  palette: {
    secondary: {
      main: '#ffd900',
      light: '#fffc72',
      dark: '#ccae00',
      contrastText: '#000'
    },
    primary: {
      main: '#648e37',
      light: '#7fa35c',
      dark: '#50722c',
      contrastText: '#fff'
    },
    success: {
      main: '#b2c79b',
      light: '#d1ddc3',
      dark: '#93b073',
      contrastText: '#fff'
    },
    info: {
      main: '#6b6e6b',
      light: '#b5b7b5',
      dark: '#080e09',
      contrastText: '#000'
    },
    grey: {
      50: '#e6e7e6',
      100: '#cecfce',
      200: '#b5b7b5',
      300: '#9c9f9d',
      400: '#848784',
      500: '#6b6e6b',
      600: '#525653',
      700: '#393e3a',
      800: '#212622',
      900: '#080e09'
    },
    background: {
      paper: '#fffc72',
      default: '#fffc72'
    }
  }
});

export default theme;