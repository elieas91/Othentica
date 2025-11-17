// Import React.Children polyfill FIRST to ensure compatibility with react-datepicker
import './utils/reactPatch.js';

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

// Apply the polyfill immediately after React is imported
if (React && !React.Children && typeof window !== 'undefined' && window.__ReactChildrenPolyfill) {
  React.Children = window.__ReactChildrenPolyfill;
  console.log('React.Children polyfill applied in main.jsx');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
