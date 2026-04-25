import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (e) {
  document.getElementById('root').innerHTML =
    '<div style="padding:24px;font-family:monospace;color:#c00;background:#fff">' +
    '<b>CRASH:</b> ' + e.message +
    '<pre style="margin-top:12px;font-size:11px;white-space:pre-wrap">' + e.stack + '</pre></div>'
}
