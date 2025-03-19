<template>
  <q-page class="column full-height">
    <room-toolbar />

    <!-- Dynamic content based on room state -->
    <lobby-component v-if="comStore.room?.state === 'lobby'" />
    <question-component v-else-if="comStore.room?.state?.indexOf('q') === 0" />
    <results-component v-else-if="comStore.room?.state === 'results'" />
  </q-page>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useComStore } from 'src/stores/com-store'
import RoomToolbar from 'src/components/shared/RoomToolbar.vue'
import LobbyComponent from 'src/components/room/Lobby.vue'
import QuestionComponent from 'src/components/room/Question.vue'
import ResultsComponent from 'src/components/room/Results.vue'

const route = useRoute()
const comStore = useComStore()

onMounted(() => {
  const roomName = route.params.name
  if (roomName) {
    comStore.joinRoom(roomName)
  }
})

onBeforeUnmount(() => {
  comStore.leaveRoom()
})
</script>
