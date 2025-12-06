import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import HelloWorld from './components/HelloWorld';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelloWorld />
    </ThemeProvider>
  );
}

export default App;
