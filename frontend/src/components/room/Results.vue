<template>
  <q-scroll-area class="bg-grey-2" style="height: calc(100vh - 50px)">
    <div class="row q-pa-md q-col-gutter-md">
      <div
        v-for="(score, index) in comStore.results"
        :key="`${score.user?.email}-${score.score}`"
        class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
      >
        <q-card>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img
                  :src="`/images/avatars/${score.user.avatar || avatars[index % avatars.length]}`"
                  :alt="`Avatar of ${score.user.firstname} ${score.user.lastname}`"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ score.user.firstname }} {{ score.user.lastname }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge color="primary" :label="formatNumber(score.score)" />
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>
  </q-scroll-area>
</template>

<script setup>
import { useComStore } from 'src/stores/com'
import { avatars } from 'src/constants'

const comStore = useComStore()

// Format number to show no decimal places
const formatNumber = (value) => {
  return Number(value).toFixed(0)
}
</script>
