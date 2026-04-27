import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/client'

interface PushSubscriptionState {
  isSupported: boolean
  isSubscribed: boolean
  isLoading: boolean
  permission: NotificationPermission
  error: string | null
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushSubscriptionState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    permission: 'default',
    error: null
  })

  // Check if push is supported
  useEffect(() => {
    const hasServiceWorker = 'serviceWorker' in navigator
    const hasPushManager = 'PushManager' in window
    const isSupported = hasServiceWorker && hasPushManager

    console.log('[Push] Support check:', { hasServiceWorker, hasPushManager, isSupported })

    if (!isSupported) {
      const reason = !hasServiceWorker ? 'Service Workers not supported' : 'Push API not supported'
      console.log('[Push] Not supported:', reason)
      setState(prev => ({
        ...prev,
        isSupported: false,
        isLoading: false,
        error: `Push notifications not supported: ${reason}`
      }))
      return
    }

    // Check current permission and subscription status
    const checkStatus = async () => {
      try {
        const permission = Notification.permission
        
        // Check if already subscribed
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        setState({
          isSupported: true,
          isSubscribed: !!subscription,
          isLoading: false,
          permission,
          error: null
        })
      } catch (err) {
        console.error('Error checking push status:', err)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check notification status'
        }))
      }
    }

    checkStatus()
  }, [])

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('[Push] Starting subscription process...')
      
      // Request notification permission
      console.log('[Push] Requesting permission...')
      const permission = await Notification.requestPermission()
      console.log('[Push] Permission result:', permission)
      
      if (permission !== 'granted') {
        setState(prev => ({
          ...prev,
          isLoading: false,
          permission,
          error: 'Notification permission denied'
        }))
        return false
      }

      // Get VAPID public key from backend
      console.log('[Push] Fetching VAPID key...')
      const vapidResponse = await apiClient.get('/notifications/vapid-public-key')
      const vapidPublicKey = vapidResponse.data.public_key
      console.log('[Push] VAPID key received')

      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)

      // Get service worker registration
      console.log('[Push] Waiting for service worker...')
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Service worker timeout')), 10000)
        )
      ]) as ServiceWorkerRegistration
      console.log('[Push] Service worker ready')

      // Subscribe to push
      console.log('[Push] Subscribing to push manager...')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })
      console.log('[Push] Subscription created')

      // Send subscription to backend
      const subscriptionJson = subscription.toJSON()
      console.log('[Push] Sending subscription to backend...')
      
      await apiClient.post('/notifications/subscribe', {
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys?.p256dh,
          auth: subscriptionJson.keys?.auth
        },
        user_agent: navigator.userAgent
      })
      console.log('[Push] Subscription saved successfully')

      setState({
        isSupported: true,
        isSubscribed: true,
        isLoading: false,
        permission: 'granted',
        error: null
      })

      return true
    } catch (err: any) {
      console.error('[Push] Subscription error:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to subscribe to notifications'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      return false
    }
  }, [])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe()

        // Remove from backend
        await apiClient.post('/notifications/unsubscribe', {
          endpoint: subscription.endpoint
        })
      }

      setState(prev => ({
        ...prev,
        isSubscribed: false,
        isLoading: false,
        error: null
      }))

      return true
    } catch (err: any) {
      console.error('Error unsubscribing from push:', err)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to unsubscribe'
      }))
      return false
    }
  }, [])

  // Send test notification
  const sendTest = useCallback(async () => {
    console.log('[Push] Sending test notification...')
    try {
      const response = await apiClient.post('/notifications/test', {
        title: 'Test Notification',
        body: 'Push notifications are working!',
        url: '/dashboard'
      })
      console.log('[Push] Backend response:', response.data)
      
      const { sent, failed, expired } = response.data
      if (sent > 0) {
        alert(`✓ Notification sent to ${sent} device(s)! Check your notifications.${failed > 0 ? ` (${failed} failed)` : ''}`)
      } else if (failed > 0) {
        alert(`⚠ Failed to send to ${failed} device(s). Check console for details.`)
      } else {
        alert('⚠ No active subscriptions found. Make sure you enabled notifications first.')
      }
      return sent > 0
    } catch (err: any) {
      console.error('[Push] Error sending test notification:', err)
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to send test notification'
      alert(`Error: ${errorMsg}`)
      return false
    }
  }, [])

  return {
    ...state,
    subscribe,
    unsubscribe,
    sendTest
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
