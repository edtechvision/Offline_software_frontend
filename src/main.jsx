import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Buffer } from 'buffer'

// Make Buffer available globally
window.Buffer = Buffer

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0f172a' },
    secondary: { main: '#3b82f6' }
  },
  shape: { borderRadius: 10 }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
