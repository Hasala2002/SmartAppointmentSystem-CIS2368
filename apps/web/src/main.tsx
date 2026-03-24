import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Register service worker for PWA and push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Register the Vite PWA service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      console.log('[SW] Registered:', registration.scope)

      // Also register custom push handler
      await navigator.serviceWorker.register('/sw-push.js', {
        scope: '/'
      })
      console.log('[SW] Push handler registered')
    } catch (err) {
      console.error('[SW] Registration failed:', err)
    }
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
