<template>
  <div class="full-height row">
    <!-- Results view area (same as participant view) -->
    <div class="col-md-6">
      <results-component />
    </div>

    <!-- Extended stats area -->
    <div class="col-md-6 bg-grey-2">
      <q-scroll-area class="full-height">
        <div class="q-pa-md">
          <div class="text-h6 q-mb-md">Question Summary</div>

          <div v-if="comStore.room?.questions">
            <q-list bordered>
              <template v-for="(question, qIndex) in comStore.room.questions" :key="qIndex">
                <q-expansion-item :label="`Question ${qIndex + 1}`" header-class="bg-grey-3">
                  <q-card>
                    <q-card-section>
                      <div class="q-mb-md" v-html="question.content"></div>

                      <div class="row q-col-gutter-md">
                        <div
                          v-for="(answer, aIndex) in question.answers"
                          :key="aIndex"
                          class="col-md-6 col-xs-12"
                        >
                          <q-card
                            flat
                            :class="{
                              'bg-green-1': answer.correct,
                              'bg-red-1': !answer.correct && answer.userCount > 0,
                            }"
                          >
                            <q-card-section>
                              <div class="text-body2" v-html="answer.content"></div>

                              <q-linear-progress
                                :value="getAnswerPercentage(question, aIndex)"
                                class="q-mt-sm"
                                size="20px"
                                :color="answer.correct ? 'positive' : 'negative'"
                                track-color="grey-3"
                              >
                                <div class="absolute-full flex flex-center">
                                  <q-badge color="transparent" text-color="white">
                                    {{ getAnswerCount(question, aIndex) }} votes ({{
                                      formatPercentage(getAnswerPercentage(question, aIndex))
                                    }}%)
                                  </q-badge>
                                </div>
                              </q-linear-progress>
                            </q-card-section>
                          </q-card>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </template>
            </q-list>
          </div>

          <!-- Export options -->
          <div class="q-mt-lg">
            <q-btn color="secondary" icon="save" label="Export Results" @click="exportResults" />
            <q-btn
              class="q-ml-md"
              :to="`/stats/course/${comStore.room?.course}`"
              color="primary"
              icon="analytics"
              label="Course Statistics"
            />
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup>
import { useComStore } from 'src/stores/com'
import ResultsComponent from 'src/components/room/Results.vue'

const comStore = useComStore()

// Calculate the percentage of votes for an answer
function getAnswerPercentage(question, answerIndex) {
  if (!question || !question.votes) return 0

  const totalVotes = Object.keys(question.votes).length
  if (totalVotes === 0) return 0

  let count = 0
  for (const email in question.votes) {
    if (question.votes[email].indexOf(answerIndex) !== -1) {
      count++
    }
  }

  return count / totalVotes
}

// Get the number of votes for an answer
function getAnswerCount(question, answerIndex) {
  if (!question || !question.votes) return 0

  let count = 0
  for (const email in question.votes) {
    if (question.votes[email].indexOf(answerIndex) !== -1) {
      count++
    }
  }

  return count
}

// Format percentage for display
function formatPercentage(value) {
  return Math.round(value * 100)
}

// Export results to CSV
function exportResults() {
  if (!comStore.room) return

  // Create CSV content
  let csvContent = 'data:text/csv;charset=utf-8,'

  // Header row
  csvContent += 'Email,Name,Score\n'

  // Data rows
  if (comStore.results) {
    comStore.results.forEach((result) => {
      const row = [
        result.user.email,
        `${result.user.firstname} ${result.user.lastname}`,
        result.score,
      ]
      csvContent += row.join(',') + '\n'
    })
  }

  // Trigger download
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `${comStore.room.name}_results.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
