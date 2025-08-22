import VoteResultCard from '../components/shared/VoteResultCard.vue'

export default {
  title: 'Components/VoteResultCard',
  component: VoteResultCard,
  tags: ['autodocs'],
  argTypes: {
    users: {
      description: 'Array of user objects to display',
      control: { type: 'object' },
    },
    title: {
      description: 'Title to display in the card header',
      control: { type: 'text' },
    },
    answerContent: {
      description: 'Answer content (HTML) to display',
      control: { type: 'text' },
    },
    answerIndex: {
      description: 'Answer index (0-based) to display as "1.", "2.", etc.',
      control: { type: 'number' },
    },
    isCorrect: {
      description: 'Whether this answer is marked as correct',
      control: { type: 'boolean' },
    },
    emptyMessage: {
      description: 'Message to show when no users are present',
      control: { type: 'text' },
    },
    cardClass: {
      description: 'Additional CSS classes for the card',
      control: { type: 'text' },
    },
  },
}

// Sample user data for stories
const sampleUsers = [
  {
    email: 'john.doe@example.com',
    firstname: 'John',
    lastname: 'Doe',
    avatar: 'businessman.svg',
  },
  {
    email: 'jane.smith@example.com',
    firstname: 'Jane',
    lastname: 'Smith',
    avatar: 'doctor.svg',
  },
  {
    email: 'bob.wilson@example.com',
    firstname: 'Bob',
    lastname: 'Wilson',
    matricule: '12345', // This user would use matricule-based avatar
  },
]

// No Vote Card - for users who haven't voted
export const NoVote = {
  args: {
    title: 'No vote',
    users: sampleUsers,
    emptyMessage: 'Everyone has voted.',
  },
}

// Empty No Vote Card
export const NoVoteEmpty = {
  args: {
    title: 'No vote',
    users: [],
    emptyMessage: 'Everyone has voted.',
  },
}

// Answer Card with users
export const AnswerWithVotes = {
  args: {
    answerIndex: 0,
    isCorrect: true,
    answerContent: '<div style="background-color: #5641de; margin: -8px -8px -8px -38px; text-align: center; line-height: 20px; padding: 20px; color: white; font-size: 30px;">0</div>',
    users: sampleUsers.slice(0, 2), // Show only 2 users
    emptyMessage: 'No votes for this answer.',
  },
}

// Answer Card without votes
export const AnswerEmpty = {
  args: {
    answerIndex: 1,
    isCorrect: false,
    answerContent: '<div style="background-color: #ff3edd; margin: -8px -8px -8px -38px; text-align: center; line-height: 20px; padding: 20px; color: white; font-size: 30px;">1</div>',
    users: [],
    emptyMessage: 'No votes for this answer.',
  },
}

// Text-based answer (not ColorVote)
export const TextAnswer = {
  args: {
    answerIndex: 0,
    isCorrect: true,
    answerContent: '<p>This is a text-based answer option</p>',
    users: [sampleUsers[0]],
    emptyMessage: 'No votes for this answer.',
  },
}

// Card with many users (to test scrolling/layout)
export const ManyUsers = {
  args: {
    title: 'Popular Answer',
    answerIndex: 2,
    isCorrect: false,
    answerContent: '<div style="background-color: #ef1a2b; margin: -8px -8px -8px -38px; text-align: center; line-height: 20px; padding: 20px; color: white; font-size: 30px;">2</div>',
    users: [
      ...sampleUsers,
      {
        email: 'alice.brown@example.com',
        firstname: 'Alice',
        lastname: 'Brown',
        avatar: 'engineer.svg',
      },
      {
        email: 'charlie.davis@example.com',
        firstname: 'Charlie',
        lastname: 'Davis',
        avatar: 'scientist.svg',
      },
      {
        email: 'diana.miller@example.com',
        firstname: 'Diana',
        lastname: 'Miller',
        avatar: 'nurse.svg',
      },
    ],
    emptyMessage: 'No votes for this answer.',
  },
}

// Card with custom styling
export const CustomStyled = {
  args: {
    title: 'Special Answer',
    users: sampleUsers.slice(0, 1),
    cardClass: 'q-mt-md bg-blue-1',
    emptyMessage: 'No special votes.',
  },
}
