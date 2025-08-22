import Lobby from '../../components/room/Lobby.vue'
import { QLayout, QPageContainer } from 'quasar'

export default {
  title: 'Room/Lobby',
  component: Lobby,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
    decorators: [
    () => ({
      components: {
        QLayout,
        QPageContainer,
      },
      template: '<q-layout view="lHh Lpr lFf"><q-page-container><story/></q-page-container></q-layout>',
    }),
  ],
}

export const Default = {}
