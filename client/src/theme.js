import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({
  palette: {
    // green
    primary: {
      main: '#79b4a9',
      light: '#94c3ba',
      dark: '#619087',
      contrastText: '#000'
    },
    // yellow
    secondary: {
      main: '#f5cb5c',
      light: '#F8DB8C',
      dark: '#AB8F41',
      contrastText: '#000'
    },
    grey: {
      50: '#e9e9e9',
      100: '#d3d3d3',
      200: '#bdbdbd',
      300: '#a7a7a7',
      400: '#919191',
      500: '#7b7b7b',
      600: '#656565',
      700: '#505050',
      800: '#3a3a3a',
      900: '#242424'
    },
    greyLight: {
      main: '#e9e9e9'
    },
    black: {
      main: '#242424'
    },
    background: {
      paper: '#FAE9B8',
      default: '#d3d3d3'
    },
    buttons: {
      signupBorder: '#b1871b',
      googleFB: '#76a0ef',
      googleFBhover: '#4881ea',
      googleFBborder: '#4881ea',
      submitHover: '#DAA520'
    },
  },
  typography: {
    fontFamily: 'Roboto',
  }
});

export default theme;