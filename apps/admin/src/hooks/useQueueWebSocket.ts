import { useState, useEffect, useCallback, useRef } from 'react'

interface QueueEntry {
  id: string
  queue_number: string
  position: number
  status: string
  estimated_wait_mins: number | null
  customer_id: string
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
  error: string | null
}

interface QueueMessage {
  type: 'queue_state' | 'position_update' | 'customer_called' | 'pong' | 'error'
  payload: any
  timestamp?: string
}

export const useQueueWebSocket = (locationId: string | null) => {
  const [state, setState] = useState<QueueWebSocketState>({
    isConnected: false,
    queueState: null,
    error: null
  })

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const pingIntervalRef = useRef<number | null>(null)

  const connect = useCallback(() => {
    if (!locationId) return

    if (wsRef.current) {
      wsRef.current.close()
    }

    // Use current host for WebSocket to support mobile testing
    const wsHost = window.location.hostname
    const wsUrl = `ws://${wsHost}:8000/ws/queue/${locationId}`
    console.log('[WS Admin] Connecting to:', wsUrl)

    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS Admin] Connected')
      setState(prev => ({ ...prev, isConnected: true, error: null }))

      pingIntervalRef.current = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }))
        }
      }, 30000)
    }

    ws.onmessage = (event) => {
      try {
        const message: QueueMessage = JSON.parse(event.data)
        console.log('[WS Admin] Message received:', message.type)

        switch (message.type) {
          case 'queue_state':
            setState(prev => ({
              ...prev,
              queueState: message.payload as QueueState
            }))
            break

          case 'pong':
            break

          case 'error':
            console.error('[WS Admin] Error from server:', message.payload)
            break
        }
      } catch (err) {
        console.error('[WS Admin] Error parsing message:', err)
      }
    }

    ws.onclose = (event) => {
      console.log('[WS Admin] Disconnected:', event.code, event.reason)
      setState(prev => ({ ...prev, isConnected: false }))

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current)
      }

      if (event.code !== 1000) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('[WS Admin] Attempting reconnect...')
          connect()
        }, 3000)
      }
    }

    ws.onerror = (error) => {
      console.error('[WS Admin] Error:', error)
      setState(prev => ({ ...prev, error: 'Connection error' }))
    }
  }, [locationId])

  useEffect(() => {
    if (locationId) {
      connect()
    }

    return () => {
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
