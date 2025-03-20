<template>
  <q-page class="column full-height">
    <room-toolbar />

    <!-- Admin Control Panel -->
    <div class="admin-controls row q-pa-sm bg-grey-3">
      <!-- State controls -->
      <div class="col-auto">
        <q-btn-group>
          <q-btn color="primary" icon="manage_accounts" label="Lobby" @click="setState('lobby')" />
          <q-btn
            color="primary"
            icon="question_answer"
            label="Questions"
            @click="openFirstQuestion"
          />
          <q-btn color="primary" icon="poll" label="Results" @click="setState('results')" />
        </q-btn-group>
      </div>

      <q-space />

      <!-- Question navigation controls (displayed when in question state) -->
      <div v-if="comStore.room?.state?.indexOf('q') === 0" class="col-auto">
        <q-btn-group>
          <q-btn color="primary" icon="arrow_back" @click="previousState" />
          <q-btn color="primary" icon="refresh" @click="resetState" />
          <q-btn color="primary" icon="arrow_forward" @click="nextState" />
        </q-btn-group>
      </div>

      <q-space />

      <!-- Close room button -->
      <div class="col-auto">
        <q-btn color="negative" icon="close" label="Close room" @click="confirmClose" />
      </div>
    </div>

    <!-- Dynamic content based on room state -->
    <admin-lobby v-if="comStore.room?.state === 'lobby'" />
    <admin-question v-else-if="comStore.room?.state?.indexOf('q') === 0" />
    <admin-results v-else-if="comStore.room?.state === 'results'" />
  </q-page>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useComStore } from 'src/stores/com'
import RoomToolbar from 'src/components/shared/RoomToolbar.vue'
import AdminLobby from 'src/components/admin/Lobby.vue'
import AdminQuestion from 'src/components/admin/Question.vue'
import AdminResults from 'src/components/admin/Results.vue'

const route = useRoute()
const router = useRouter()
const comStore = useComStore()
const $q = useQuasar()

// Set the room state
function setState(state) {
  comStore.setState(state)
}

// Navigation functions
function nextState() {
  comStore.nextState()
}

function previousState() {
  comStore.previousState()
}

function resetState() {
  comStore.setState({ reset: true })
}

function openFirstQuestion() {
  if (comStore.room?.questions?.length > 0) {
    comStore.setState('q0')
  }
}

// Close room confirmation
function confirmClose() {
  $q.dialog({
    title: 'Close Room',
    message: 'Are you sure you want to close this room?',
    persistent: true,
    cancel: true,
  }).onOk(() => {
    comStore.closeRoom()
    router.push({ name: 'home' })
  })
}

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

<style lang="scss" scoped>
.admin-controls {
  align-items: center;
}
</style>
