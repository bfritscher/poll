<template>
  <q-scroll-area class="bg-grey-2" style="height: calc(100vh - 50px)">
    <div class="q-pa-md">
      <!-- Question content -->
      <div class="question-content q-mb-md" v-html="comStore.question?.content"></div>

      <!-- Answer options -->
      <div v-for="(answer, index) in comStore.question?.answers" :key="index">
        <div class="answer q-mb-md" :class="{ selected: exists(index) }">
          <div
            v-ripple
            class="answer-content row align-start q-pt-sm q-pb-sm q-pr-sm"
            :class="{ disabled: !!comStore.question?.stop }"
            @click="toggleAnswer(index)"
          >
            <div>
              <q-checkbox
                :disable="!!comStore.question?.stop"
                :model-value="exists(index)"
                @update:model-value="toggleAnswer(index)"
              />
            </div>
            <div class="col-grow" v-html="answer.content"></div>
          </div>

          <!-- Results bar -->
          <div v-if="comStore.question?.votesByAnswers" class="answer-result row items-center">
            <div
              class="answer-result-bar"
              :class="{
                'answer-correct': answer.correct,
                'answer-wrong': !answer.correct,
              }"
              :style="{
                width: `${
                  (comStore.question.votesByAnswers[index] / comStore.question.votesCount) * 100
                }%`,
              }"
            ></div>
            <div class="answer-result-text">
              {{ comStore.question.votesByAnswers[index] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-scroll-area>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useComStore } from 'src/stores/com'

const comStore = useComStore()

// Check if an answer has been selected
function exists(answerIndex) {
  const qIndex = comStore.questionIndex
  if (qIndex !== undefined && comStore.answers[qIndex]) {
    return comStore.answers[qIndex].indexOf(answerIndex) > -1
  }
  return false
}

// Toggle an answer
function toggleAnswer(answerIndex) {
  if (
    answerIndex < 0 ||
    !comStore.question?.answers ||
    answerIndex >= comStore.question.answers.length
  ) {
    return
  }

  // Don't allow changes if question is stopped
  if (comStore.question?.stop) {
    return
  }

  // Don't allow changes after results are shown
  if (comStore.question.votesByAnswers) {
    return
  }

  const qIndex = comStore.questionIndex

  if (qIndex !== undefined) {
    let answer = comStore.answers[qIndex] || []

    if (comStore.question.isMultiple) {
      // For multiple choice: toggle the answer
      const i = answer.indexOf(answerIndex)
      if (i > -1) {
        answer.splice(i, 1)
      } else {
        answer.push(answerIndex)
      }
    } else {
      // For single choice: replace the answer
      answer = [answerIndex]
    }

    // Save the answer
    if (!comStore.answers[qIndex]) {
      comStore.answers[qIndex] = []
    }
    comStore.answers[qIndex] = answer

    // Send to server
    comStore.sendAnswer(answer)
  }
}

// Handle keyboard shortcuts for selecting answers
function handleSelectAnswer(event) {
  if (event.detail && typeof event.detail.index === 'number') {
    toggleAnswer(event.detail.index)
  }
}

onMounted(() => {
  window.addEventListener('select-answer', handleSelectAnswer)
})

onUnmounted(() => {
  window.removeEventListener('select-answer', handleSelectAnswer)
})
</script>

<style lang="scss" scoped>
.question-content {
  font-weight: bold;
  font-size: 18pt;
  overflow: hidden;
  padding: 16px;
}

.answer {
  background-color: white;
  border-radius: 4px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  overflow: hidden;

  &.selected {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    transform: translateY(-1px);
  }
}

.answer-content {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  font-size: 16pt;

  &.disabled {
    cursor: default;
    opacity: 0.7;
  }
}

.answer-result-bar {
  min-width: 20px;
  height: 20px;
  transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.answer-result-text {
  font-weight: bold;
  margin-left: 8px;
}

.answer-correct {
  background-color: #4caf50;
}

.answer-wrong {
  background-color: #f44336;
}

.answer-result {
  height: 20px;
  padding: 0 8px;
}
</style>
