import { boot } from 'quasar/wrappers'
import { io } from 'socket.io-client'

// Create a Socket.io instance with configuration
const socket = io('localhost:3033', {
  transports: ['websocket', 'polling'], // Try WebSocket first, then fallback to polling
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  autoConnect: true, // Connect immediately
})

// Debug events in development
if (process.env.NODE_ENV === 'development') {
  socket.onAny((event, ...args) => {
    console.debug(`[Socket.io] ${event}:`, args)
  })
}

export default boot(({ app }) => {
  // Make socket available as this.$socket
  app.config.globalProperties.$socket = socket
})

// Export the socket instance for use in composition API
export { socket }
