import { fn } from 'storybook/test'
import { ref, computed } from 'vue'

// Mock implementation of the com store
export const useComStore = fn(() => {
  // State - only what's needed for the components
  const user = ref({
    email: 'john.doe@example.com',
    firstname: 'John',
    lastname: 'Doe',
    isAdmin: false,
    avatar: 'businessman.svg'
  })

  const room = ref({
    id: 'test-room-123',
    name: 'Test Poll Room',
    state: 'lobby',
    voters: {
      'john.doe@example.com': {
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        avatar: 'businessman.svg'
      },
      'jane.smith@example.com': {
        email: 'jane.smith@example.com',
        firstname: 'Jane',
        lastname: 'Smith',
        avatar: 'nurse.svg'
      },
      'bob.wilson@example.com': {
        email: 'bob.wilson@example.com',
        firstname: 'Bob',
        lastname: 'Wilson',
        avatar: 'engineer.svg'
      },
      'alice.brown@example.com': {
        email: 'alice.brown@example.com',
        firstname: 'Alice',
        lastname: 'Brown',
        avatar: 'teacher.svg'
      },
      'charlie.davis@example.com': {
        email: 'charlie.davis@example.com',
        firstname: 'Charlie',
        lastname: 'Davis',
        avatar: 'chef.svg'
      }
    },
    participants: {}
  })

  const results = ref([
    {
      user: {
        email: 'alice.brown@example.com',
        firstname: 'Alice',
        lastname: 'Brown',
        avatar: 'teacher.svg'
      },
      score: 95.5
    },
    {
      user: {
        email: 'bob.wilson@example.com',
        firstname: 'Bob',
        lastname: 'Wilson',
        avatar: 'engineer.svg'
      },
      score: 87.2
    },
    {
      user: {
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        avatar: 'businessman.svg'
      },
      score: 82.1
    },
    {
      user: {
        email: 'jane.smith@example.com',
        firstname: 'Jane',
        lastname: 'Smith',
        avatar: 'nurse.svg'
      },
      score: 78.9
    },
    {
      user: {
        email: 'charlie.davis@example.com',
        firstname: 'Charlie',
        lastname: 'Davis',
        avatar: 'chef.svg'
      },
      score: 72.4
    }
  ])

  const online = ref(true)
  const rooms = ref([])
  const question = ref(null)
  const answers = ref({})

  // Initialize participants to match voters
  room.value.participants = room.value.voters

  // Computed properties
  const isAdmin = computed(() => user.value?.isAdmin || false)
  const questionIndex = computed(() => {
    if (room.value && room.value.state && room.value.state.indexOf('q') === 0) {
      return parseInt(room.value.state.slice(1), 10)
    }
    return undefined
  })

  // Helper function for sorting users
  function userSorter(a, b) {
    const aname = a.lastname + a.firstname || ''
    const bname = b.lastname + b.firstname || ''
    if (aname > bname) return 1
    if (aname < bname) return -1
    return 0
  }

  // Mock functions
  const setAvatar = fn((avatar) => {
    if (user.value && room.value?.voters && room.value.voters[user.value.email]) {
      room.value.voters[user.value.email].avatar = avatar
      user.value.avatar = avatar
    }
  }).mockName('setAvatar')

  const redirectToLogin = fn(() => {
    console.log('Mock redirectToLogin called in Storybook')
  }).mockName('redirectToLogin')

  const getToken = fn(() => {
    return Promise.resolve('mock-jwt-token')
  }).mockName('getToken')

  const joinRoom = fn(() => {
    console.log('Mock joinRoom called')
  }).mockName('joinRoom')

  const leaveRoom = fn(() => {
    console.log('Mock leaveRoom called')
  }).mockName('leaveRoom')

  const createRoom = fn(() => {
    console.log('Mock createRoom called')
  }).mockName('createRoom')

  const closeRoom = fn(() => {
    console.log('Mock closeRoom called')
  }).mockName('closeRoom')

  const addQuestion = fn(() => {
    console.log('Mock addQuestion called')
  }).mockName('addQuestion')

  const sendAnswer = fn(() => {
    console.log('Mock sendAnswer called')
  }).mockName('sendAnswer')

  const setState = fn(() => {
    console.log('Mock setState called')
  }).mockName('setState')

  const nextState = fn(() => {
    console.log('Mock nextState called')
  }).mockName('nextState')

  const previousState = fn(() => {
    console.log('Mock previousState called')
  }).mockName('previousState')

  const saveToken = fn(() => {
    console.log('Mock saveToken called')
  }).mockName('saveToken')

  const login = fn(() => {
    console.log('Mock login called')
    return Promise.resolve()
  }).mockName('login')

  return {
    // State
    user: user.value,
    room: room.value,
    results: results.value,
    online: online.value,
    rooms: rooms.value,
    question: question.value,
    answers: answers.value,

    // Computed
    isAdmin,
    questionIndex,

    // Methods
    userSorter,
    setAvatar,
    redirectToLogin,
    getToken,
    joinRoom,
    leaveRoom,
    createRoom,
    closeRoom,
    addQuestion,
    sendAnswer,
    setState,
    nextState,
    previousState,
    saveToken,
    login
  }
}).mockName('useComStore')
