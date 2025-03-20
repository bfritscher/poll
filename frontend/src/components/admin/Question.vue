<template>
  <div class="full-height row">
    <!-- Question view area (same as participant view) -->
    <div class="col-md-8">
      <question-component />
    </div>

    <!-- Admin controls area -->
    <div class="col-md-4 bg-grey-2 q-pa-md">
      <div class="text-h6 q-mb-md">Controls</div>

      <q-list bordered separator>
        <q-item>
          <q-item-section>
            <q-item-label>Show results to students</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle v-model="showResults" color="primary" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>Allow voting</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-toggle v-model="allowVoting" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Real-time vote chart -->
      <div class="q-mt-md">
        <div class="text-subtitle1">Vote distribution</div>
        <div v-if="comStore.question?.answers" class="vote-chart q-mt-md">
          <div
            v-for="(answer, index) in comStore.question.answers"
            :key="index"
            class="vote-bar-container q-mb-xs"
          >
            <div class="vote-label">{{ index + 1 }}</div>
            <div class="vote-bar-wrapper">
              <div
                class="vote-bar"
                :class="{ 'vote-correct': answer.correct }"
                :style="{ width: `${calculatePercentage(index)}%` }"
              ></div>
            </div>
            <div class="vote-count">
              {{ getVoteCount(index) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useComStore } from 'src/stores/com'
import QuestionComponent from 'src/components/room/Question.vue'

const comStore = useComStore()

// Control for showing results
const showResults = computed({
  get: () => {
    return !!comStore.question?.votesByAnswers
  },
  set: (value) => {
    if (value) {
      // Show results
      comStore.setState('r' + comStore.questionIndex)
    } else {
      // Hide results
      comStore.setState('q' + comStore.questionIndex)
    }
  },
})

// Control for allowing voting
const allowVoting = computed({
  get: () => {
    return !comStore.question?.stop
  },
  set: (value) => {
    // Update the question stop property
    if (comStore.question) {
      const questionIndex = comStore.questionIndex
      if (questionIndex !== undefined) {
        const state = value ? { stop: false } : { stop: true }

        comStore.setState({
          ...state,
          question: questionIndex,
        })
      }
    }
  },
})

// Get vote count for a specific answer
function getVoteCount(answerIndex) {
  if (comStore.question?.votesByAnswers) {
    return comStore.question.votesByAnswers[answerIndex] || 0
  }

  // Count votes manually from room.questions
  let count = 0
  if (comStore.room?.questions) {
    const qIndex = comStore.questionIndex
    if (qIndex !== undefined) {
      const question = comStore.room.questions[qIndex]
      if (question && question.votes) {
        for (const email in question.votes) {
          if (question.votes[email].indexOf(answerIndex) !== -1) {
            count++
          }
        }
      }
    }
  }

  return count
}

// Calculate the percentage of votes for a specific answer
function calculatePercentage(answerIndex) {
  const total = comStore.question?.votesCount || 0
  if (!total) return 0

  const count = getVoteCount(answerIndex)
  return (count / total) * 100
}
</script>

<style lang="scss" scoped>
.vote-bar-container {
  display: flex;
  align-items: center;
}

.vote-label {
  width: 20px;
  text-align: center;
  font-weight: bold;
}

.vote-bar-wrapper {
  flex: 1;
  background-color: #e0e0e0;
  height: 25px;
  margin: 0 10px;
  border-radius: 4px;
  overflow: hidden;
}

.vote-bar {
  height: 100%;
  background-color: #2196f3;
  transition: width 0.5s ease-out;

  &.vote-correct {
    background-color: #4caf50;
  }
}

.vote-count {
  width: 30px;
  text-align: right;
  font-weight: bold;
}
</style>
