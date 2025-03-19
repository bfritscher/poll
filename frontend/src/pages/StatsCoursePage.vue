<template>
  <q-page class="q-pa-md">
    <div class="row justify-between items-center q-mb-lg">
      <div class="text-h4">{{ courseName }} Statistics</div>
      <q-btn color="primary" icon="home" to="/" label="Home" />
    </div>

    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner size="3em" color="primary" />
      <div class="q-mt-sm">Loading statistics...</div>
    </div>

    <template v-else>
      <!-- Course Summary -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">Course Summary</div>
          <div class="row q-mt-md q-col-gutter-md">
            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat class="text-center bg-blue-1">
                <q-card-section>
                  <div class="text-subtitle1">Sessions</div>
                  <div class="text-h4">{{ courseStats.sessionCount || 0 }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat class="text-center bg-green-1">
                <q-card-section>
                  <div class="text-subtitle1">Participants</div>
                  <div class="text-h4">{{ courseStats.participantCount || 0 }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat class="text-center bg-orange-1">
                <q-card-section>
                  <div class="text-subtitle1">Questions</div>
                  <div class="text-h4">{{ courseStats.questionCount || 0 }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-3 col-sm-6 col-xs-12">
              <q-card flat class="text-center bg-purple-1">
                <q-card-section>
                  <div class="text-subtitle1">Avg. Correct</div>
                  <div class="text-h4">{{ formatPercentage(courseStats.averageScore) }}%</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Sessions List -->
      <q-card>
        <q-card-section>
          <div class="text-h6">Sessions</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-table
            :rows="sessions"
            :columns="columns"
            row-key="name"
            :pagination="{ rowsPerPage: 0 }"
          >
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  icon="visibility"
                  @click="viewSession(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const sessions = ref([])
const courseStats = ref({})

const courseName = computed(() => route.params.name)

// Table columns definition
const columns = [
  { name: 'name', label: 'Session Name', field: 'name', align: 'left', sortable: true },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  {
    name: 'participants',
    label: 'Participants',
    field: 'participantCount',
    align: 'center',
    sortable: true,
  },
  {
    name: 'questions',
    label: 'Questions',
    field: 'questionCount',
    align: 'center',
    sortable: true,
  },
  {
    name: 'avgScore',
    label: 'Avg. Score',
    field: 'averageScore',
    align: 'center',
    sortable: true,
    format: (val) => `${formatPercentage(val)}%`,
  },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
]

// Format percentage for display
function formatPercentage(value) {
  if (value === undefined || value === null) return '0'
  return Math.round(value * 100)
}

// View details of a specific session
function viewSession(session) {
  if (session && session.name) {
    router.push({ name: 'admin', params: { name: session.name } })
  }
}

// Load course statistics
function loadCourseStats() {
  loading.value = true

  // In a real implementation, you would fetch this data from your backend
  // For now, we'll simulate the data
  setTimeout(() => {
    courseStats.value = {
      sessionCount: 12,
      participantCount: 127,
      questionCount: 48,
      averageScore: 0.67,
    }

    sessions.value = [
      {
        name: 'Quiz 1',
        date: '2023-09-15',
        participantCount: 25,
        questionCount: 10,
        averageScore: 0.72,
      },
      {
        name: 'Quiz 2',
        date: '2023-09-22',
        participantCount: 23,
        questionCount: 8,
        averageScore: 0.68,
      },
      {
        name: 'Final Test',
        date: '2023-10-05',
        participantCount: 24,
        questionCount: 15,
        averageScore: 0.65,
      },
    ]

    loading.value = false
  }, 1000)
}

onMounted(() => {
  loadCourseStats()
})
</script>
