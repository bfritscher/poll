<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!inRoom" elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar square size="24px">
          <img src="/icons/logo.svg" alt="Logo" />
        </q-avatar>
        <q-toolbar-title> Poll </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <div v-if="!comStore.online" class="connection-status">reconnecting...</div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useComStore } from 'src/stores/com'

const route = useRoute()
const comStore = useComStore()

// Determine if we're in a room page to hide the header
const inRoom = computed(() => {
  return route.name === 'room' || route.name === 'admin'
})

// Handle keyboard shortcuts
function handleKeyDown(event) {
  if (route.name === 'room') {
    if (comStore.isAdmin) {
      if (event.keyCode === 76) {
        // l
        comStore.setState('lobby')
      }
      if (event.keyCode === 82) {
        // r
        comStore.setState('results')
      }
      if (event.keyCode === 37 || event.keyCode === 33) {
        // leftArrow, pageUp
        comStore.previousState()
      }
      if (event.keyCode === 39 || event.keyCode === 34) {
        // rightArrow, pageDown
        comStore.nextState()
      }
      if (event.keyCode === 190) {
        // .
        comStore.setState(comStore.room?.state)
      }
    } else {
      // number to select answer 1-9 and keypad
      let index
      if (event.keyCode >= 49 && event.keyCode <= 57) {
        index = event.keyCode - 49
        // Implement a custom event for this in Question.vue
        window.dispatchEvent(new CustomEvent('select-answer', { detail: { index } }))
      }
      if (event.keyCode >= 97 && event.keyCode <= 105) {
        // numpad 1-9
        index = event.keyCode - 97
        window.dispatchEvent(new CustomEvent('select-answer', { detail: { index } }))
      }
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)

  // Handle page unload to notify server
  window.addEventListener('beforeunload', () => {
    comStore.leaveRoom()
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="scss">
.connection-status {
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 5px;
  color: #f44336;
  background: rgba(255, 255, 255, 0.8);
}
</style>
