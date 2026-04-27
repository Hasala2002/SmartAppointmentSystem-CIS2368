// Service worker version
const SW_VERSION = '1.0.0'

// Install event
self.addEventListener('install', (event) => {
  console.log(`[SW ${SW_VERSION}] Installing...`)
  // Skip waiting to activate immediately
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log(`[SW ${SW_VERSION}] Activating...`)
  // Claim all clients immediately
  event.waitUntil(self.clients.claim())
})

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)
  console.log('[SW] Has data:', !!event.data)

  let data = {
    title: 'Lone Star Dental',
    body: 'You have a new notification',
    url: '/'
  }

  if (event.data) {
    try {
      const rawText = event.data.text()
      console.log('[SW] Raw push data:', rawText)
      data = JSON.parse(rawText)
      console.log('[SW] Parsed data:', data)
    } catch (e) {
      console.error('[SW] Failed to parse push data:', e)
      data.body = event.data.text()
    }
  } else {
    console.log('[SW] No data in push event, using defaults')
  }

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      timestamp: data.timestamp
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    tag: data.type || 'default', // Prevents duplicate notifications
    renotify: true
  }

  console.log('[SW] Showing notification with title:', data.title)
  console.log('[SW] Notification options:', options)

  event.waitUntil(
    self.registration.showNotification(data.title, options)
      .then(() => {
        console.log('[SW] ✓ Notification shown successfully')
      })
      .catch((error) => {
        console.error('[SW] ✗ Failed to show notification:', error)
      })
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)

  event.notification.close()

  if (event.action === 'close') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen)
            return client.focus()
          }
        }
        // Open new window if not
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed')
})
