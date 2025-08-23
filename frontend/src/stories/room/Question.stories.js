import { useComStore } from '../../stores/com'
import Question from '../../components/room/Question.vue'
import { mocked } from 'storybook/test'

export default {
  title: 'Room/Question',
  component: Question,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

// Single choice question (active)
export const SingleChoiceActive = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>What is the capital of France?</p>',
            answers: [
              { content: '<p>London</p>', correct: false },
              { content: '<p>Berlin</p>', correct: false },
              { content: '<p>Paris</p>', correct: true },
              { content: '<p>Madrid</p>', correct: false }
            ],
            isMultiple: false,
            stop: false
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: {},
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Single choice question with selection
export const SingleChoiceWithSelection = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>What is the capital of France?</p>',
            answers: [
              { content: '<p>London</p>', correct: false },
              { content: '<p>Berlin</p>', correct: false },
              { content: '<p>Paris</p>', correct: true },
              { content: '<p>Madrid</p>', correct: false }
            ],
            isMultiple: false,
            stop: false
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: { 0: [2] }, // Answer index 2 (Paris) is selected
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Multiple choice question (active)
export const MultipleChoiceActive = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>Which of the following are programming languages? (Select all that apply)</p>',
            answers: [
              { content: '<p>JavaScript</p>', correct: true },
              { content: '<p>HTML</p>', correct: false },
              { content: '<p>Python</p>', correct: true },
              { content: '<p>CSS</p>', correct: false },
              { content: '<p>Java</p>', correct: true }
            ],
            isMultiple: true,
            stop: false
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: {},
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Multiple choice question with selections
export const MultipleChoiceWithSelections = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>Which of the following are programming languages? (Select all that apply)</p>',
            answers: [
              { content: '<p>JavaScript</p>', correct: true },
              { content: '<p>HTML</p>', correct: false },
              { content: '<p>Python</p>', correct: true },
              { content: '<p>CSS</p>', correct: false },
              { content: '<p>Java</p>', correct: true }
            ],
            isMultiple: true,
            stop: false
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: { 0: [0, 2, 4] }, // JavaScript, Python, and Java selected
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Question stopped (disabled)
export const QuestionStopped = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>What is the capital of France?</p>',
            answers: [
              { content: '<p>London</p>', correct: false },
              { content: '<p>Berlin</p>', correct: false },
              { content: '<p>Paris</p>', correct: true },
              { content: '<p>Madrid</p>', correct: false }
            ],
            isMultiple: false,
            stop: true
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: { 0: [2] },
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Question with results
export const QuestionWithResults = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>What is the capital of France?</p>',
            answers: [
              { content: '<p>London</p>', correct: false },
              { content: '<p>Berlin</p>', correct: false },
              { content: '<p>Paris</p>', correct: true },
              { content: '<p>Madrid</p>', correct: false }
            ],
            isMultiple: false,
            stop: true,
            votesByAnswers: [2, 1, 15, 3], // Vote counts for each answer
            votesCount: 21 // Total votes
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: { 0: [2] },
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Complex question with rich HTML content
export const ComplexQuestion = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<h3>Code Review Question</h3><p>What is the output of this JavaScript code?</p><pre><code>console.log(typeof null);</code></pre>',
            answers: [
              { content: '<code>"null"</code>', correct: false },
              { content: '<code>"undefined"</code>', correct: false },
              { content: '<code>"object"</code>', correct: true },
              { content: '<code>"boolean"</code>', correct: false }
            ],
            isMultiple: false,
            stop: false
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: {},
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

// Long question with many answers
export const LongQuestionManyAnswers = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          question: {
            content: '<p>Which of the following are valid HTTP status codes?</p>',
            answers: [
              { content: '<p>200 - OK</p>', correct: true },
              { content: '<p>201 - Created</p>', correct: true },
              { content: '<p>404 - Not Found</p>', correct: true },
              { content: '<p>500 - Internal Server Error</p>', correct: true },
              { content: '<p>199 - Early Hints</p>', correct: false },
              { content: '<p>299 - Partial Content</p>', correct: false },
              { content: '<p>999 - Custom Error</p>', correct: false },
              { content: '<p>301 - Moved Permanently</p>', correct: true }
            ],
            isMultiple: true,
            stop: false
          },
          room: {
            id: 'test-room-123',
            name: 'Test Poll Room',
            state: 'q0',
          },
          answers: {},
          questionIndex: 0,
          sendAnswer: () => console.log('Mock sendAnswer called')
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}
