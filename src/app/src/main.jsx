import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/style.css' // atau index.css kamu

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
