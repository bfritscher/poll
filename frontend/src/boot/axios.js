import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Create a custom axios instance
const api = axios.create({
  baseURL: 'http://localhost:3033/api',
})

// Add a request interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login on authentication failure
      // localStorage.removeItem('jwt')
      // window.location = 'https://marmix.ig.he-arc.ch/shibjwt/?reply_to=http://localhost:9000'
    }
    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  // Make axios available as this.$axios and api as this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

// Export the API instance for use in composition API
export { api }
