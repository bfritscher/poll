<template>
  <q-card>
    <q-card-section class="bg-grey-1 text-primary">
      <div>
        <span v-if="answerIndex !== undefined">{{ answerIndex + 1 }}. </span>
        <span v-if="isCorrect">(correct)</span>
        <span v-if="title">{{ title }}</span>
      </div>
      <div v-if="answerContent" class="overflow-hidden" v-html="answerContent"></div>
    </q-card-section>
    <q-list class="row q-pb-sm q-pt-sm">
      <q-item v-for="(user, index) in users" :key="user.email || index" dense class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-1">
        <q-item-section avatar>
          <q-avatar>
            <img :src="getAvatarUrl(user, index)" />
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ user.firstname }} {{ user.lastname }}</q-item-section>
      </q-item>
      <q-item v-if="!users.length">
        <q-item-section class="text-grey">{{ emptyMessage }}</q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script setup>
import { avatars } from 'src/constants'

defineProps({
  /**
   * Array of user objects to display
   */
  users: {
    type: Array,
    default: () => [],
  },
  /**
   * Title to display in the card header
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * Answer content (HTML) to display
   */
  answerContent: {
    type: String,
    default: '',
  },
  /**
   * Answer index (0-based) to display as "1.", "2.", etc.
   */
  answerIndex: {
    type: Number,
    default: undefined,
  },
  /**
   * Whether this answer is marked as correct
   */
  isCorrect: {
    type: Boolean,
    default: false,
  },
  /**
   * Message to show when no users are present
   */
  emptyMessage: {
    type: String,
    default: 'No users found.',
  },
})

const getAvatarUrl = (user, index) => {
  // Prioritize matricule-based image if available
  if (user?.matricule) {
    return `https://amc.ig.he-arc.ch/sdb/images/students/${user.matricule}.jpg`
  }
  // Use assigned avatar or fallback to cycling through the list
  const avatarFile = user?.avatar || avatars[index % avatars.length]
  return `/images/avatars/${avatarFile}`
}
</script>

