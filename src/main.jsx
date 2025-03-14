import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import theme from './theme'
import './i18n'
import './index.css'

const root = document.getElementById('root')
if (!root) {
  console.error('Root element not found!')
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </React.StrictMode>
  )
}
