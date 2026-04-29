import { useState, useEffect, useCallback, useRef } from 'react'
import { usePushNotifications } from './usePushNotifications'
import { apiClient } from '../api/client'

interface NotificationMessage {
  title: string
  body: string
  url?: string
  timestamp?: string
}

export const useHybridNotifications = (userId?: string) => {
  const push = usePushNotifications()
  const [useFallback, setUseFallback] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [inAppNotifications, setInAppNotifications] = useState<NotificationMessage[]>([])

  // Try push first, fallback to WebSocket if it fails
  const initNotifications = useCallback(async () => {
    if (!push.isSupported) {
      console.log('[Hybrid] Push not supported, using WebSocket fallback')
      setUseFallback(true)
      return
    }

    // Try to subscribe to push
    const success = await push.subscribe()
    
    if (!success) {
      console.log('[Hybrid] Push subscription failed, using WebSocket fallback')
      setUseFallback(true)
      setLastError(push.error)
    }
  }, [push])

  // WebSocket fallback for notifications
  useEffect(() => {
    if (!useFallback || !userId) return

    const connectWS = () => {
      const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const wsBaseUrl =
        import.meta.env.VITE_WS_URL ||
        `${wsScheme}://${window.location.hostname}:8001`
      const wsUrl = `${wsBaseUrl}/ws/notifications/${userId}`
      
      console.log('[Hybrid] Connecting to notification WebSocket:', wsUrl)
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('[Hybrid] Notification WebSocket connected')
      }

      ws.onmessage = (event) => {
        try {
          const notification: NotificationMessage = JSON.parse(event.data)
          console.log('[Hybrid] Received notification via WebSocket:', notification)
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.body,
              icon: '/icon-192x192.png',
              badge: '/badge-72x72.png'
            })
          }
          
          // Also store for in-app display
          setInAppNotifications(prev => [notification, ...prev].slice(0, 10))
        } catch (err) {
          console.error('[Hybrid] Error parsing notification:', err)
        }
      }

      ws.onerror = (error) => {
        console.error('[Hybrid] WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('[Hybrid] WebSocket disconnected, reconnecting in 5s...')
        setTimeout(connectWS, 5000)
      }
    }

    connectWS()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [useFallback, userId])

  const sendTest = useCallback(async () => {
    if (!useFallback) {
      return push.sendTest()
    }
    
    // For fallback, send via WebSocket
    try {
      await apiClient.post('/notifications/test', {
        title: 'Test Notification',
        body: 'Notifications are working via WebSocket!',
        url: '/dashboard'
      })
      alert('Test notification sent! Check your notifications.')
      return true
    } catch (err: any) {
      alert(`Error: ${err.response?.data?.detail || err.message}`)
      return false
    }
  }, [useFallback, push])

  const clearInAppNotifications = useCallback(() => {
    setInAppNotifications([])
  }, [])

  return {
    isReady: push.isSupported ? push.isSubscribed : useFallback,
    isLoading: push.isLoading,
    error: lastError || push.error,
    usingFallback: useFallback,
    initNotifications,
    sendTest,
    inAppNotifications,
    clearInAppNotifications,
    // Original push methods
    ...push
  }
}
