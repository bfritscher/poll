<template>
  <q-page class="flex content-start">
    <q-list class="home-list q-my-md">
      <template v-if="comStore.rooms && comStore.rooms.length > 0">
        <template v-for="room in comStore.rooms" :key="room">
          <q-separator />
          <q-item clickable :to="{ name: 'room', params: { name: room } }">
            <q-item-section>
              <q-item-label>{{ room }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="comStore.isAdmin" side>
              <q-btn
                flat
                color="negative"
                :to="{ name: 'admin', params: { name: room } }"
                label="admin"
              />
            </q-item-section>
          </q-item>
        </template>
        <q-separator />
      </template>

      <q-item v-else class="text-negative">
        <q-item-section>No sessions found</q-item-section>
      </q-item>
    </q-list>

    <!-- FAB for adding new room (admin only) -->
    <q-page-sticky v-if="comStore.isAdmin" position="bottom-right" :offset="[16, 16]">
      <q-btn fab icon="add" color="primary" @click="addRoom" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { useComStore } from 'src/stores/com'
import { useQuasar } from 'quasar'

const comStore = useComStore()
const $q = useQuasar()

// Create new room (admin only)
function addRoom() {
  $q.dialog({
    title: 'Name of the new room?',
    prompt: {
      model: 'Quiz',
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((roomName) => {
    if (!roomName) return

    $q.dialog({
      title: 'Name of the course?',
      prompt: {
        model: 'SQL 1IG 2023',
        type: 'text',
      },
      cancel: true,
      persistent: true,
    }).onOk((courseName) => {
      if (!courseName) return

      comStore.createRoom(roomName, courseName)
    })
  })
}
</script>

<style lang="scss" scoped>
.home-list {
  width: 100%;
  max-width: 768px;
  background-color: white;

  @media (min-width: 768px) {
    margin: 20px auto;
    box-shadow:
      0px 1px 3px 0px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  }
}
</style>
