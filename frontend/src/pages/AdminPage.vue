<template>
  <q-page class="column full-height">
    <room-toolbar />

    <q-tabs v-model="selectedTab" align="justify" narrow-indicator class="q-mb-md">
      <q-tab name="questions" label="Questions" />
      <q-tab name="poll" label="Poll" />
      <q-tab name="admin" label="Admin" />
    </q-tabs>

    <q-tab-panels v-model="selectedTab" animated class="col">
      <q-tab-panel name="questions">
        <div class="q-gutter-md">
          <q-card>
            <q-card-section>
              <div class="text-h6">Import Questions</div>
            </q-card-section>
            <q-card-section>
              <q-uploader
                label="Drop YAML question files or click to upload"
                accept=".yaml,.yml"
                auto-upload
                max-files="1"
                class="full-width"
                @added="onFileAdded"
              />
              <div v-if="importError" class="text-negative q-mt-sm">{{ importError }}</div>
            </q-card-section>
          </q-card>

          <q-card>
            <q-card-section>
              <div class="text-h6">ColorVote</div>
            </q-card-section>
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="newQuestion.content"
                label="Question"
                type="textarea"
                rows="2"
                outlined
              />
              <q-item-label>Answers: {{ newQuestion.answersCount }}</q-item-label>
              <q-slider
                v-model="newQuestion.answersCount"
                :min="2"
                :max="8"
                :step="1"
                label
                label-always
                markers
                snap
                color="primary"
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn label="Add" color="primary" @click="addQuestion" />
            </q-card-actions>
          </q-card>

          <q-card v-if="comStore.room?.questions?.length">
            <q-card-section>
              <div class="text-h6">Current Questions</div>
            </q-card-section>
            <q-list bordered separator>
              <q-item v-for="(question, index) in comStore.room.questions" :key="index">
                <q-item-section avatar>
                  <q-avatar text-color="primary" size="md">
                    {{ index + 1 }}.
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="1">{{ stripHtml(question.content) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  ({{ question.answers.length }})
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </q-tab-panel>

      <q-tab-panel name="poll">
        <div class="q-gutter-md">
          <q-card v-if="comStore.room">
             <q-card-section class="row items-center q-gutter-md">
               <q-select
                 v-model="comStore.room.state"
                 label="State"
                 :options="stateOptions"
                 emit-value
                 map-options
                 outlined
                 dense
                 class="col"
                 style="min-width: 200px;"
                 @update:model-value="comStore.setState($event)"
               >
                 <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
               </q-select>
             </q-card-section>
             <q-card-section class="row justify-between">
                <q-btn label="Previous" color="primary" :disable="comStore.room.state === 'lobby'" @click="comStore.previousState()" />
                <q-btn
                  v-if="isQuestionState && !comStore.question?.votesByAnswers"
                  label="Answers"
                  color="warning"
                  @click="comStore.setState(comStore.room.state)"
                />
                 <q-btn
                  v-if="isQuestionState && comStore.question?.votesByAnswers"
                  label="Reset"
                  color="warning"
                  @click="comStore.setState({ reset: true })"
                />
                <q-btn label="Next" color="primary" @click="comStore.nextState()" />
             </q-card-section>
          </q-card>

          <div v-if="isQuestionState">
            <q-card>
              <q-card-section>
                <div class="text-h6">No vote</div>
              </q-card-section>
              <q-list dense>
                 <q-item v-for="(user, index) in votersWithoutAnswer" :key="user.email">
                   <q-item-section avatar>
                     <q-avatar>
                       <img :src="getAvatarUrl(user, index)" />
                     </q-avatar>
                   </q-item-section>
                   <q-item-section>{{ user.firstname }} {{ user.lastname }}</q-item-section>
                 </q-item>
                 <q-item v-if="!votersWithoutAnswer.length">
                   <q-item-section class="text-grey">Everyone has voted.</q-item-section>
                 </q-item>
              </q-list>
            </q-card>

            <q-card v-for="(answer, answerIndex) in comStore.room.questions[comStore.questionIndex].answers" :key="answerIndex" class="q-mt-md">
               <q-card-section>
                 <div class="text-h6">{{ answerIndex + 1 }}. <span v-if="answer.correct">(correct)</span> {{ stripHtml(answer.content) }}</div>
               </q-card-section>
               <q-list dense>
                 <q-item v-for="(user, index) in votersByAnswer(answerIndex)" :key="user.email">
                    <q-item-section avatar>
                     <q-avatar>
                       <img :src="getAvatarUrl(user, index)" />
                     </q-avatar>
                   </q-item-section>
                   <q-item-section>{{ user.firstname }} {{ user.lastname }}</q-item-section>
                 </q-item>
                  <q-item v-if="!votersByAnswer(answerIndex).length">
                   <q-item-section class="text-grey">No votes for this answer.</q-item-section>
                 </q-item>
               </q-list>
            </q-card>
          </div>

          <q-card v-if="comStore.room?.state === 'results'">
             <q-card-section>
                <div class="text-h6">Results</div>
             </q-card-section>
             <q-card-section>
                <!-- Assuming Results component exists -->
                <results />
             </q-card-section>
          </q-card>

        </div>
      </q-tab-panel>

      <q-tab-panel name="admin">
         <q-card>
            <q-card-section>
              <div class="text-h6">Cleanup</div>
            </q-card-section>
            <q-card-section>
               <q-btn label="Close Room" color="warning" @click="confirmClose" />
            </q-card-section>
          </q-card>
      </q-tab-panel>
    </q-tab-panels>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import yaml from 'js-yaml' // Import js-yaml
import { useComStore } from 'src/stores/com'
import RoomToolbar from 'src/components/shared/RoomToolbar.vue'
import Results from 'src/components/room/Results.vue' // Assuming Results component exists
import { avatars } from 'src/constants'

const route = useRoute()
const router = useRouter()
const comStore = useComStore()
const $q = useQuasar()

const selectedTab = ref('questions')
const importError = ref(null)
const newQuestion = ref({
  content: '',
  answersCount: 4
})

// Colors for ColorVote answers
const colors = [
  '#5641de', '#ff3edd', '#ef1a2b', '#ff6825',
  '#F5D63D', '#7add6f', '#0dd1ff', '#c2e1f5'
]

// Watch room state to potentially switch tabs
watch(() => comStore.room?.state, (newState) => {
  if (newState) {
    selectedTab.value = newState === 'lobby' ? 'questions' : 'poll'
  }
})

// --- File Import ---
const onFileAdded = (files) => {
  importError.value = null
  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      const yml = yaml.load(evt.target.result)
      if (yml && yml.questions && Array.isArray(yml.questions)) {
        yml.questions.forEach(question => {
          // Basic validation could be added here
          comStore.addQuestion(question)
        })
        $q.notify({ type: 'positive', message: `${yml.questions.length} questions imported.` })
      } else {
        throw new Error('Invalid YAML format. Expected a "questions" array.')
      }
    } catch (e) {
      console.error("YAML Import Error:", e)
      importError.value = `Error parsing YAML: ${e.message}`
      $q.notify({ type: 'negative', message: 'Failed to import questions.' })
    }
  }
  reader.onerror = (evt) => {
    console.error("File Read Error:", evt)
    importError.value = 'Error reading file.'
    $q.notify({ type: 'negative', message: 'Error reading file.' })
  }
  reader.readAsText(files[0].__origin.file, 'UTF-8') // Access the underlying File object
}

// --- ColorVote Question ---
const addQuestion = () => {
  if (!newQuestion.value.content.trim()) {
     $q.notify({ type: 'warning', message: 'Please enter question content.' })
     return;
  }
  const question = { content: newQuestion.value.content, answers: [] }
  for (let i = 0; i < newQuestion.value.answersCount; i++) {
    // Replicating the style from the original, consider a more robust styling approach
    question.answers.push({
      content: `<div style="background-color: ${colors[i % colors.length]}; margin: -8px -8px -8px -38px; text-align: center; line-height: 20px; padding: 20px; color: white; font-size: 30px;">${i}</div>`
    })
  }
  comStore.addQuestion(question)
  // Reset form
  newQuestion.value.content = ''
  newQuestion.value.answersCount = 4
  $q.notify({ type: 'positive', message: 'ColorVote question added.' })
}

// --- Poll Tab Logic ---
const isQuestionState = computed(() => comStore.room?.state?.startsWith('q'))

const stateOptions = computed(() => {
  const options = [{ label: '<strong>Lobby</strong>', value: 'lobby' }]
  if (comStore.room?.questions) {
    comStore.room.questions.forEach((q, index) => {
      options.push({
        label: `<strong>${index + 1}.</strong> ${stripHtml(q.content)}`,
        value: `q${index}`
      })
    })
  }
  options.push({ label: '<strong>Results</strong>', value: 'results' })
  return options
})

const votersWithoutAnswer = computed(() => {
  const questionIndex = comStore.questionIndex
  if (!comStore.room?.voters || questionIndex === undefined) return []

  const currentVotes = comStore.room.questions?.[questionIndex]?.votes || {}
  const voterKeys = Object.keys(comStore.room.voters)

  return voterKeys
    // Use Object.prototype.hasOwnProperty.call for safety
    .filter(userKey => !Object.prototype.hasOwnProperty.call(currentVotes, userKey))
    .map(userKey => comStore.room.voters[userKey])
    .sort(comStore.userSorter) // Assuming userSorter exists in comStore
})

const votersByAnswer = (answerIndex) => {
  const questionIndex = comStore.questionIndex
   if (!comStore.room?.voters || questionIndex === undefined) return []

  const currentVotes = comStore.room.questions?.[questionIndex]?.votes || {}
  const participants = comStore.room.participants || {} // Use participants which should include details

  return Object.entries(currentVotes)
    // Check if vote array includes the answerIndex
    .filter(([, vote]) => vote && Array.isArray(vote) && vote.includes(answerIndex))
    .map(([userKey]) => participants[userKey]) // Get full user object
    .filter(user => !!user) // Filter out potential missing users
    .sort(comStore.userSorter)
}


// --- Utility ---
const stripHtml = (html) => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

const getAvatarUrl = (user, index) => {
  // Prioritize matricule-based image if available (like in old code)
  if (user?.matricule) {
    return `https://amc.ig.he-arc.ch/sdb/images/students/${user.matricule}.jpg`;
  }
  // Use assigned avatar or fallback to cycling through the list
  const avatarFile = user?.avatar || avatars[index % avatars.length];
  return `/images/avatars/${avatarFile}`; // Adjusted path for public folder
}


// --- Lifecycle and Room Management ---
// Close room confirmation (already existed)
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
  } else {
    // Maybe redirect to home if no room name?
    router.push({ name: 'home' })
  }
  // Set initial tab based on potential state from store
  if (comStore.room?.state) {
     selectedTab.value = comStore.room.state === 'lobby' ? 'questions' : 'poll'
  }
})

onBeforeUnmount(() => {
  // leaveRoom is likely called by the layout or App.vue now,
  // but keeping it here ensures cleanup if the component is destroyed unexpectedly.
  // Consider if this is still needed depending on overall app structure.
  // comStore.leaveRoom()
})
</script>

<style lang="scss" scoped>
// Keep existing styles or add new ones
.admin-controls {
  align-items: center;
}

// Style for q-uploader to mimic dropfiles
.q-uploader {
  border: 2px dashed $grey-5;
  min-height: 100px;
}

// Ensure tab panels take remaining height
.q-tab-panels {
  flex-grow: 1;
  display: flex; /* Allow panel content to scroll if needed */
}
.q-tab-panel {
  flex-grow: 1; /* Allow panel content to scroll if needed */
  overflow: auto; /* Add scroll for overflow */
}
</style>
