import { boot } from 'quasar/wrappers'
import { useComStore } from 'src/stores/com-store'

export default boot(() => {
  // Check if there's a token in the URL (after redirect from login)
  const params = new URLSearchParams(window.location.search)
  const token = params.get('jwt')
  
  if (token) {
    console.log('Auth token found in URL, saving token')
    const comStore = useComStore()
    comStore.saveToken(token)
    
    // Clean up the URL
    const url = new URL(window.location.href)
    url.searchParams.delete('jwt')
    window.history.replaceState({}, document.title, url.toString())
  }
})