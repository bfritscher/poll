<template>
  <q-toolbar>
      <q-btn flat no-caps to="/" class="q-mr-sm">
        <q-avatar square size="24px">
          <img src="/icons/logo.svg" alt="Logo" />
          </q-avatar>
        <q-toolbar-title>Poll</q-toolbar-title>
      </q-btn>

    <div class="room-toolbar-state">
      <span class="room-toolbar-name">{{ comStore.room?.name }}</span>
      <span v-if="comStore.room?.state === 'lobby'">Lobby</span>
      <span v-if="comStore.room?.state === 'results'">Results</span>
      <span v-if="comStore.room?.state?.indexOf('q') === 0">
        {{ comStore.questionIndex + 1 }} / {{ comStore.room?.questionsCount }}
      </span>
      <q-icon v-if="comStore.question?.isMultiple" name="done_all" />
      <q-btn
        v-if="$route.name === 'admin'"
        :to="{ name: 'room', params: { name: comStore.room?.name } }"
        target="_blank"
        flat
        dense
        round
        icon="launch"
      />
    </div>

    <div class="flex"></div>

    <div class="room-toolbar-votes text-right">
      <div v-if="comStore.room?.state?.indexOf('q') === 0">
        {{ comStore.question?.votesCount || 0 }}
      </div>
      <div>{{ votersCount }}</div>
    </div>
  </q-toolbar>
</template>

<script setup>
import { computed } from 'vue'
import { useComStore } from 'src/stores/com'
import { useRoute } from 'vue-router'

const comStore = useComStore()
const $route = useRoute()

const votersCount = computed(() => {
  if (comStore.room?.voters) {
    return Object.keys(comStore.room.voters).length
  }
  return 0
})
</script>

<style lang="scss" scoped>
.room-toolbar-state {
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-toolbar-votes {
  font-size: 12px;
  white-space: nowrap;
  text-align: right;
}
</style>
