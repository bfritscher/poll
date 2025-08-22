import { useComStore } from '../../stores/com'
import Results from '../../components/room/Results.vue'
import { mocked } from 'storybook/test'

export default {
  title: 'Room/Results',
  component: Results,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export const Default = {}

export const SingleWinner = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          results: [
              {
                user: {
                  email: 'alice.brown@example.com',
                  firstname: 'Alice',
                  lastname: 'Brown',
                  avatar: 'teacher.svg',
                },
                score: 100,
              },
            ],
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

export const TwoParticipants = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          results: [
              {
                user: {
                  email: 'alice.brown@example.com',
                  firstname: 'Alice',
                  lastname: 'Brown',
                  avatar: 'teacher.svg',
                },
                score: 95.5,
              },
              {
                user: {
                  email: 'bob.wilson@example.com',
                  firstname: 'Bob',
                  lastname: 'Wilson',
                  avatar: 'engineer.svg',
                },
                score: 87.2,
              },
            ],
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

export const CloseScores = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          results:  [
              {
                user: {
                  email: 'alice.brown@example.com',
                  firstname: 'Alice',
                  lastname: 'Brown',
                  avatar: 'teacher.svg',
                },
                score: 85.1,
              },
              {
                user: {
                  email: 'bob.wilson@example.com',
                  firstname: 'Bob',
                  lastname: 'Wilson',
                  avatar: 'engineer.svg',
                },
                score: 85.0,
              },
              {
                user: {
                  email: 'charlie.davis@example.com',
                  firstname: 'Charlie',
                  lastname: 'Davis',
                  avatar: 'chef.svg',
                },
                score: 84.9,
              },
            ]
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

export const ManyParticipants = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          results:  [
              {
                user: {
                  email: 'alice.brown@example.com',
                  firstname: 'Alice',
                  lastname: 'Brown',
                  avatar: 'teacher.svg',
                },
                score: 95.5,
              },
              {
                user: {
                  email: 'bob.wilson@example.com',
                  firstname: 'Bob',
                  lastname: 'Wilson',
                  avatar: 'engineer.svg',
                },
                score: 87.2,
              },
              {
                user: {
                  email: 'john.doe@example.com',
                  firstname: 'John',
                  lastname: 'Doe',
                  avatar: 'businessman.svg',
                },
                score: 82.1,
              },
              {
                user: {
                  email: 'jane.smith@example.com',
                  firstname: 'Jane',
                  lastname: 'Smith',
                  avatar: 'nurse.svg',
                },
                score: 78.9,
              },
              {
                user: {
                  email: 'charlie.davis@example.com',
                  firstname: 'Charlie',
                  lastname: 'Davis',
                  avatar: 'chef.svg',
                },
                score: 72.4,
              },
              {
                user: {
                  email: 'diana.garcia@example.com',
                  firstname: 'Diana',
                  lastname: 'Garcia',
                  avatar: 'scientist.svg',
                },
                score: 68.7,
              },
              {
                user: {
                  email: 'eve.martinez@example.com',
                  firstname: 'Eve',
                  lastname: 'Martinez',
                  avatar: 'pilot.svg',
                },
                score: 65.3,
              },
              {
                user: {
                  email: 'frank.rodriguez@example.com',
                  firstname: 'Frank',
                  lastname: 'Rodriguez',
                  avatar: 'detective.svg',
                },
                score: 61.8,
              },
            ],
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

export const NoAvatars = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          results: [
              {
                user: {
                  email: 'alice.brown@example.com',
                  firstname: 'Alice',
                  lastname: 'Brown',
                },
                score: 95.5,
              },
              {
                user: {
                  email: 'bob.wilson@example.com',
                  firstname: 'Bob',
                  lastname: 'Wilson',
                },
                score: 87.2,
              },
              {
                user: {
                  email: 'charlie.davis@example.com',
                  firstname: 'Charlie',
                  lastname: 'Davis',
                },
                score: 72.4,
              },
            ],
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}

export const EmptyResults = {
  decorators: [
    () => ({
      setup() {
        mocked(useComStore).mockReturnValue({
          results: [],
        })
        return {}
      },
      template: '<story/>',
    }),
  ],
}
