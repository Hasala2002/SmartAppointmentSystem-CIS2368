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
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window

    if (!isSupported) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        isLoading: false,
        error: 'Push notifications not supported in this browser'
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
      // Request notification permission
      const permission = await Notification.requestPermission()
      
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
      const vapidResponse = await apiClient.get('/notifications/vapid-public-key')
      const vapidPublicKey = vapidResponse.data.public_key

      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })

      // Send subscription to backend
      const subscriptionJson = subscription.toJSON()
      
      await apiClient.post('/notifications/subscribe', {
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys?.p256dh,
          auth: subscriptionJson.keys?.auth
        },
        user_agent: navigator.userAgent
      })

      setState({
        isSupported: true,
        isSubscribed: true,
        isLoading: false,
        permission: 'granted',
        error: null
      })

      return true
    } catch (err: any) {
      console.error('Error subscribing to push:', err)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to subscribe to notifications'
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
    try {
      await apiClient.post('/notifications/test', {
        title: 'Test Notification',
        body: 'Push notifications are working!',
        url: '/dashboard'
      })
      return true
    } catch (err) {
      console.error('Error sending test notification:', err)
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
