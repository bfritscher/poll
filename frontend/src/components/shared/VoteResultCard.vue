<template>
  <q-card :class="cardClass">
    <q-card-section>
      <div class="text-h6">
        <span v-if="answerIndex !== undefined">{{ answerIndex + 1 }}. </span>
        <span v-if="isCorrect">(correct)</span>
        <span v-if="title">{{ title }}</span>
        <div v-if="answerContent" class="overflow-hidden" v-html="answerContent"></div>
      </div>
    </q-card-section>
    <q-list dense>
      <q-item v-for="(user, index) in users" :key="user.email || index">
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
import { computed } from 'vue'
import { avatars } from 'src/constants'

const props = defineProps({
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
  /**
   * Additional CSS classes for the card
   */
  cardClass: {
    type: String,
    default: '',
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

<style lang="scss" scoped>
.q-card {
  .q-card-section .text-h6 {
    .overflow-hidden {
      margin-top: 8px;
    }
  }
}
</style>
