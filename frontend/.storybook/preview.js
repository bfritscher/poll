import { setup } from '@storybook/vue3'
import { sb } from 'storybook/test'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

import 'quasar/dist/quasar.css';
import '../src/css/app.scss';

// Mock the com store using Storybook's automocking
sb.mock('../src/stores/com.js')

const pinia = createPinia()

setup((app) => {
  app.use(pinia)
  app.use(Quasar, {
    plugins: ['Notify', 'Dialog', 'Loading'],
  })
})

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
