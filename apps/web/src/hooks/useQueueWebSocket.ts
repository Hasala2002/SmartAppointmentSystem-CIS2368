import { useState, useEffect, useCallback, useRef } from 'react'

interface QueueEntry {
  id: string
  queue_number: string
  position: number
  status: string
  estimated_wait_mins: number | null
  joined_at: string | null
}

interface QueueState {
  location_id: string
  total_waiting: number
  currently_serving: string | null
  entries: QueueEntry[]
}

interface QueueWebSocketState {
  isConnected: boolean
  queueState: QueueState | null
  myPosition: QueueEntry | null
  error: string | null
}

interface QueueMessage {
  type: 'queue_state' | 'position_update' | 'customer_called' | 'pong' | 'error'
  payload: any
  timestamp?: string
}

export const useQueueWebSocket = (locationId: string | null, customerId?: string) => {
  const [state, setState] = useState<QueueWebSocketState>({
    isConnected: false,
    queueState: null,
    myPosition: null,
    error: null
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const pingIntervalRef = useRef<number | null>(null)

  const connect = useCallback(() => {
    if (!locationId) return

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close()
    }

    // WebSocket base URL is baked in at build time via VITE_WS_URL (passed as
    // a Docker build arg from docker-compose.local.yml so it tracks API_PORT).
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsBaseUrl =
      import.meta.env.VITE_WS_URL ||
      `${wsScheme}://${window.location.hostname}:8001`
    const wsUrl = `${wsBaseUrl}/ws/queue/${locationId}`
    console.log('[WS] Connecting to:', wsUrl)

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS] Connected')
      setState(prev => ({ ...prev, isConnected: true, error: null }))

      // Start ping interval to keep connection alive
      pingIntervalRef.current = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }))
        }
      }, 30000) // Ping every 30 seconds
    }

    ws.onmessage = (event) => {
      try {
        const message: QueueMessage = JSON.parse(event.data)
        console.log('[WS] Message received:', message.type)

        switch (message.type) {
          case 'queue_state':
            const queueState = message.payload as QueueState
            const myEntry = customerId
              ? queueState.entries.find(e => e.id === customerId || message.payload.customer_id === customerId)
              : null

            setState(prev => ({
              ...prev,
              queueState,
              myPosition: myEntry || prev.myPosition
            }))
            break

          case 'position_update':
            if (message.payload.customer_id === customerId) {
              setState(prev => ({
                ...prev,
                myPosition: prev.myPosition
                  ? {
                      ...prev.myPosition,
                      position: message.payload.new_position,
                      estimated_wait_mins: message.payload.estimated_wait_mins
                    }
                  : null
              }))
            }
            break

          case 'customer_called':
            // Could trigger a notification or UI update
            if (message.payload.customer_id === customerId) {
              setState(prev => ({
                ...prev,
                myPosition: prev.myPosition
                  ? { ...prev.myPosition, status: 'called' }
                  : null
              }))
            }
            break

          case 'pong':
            // Connection is alive
            break

          case 'error':
            console.error('[WS] Error from server:', message.payload)
            break
        }
      } catch (err) {
        console.error('[WS] Error parsing message:', err)
      }
    }

    ws.onclose = (event) => {
      console.log('[WS] Disconnected:', event.code, event.reason)
      setState(prev => ({ ...prev, isConnected: false }))

      // Clear ping interval
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }

      // Attempt reconnect after 3 seconds (unless intentionally closed)
      if (event.code !== 1000) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('[WS] Attempting reconnect...')
          connect()
        }, 3000)
      }
    }

    ws.onerror = (error) => {
      console.error('[WS] Error:', error)
      setState(prev => ({ ...prev, error: 'Connection error' }))
    }
  }, [locationId, customerId])

  // Connect when locationId changes
  useEffect(() => {
    if (locationId) {
      connect()
    }

    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted')
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }
    }
  }, [locationId, connect])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
    }
  }, [])

  return {
    ...state,
    connect,
    disconnect
  }
}
