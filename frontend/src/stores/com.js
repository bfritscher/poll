import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { io } from 'socket.io-client'
import * as SocketEvents from '../socket-events'

export const useComStore = defineStore('com', () => {
  const router = useRouter()

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

  let resolveUser
  let userReady = new Promise((resolve) => {
    resolveUser = resolve
  })

  // State
  const online = ref(false)
  const user = ref(null)
  const room = ref(null)
  const rooms = ref([])
  const question = ref(null)
  const answers = ref({})
  const results = ref(null)
  const token = ref(localStorage.getItem('jwt') || null)
  const waitingOnRoom = ref(null)

  // Computed properties
  const isAdmin = computed(() => user.value?.isAdmin || false)
  const questionIndex = computed(() => {
    if (room.value && room.value.state && room.value.state.indexOf('q') === 0) {
      return parseInt(room.value.state.slice(1), 10)
    }
    return undefined
  })

  // Setup socket event handlers
  function setupSocketHandlers() {
    socket.on('connect', () => {
      online.value = true
      console.log('Socket connected, authenticating...')
      login()
    })

    socket.on('disconnect', () => {
      online.value = false
      userReady = new Promise((resolve) => {
        resolveUser = resolve
      })
    })

    socket.on(SocketEvents.DISCONNECT, () => {
      online.value = false
      console.log('Socket disconnected')
    })

    socket.on(SocketEvents.CONNECT_ERROR, (err) => {
      console.error('Socket connection error:', err)
    })

    socket.on(SocketEvents.USER, (data) => {
      user.value = data
      resolveUser(data)
    })

    socket.on(SocketEvents.ERROR, (data) => {
      console.error('Error from server:', data)
      if (
        data.type === SocketEvents.ErrorType.NOT_LOGGED_IN ||
        data.type === SocketEvents.ErrorType.TOKEN
      ) {
        console.log('Authentication error, redirecting to login')
        deleteToken()
        redirectToLogin()
        return
      }

      // Handle other errors
      const $q = useQuasar()
      $q.notify({
        type: 'negative',
        message: `Error: ${data.message || 'Unknown error'}`,
      })
    })

    socket.on(SocketEvents.USER_AVATAR_UPDATE, (data) => {
      if (room.value && Object.prototype.hasOwnProperty.call(room.value.voters, data.user)) {
        room.value.voters[data.user].avatar = data.avatar
      }
    })

    socket.on(SocketEvents.USER_ANSWERS, (data) => {
      answers.value = data
    })

    socket.on(SocketEvents.ROOMS, (data) => {
      console.log('Received rooms:', data)
      rooms.value = data

      if (waitingOnRoom.value && rooms.value.indexOf(waitingOnRoom.value) > -1) {
        router.push({ name: 'admin', params: { name: waitingOnRoom.value } })
        waitingOnRoom.value = null
        return
      }

      if (rooms.value.length === 1 && router.currentRoute.value.name === 'home') {
        router.push({ name: 'room', params: { name: rooms.value[0] } })
      }

      if (room.value && rooms.value.indexOf(room.value.name) === -1) {
        router.push({ name: 'home' })
      }
    })

    socket.on(SocketEvents.ROOM, (data) => {
      room.value = data
    })

    socket.on(SocketEvents.QUESTIONS, (data) => {
      if (room.value) room.value.questions = data
    })

    socket.on(SocketEvents.QUESTIONS_COUNT, (data) => {
      if (room.value) room.value.questionsCount = data
    })

    socket.on('close', () => {
      const router = useRouter()
      router.push({ name: 'home' })
    })

    socket.on(SocketEvents.STATE, (data) => {
      if (room.value) room.value.state = data.state
      question.value = data.question
      results.value = data.results

      if (data.question && data.question.votesByAnswers) {
        const votesByAnswers = data.question.votesByAnswers
        delete data.question.votesByAnswers

        setTimeout(() => {
          if (question.value) {
            question.value.votesByAnswers = votesByAnswers
          }
        }, 100)
      } else {
        const index = questionIndex.value
        if (index !== undefined && (!answers.value[index] || data.reset)) {
          answers.value[index] = []
        }
      }
    })

    socket.on(SocketEvents.VOTER_JOIN, (data) => {
      if (room.value && room.value.voters) {
        room.value.voters[data.email] = data

        if (!room.value.participants) {
          room.value.participants = {}
        }
        room.value.participants[data.email] = data
      }
    })

    socket.on(SocketEvents.VOTER_LEFT, (email) => {
      if (room.value && room.value.voters) {
        delete room.value.voters[email]
      }
    })

    socket.on(SocketEvents.VOTES_COUNT, (count) => {
      if (question.value) {
        question.value.votesCount = count
      }
    })

    socket.on(SocketEvents.VOTE, (data) => {
      if (room.value && room.value.questions) {
        room.value.questions[data.questionIndex].votes[data.user] = data.vote
      }
    })

    // Check current connection status
    online.value = socket.connected
    if (online.value) {
      login()
    }
  }

  // Clean up socket event handlers
  function cleanupSocketHandlers() {
    socket.off('connect')
    socket.off(SocketEvents.DISCONNECT)
    socket.off(SocketEvents.CONNECT_ERROR)
    socket.off(SocketEvents.ERROR)
    socket.off(SocketEvents.USER)
    socket.off(SocketEvents.USER_AVATAR_UPDATE)
    socket.off(SocketEvents.USER_ANSWERS)
    socket.off(SocketEvents.ROOMS)
    socket.off(SocketEvents.ROOM)
    socket.off(SocketEvents.QUESTIONS)
    socket.off(SocketEvents.QUESTIONS_COUNT)
    socket.off('close')
    socket.off(SocketEvents.STATE)
    socket.off(SocketEvents.VOTER_JOIN)
    socket.off(SocketEvents.VOTER_LEFT)
    socket.off(SocketEvents.VOTES_COUNT)
    socket.off(SocketEvents.VOTE)
  }

  // Redirect to the login page
  function redirectToLogin() {
    console.log('Redirecting to login page...')
    // This is the same URL used in the original app for authentication
    window.location = `https://marmix.ig.he-arc.ch/shibjwt/?reply_to=${window.location.origin}/api/login`
  }

  // Token management
  function getToken() {
    if (token.value) {
      return Promise.resolve(token.value)
    } else {
      redirectToLogin()
      return new Promise(() => {
        // This will redirect, so the promise may never resolve
      })
    }
  }

  function saveToken(newToken) {
    localStorage.setItem('jwt', newToken)
    token.value = newToken

    // After saving a new token, try to authenticate
    if (socket.connected) {
      sendToken()
    }
  }

  function deleteToken() {
    localStorage.removeItem('jwt')
    token.value = null
  }

  function sendToken() {
    if (socket.connected && token.value) {
      console.log('Sending auth token to server')
      socket.emit(SocketEvents.AUTHENTICATE, token.value)
    } else {
      console.warn('Cannot send token: socket not connected or token is null')
    }
  }

  function login() {
    if (token.value) {
      console.log('Using existing token for login')
      sendToken()
    } else {
      console.log('No token found, redirecting to login')
      redirectToLogin()
    }
  }

  // Room actions
  async function joinRoom(roomName) {
    await userReady;
    socket.emit(SocketEvents.JOIN_ROOM, roomName)
  }

  function leaveRoom() {
    if (socket.connected && room.value && room.value.name) {
      socket.emit(SocketEvents.LEAVE_ROOM, room.value.name)
    }
  }

  function createRoom(roomName, courseName) {
    if (socket.connected && user.value) {
      waitingOnRoom.value = roomName
      socket.emit(SocketEvents.CREATE_ROOM, { name: roomName, course: courseName })
    }
  }

  function closeRoom() {
    if (socket.connected && room.value && room.value.name) {
      socket.emit(SocketEvents.CLOSE_ROOM, room.value.name)
    }
  }

  function addQuestion(question) {
    if (socket.connected && room.value && room.value.name) {
      socket.emit(SocketEvents.ADD_QUESTION, { room: room.value.name, question })
    }
  }

  function sendAnswer(answer) {
    if (socket.connected && room.value && room.value.name) {
      socket.emit(SocketEvents.VOTE, { room: room.value.name, vote: answer })
    }
  }

  function setAvatar(avatar) {
    if (socket.connected && room.value && room.value.name) {
      socket.emit(SocketEvents.USER_AVATAR, { room: room.value.name, avatar })
    }
  }

  function setState(state) {
    if (socket.connected && room.value && room.value.name && user.value?.isAdmin) {
      if (state && Object.prototype.hasOwnProperty.call(state, 'reset')) {
        socket.emit(SocketEvents.SET_STATE, {
          room: room.value.name,
          state: room.value.state,
          reset: true,
        })
      } else {
        socket.emit(SocketEvents.SET_STATE, { room: room.value.name, state })
      }
    }
  }

  function nextState() {
    if (!room.value) return

    if (
      room.value.state === SocketEvents.ROOM_STATES.LOBBY ||
      room.value.state === SocketEvents.ROOM_STATES.RESULTS
    ) {
      if (room.value.questions && room.value.questions.length > 0) {
        setState('q0')
      } else {
        setState(SocketEvents.ROOM_STATES.RESULTS)
      }
    } else if (room.value.state.indexOf('q') === 0) {
      const currentIndex = parseInt(room.value.state.slice(1), 10)
      if (currentIndex < room.value.questions.length - 1) {
        setState('q' + (currentIndex + 1))
      } else {
        setState(SocketEvents.ROOM_STATES.RESULTS)
      }
    }
  }

  function previousState() {
    if (!room.value) return

    if (room.value.state === SocketEvents.ROOM_STATES.RESULTS) {
      if (room.value.questions && room.value.questions.length > 0) {
        setState('q' + (room.value.questions.length - 1))
      } else {
        setState(SocketEvents.ROOM_STATES.LOBBY)
      }
    } else if (room.value.state.indexOf('q') === 0) {
      const currentIndex = parseInt(room.value.state.slice(1), 10)
      if (currentIndex > 0) {
        setState('q' + (currentIndex - 1))
      } else {
        setState(SocketEvents.ROOM_STATES.LOBBY)
      }
    }
  }

  function userSorter(a, b) {
    const aname = a.lastname + a.firstname || ''
    const bname = b.lastname + b.firstname || ''
    if (aname > bname) {
      return 1
    }
    if (aname < bname) {
      return -1
    }
    return 0
  }

  // Setup and cleanup for the store
  onMounted(() => {
    setupSocketHandlers()
  })

  onUnmounted(() => {
    cleanupSocketHandlers()
  })

  return {
    // State
    online,
    user,
    room,
    rooms,
    question,
    answers,
    results,

    // Computed
    isAdmin,
    questionIndex,

    // Methods
    joinRoom,
    leaveRoom,
    createRoom,
    closeRoom,
    addQuestion,
    sendAnswer,
    setAvatar,
    setState,
    nextState,
    previousState,
    userSorter,
    saveToken,
    login,
    getToken,
  }
})
