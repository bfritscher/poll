<template>
  <div class="full-height">
    <!-- Avatar selection drawer -->
    <q-drawer v-model="avatarDrawer" side="left" elevated>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Select Avatar</q-toolbar-title>
      </q-toolbar>

      <q-scroll-area class="fit">
        <div class="q-pa-md row items-start q-gutter-md">
          <q-btn
            v-for="(icon, index) in avatars"
            :key="index"
            round
            flat
            :class="{
              selected: currentUserAvatar === icon,
            }"
            @click="selectAvatar(index)"
          >
            <q-avatar size="42px">
              <img :src="`/images/avatars/${icon}`" :alt="icon" />
            </q-avatar>
          </q-btn>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- Participants list -->
    <q-scroll-area class="full-height">
      <div class="row q-col-gutter-sm q-pa-md">
        <div
          v-for="(user, index) in orderedVoters"
          :key="user.email"
          class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
        >
          <q-item
            clickable
            :class="{ 'current-user': user.email === comStore.user?.email }"
            class="q-mb-sm"
            style="border-radius: 8px"
            @click="avatarDrawer = true"
          >
            <q-item-section avatar>
              <q-avatar>
                <img
                  :src="`/images/avatars/${user.avatar || avatars[index % avatars.length]}`"
                  :alt="`Avatar of ${user.firstname} ${user.lastname}`"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ user.firstname }} {{ user.lastname }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useComStore } from 'src/stores/com'
import { avatars } from 'src/constants'

const comStore = useComStore()
const avatarDrawer = ref(false)

// Get the current user's avatar
const currentUserAvatar = computed(() => {
  if (comStore.room?.voters && comStore.user) {
    return comStore.room.voters[comStore.user.email]?.avatar
  }
  return null
})

// Get ordered list of voters/participants
const orderedVoters = computed(() => {
  if (!comStore.room?.voters) return []

  return Object.values(comStore.room.voters).sort(comStore.userSorter)
})

// Select an avatar
function selectAvatar(index) {
  comStore.setAvatar(avatars[index])
  avatarDrawer.value = false
}
</script>

<style lang="scss" scoped>
.current-user {
  background-color: #cfd8dc;
}

.q-btn.selected ::v-deep(.q-avatar img) {
  filter: grayscale(100%);
}
</style>
