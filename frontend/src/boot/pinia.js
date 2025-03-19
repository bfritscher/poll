import { boot } from 'quasar/wrappers'
import pinia from 'src/stores'

export default boot(({ app }) => {
  // Set up Pinia
  app.use(pinia)
})
