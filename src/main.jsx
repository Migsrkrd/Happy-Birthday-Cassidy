import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SiteGate from './SiteGate.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteGate>
      <App />
    </SiteGate>
  </StrictMode>,
)
