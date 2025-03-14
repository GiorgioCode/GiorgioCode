import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { I18nextProvider } from 'react-i18next'
import App from './App.jsx'
import theme from './theme'
import i18n from './i18n'
import './index.css'

const root = document.getElementById('root')
if (!root) {
  console.error('Root element not found!')
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </I18nextProvider>
    </React.StrictMode>
  )
}
