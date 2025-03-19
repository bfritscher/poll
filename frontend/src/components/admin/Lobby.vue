<template>
  <div class="full-height row">
    <!-- Participants list section -->
    <div class="col-md-4 bg-grey-2">
      <q-scroll-area class="full-height">
        <q-list>
          <q-item-label header>Participants ({{ participantsCount }})</q-item-label>
          <template v-for="(user, index) in orderedVoters" :key="user.email">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img 
                    :src="`/images/avatars/${user.avatar || avatarsStore.icons[index % avatarsStore.icons.length]}`" 
                    :alt="`Avatar of ${user.firstname} ${user.lastname}`"
                  />
                </q-avatar>
              </q-item-section>
              
              <q-item-section>
                <q-item-label>{{ user.firstname }} {{ user.lastname }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </div>

    <!-- Questions management section -->
    <div class="col-md-8">
      <q-scroll-area class="full-height">
        <div class="q-pa-md">
          <div class="row items-center q-mb-md">
            <div class="text-h6 col">Questions ({{ questionsCount }})</div>
            <div class="col-auto">
              <q-btn color="primary" icon="add" label="Add Question" @click="showQuestionForm" />
            </div>
          </div>

          <q-list bordered separator>
            <q-item v-for="(question, index) in comStore.room?.questions" :key="index">
              <q-item-section>
                <q-item-label>
                  <span class="text-bold">{{ index + 1 }}.</span> 
                  <span v-html="truncateContent(question.content)"></span>
                </q-item-label>
                <q-item-label caption v-if="question.isMultiple">
                  Multiple answers
                </q-item-label>
              </q-item-section>
              
              <q-item-section side>
                <q-btn dense flat round color="primary" icon="play_arrow" @click="showQuestion(index)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </div>

    <!-- Add Question Dialog -->
    <q-dialog v-model="questionDialog" persistent>
      <q-card style="width: 700px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Add Question</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="submitQuestion">
            <q-input
              v-model="newQuestion.content"
              label="Question content"
              type="textarea"
              autofocus
              :rules="[val => !!val || 'Question is required']"
            />
            
            <div class="q-mt-md text-subtitle1">Answers</div>
            <div 
              v-for="(answer, index) in newQuestion.answers" 
              :key="index"
              class="q-mb-sm row items-center"
            >
              <div class="col-9">
                <q-input
                  v-model="answer.content"
                  :label="`Answer ${index + 1}`"
                  :rules="[val => !!val || 'Answer is required']"
                  dense
                />
              </div>
              <div class="col-2 q-ml-md">
                <q-checkbox v-model="answer.correct" label="Correct" />
              </div>
              <div class="col-auto q-ml-sm">
                <q-btn
                  v-if="index > 1"
                  flat
                  dense
                  round
                  color="negative"
                  icon="delete"
                  @click="removeAnswer(index)"
                />
              </div>
            </div>
            
            <div class="q-mt-md">
              <q-btn
                color="secondary"
                icon="add"
                label="Add Answer"
                @click="addAnswer"
              />
            </div>
            
            <div class="q-mt-md">
              <q-toggle
                v-model="newQuestion.isMultiple"
                label="Multiple answers allowed"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="submitQuestion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useComStore } from 'src/stores/com-store'
import { useAvatarsStore } from 'src/services/avatars'

const comStore = useComStore()
const avatarsStore = useAvatarsStore()
const questionDialog = ref(false)

// Question form data
const newQuestion = ref({
  content: '',
  answers: [
    { content: '', correct: false },
    { content: '', correct: false }
  ],
  isMultiple: false
})

// Reset question form
function resetQuestionForm() {
  newQuestion.value = {
    content: '',
    answers: [
      { content: '', correct: false },
      { content: '', correct: false }
    ],
    isMultiple: false
  }
}

// Show the question form dialog
function showQuestionForm() {
  resetQuestionForm()
  questionDialog.value = true
}

// Add a new answer field
function addAnswer() {
  newQuestion.value.answers.push({ content: '', correct: false })
}

// Remove an answer field
function removeAnswer(index) {
  newQuestion.value.answers.splice(index, 1)
}

// Submit the question to the server
function submitQuestion() {
  // Validate the form
  if (!newQuestion.value.content) {
    return
  }
  
  for (const answer of newQuestion.value.answers) {
    if (!answer.content) {
      return
    }
  }
  
  // If the question is not multiple choice, ensure only one answer is marked as correct
  if (!newQuestion.value.isMultiple) {
    const correctAnswers = newQuestion.value.answers.filter(a => a.correct)
    if (correctAnswers.length > 1) {
      // If multiple answers are marked correct, keep only the first one
      for (let i = 1; i < correctAnswers.length; i++) {
        correctAnswers[i].correct = false
      }
    }
  }
  
  // Submit to server
  comStore.addQuestion({ ...newQuestion.value })
  
  // Close the dialog and reset form
  questionDialog.value = false
  resetQuestionForm()
}

// Show a specific question
function showQuestion(index) {
  comStore.setState(`q${index}`)
}

// Truncate content for display
function truncateContent(content) {
  if (!content) return ''
  
  content = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  if (content.length > 50) {
    return content.substring(0, 50) + '...'
  }
  return content
}

// Computed properties
const participantsCount = computed(() => 
  comStore.room?.voters ? Object.keys(comStore.room.voters).length : 0
)

const questionsCount = computed(() => 
  comStore.room?.questions ? comStore.room.questions.length : 0
)

const orderedVoters = computed(() => {
  if (!comStore.room?.voters) return []
  
  return Object.values(comStore.room.voters)
    .sort(comStore.userSorter)
})
</script>