// notebook-layout/stories/ProgressIndicator.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator } from '@components/progress-indicator';

const meta = {
  title: 'Components/Progress indicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Step indicator with the same shape as the Progress atom: “Etapa” and “X de Y” in caption and fg-muted, the number in tabular figures at the end of the line, and below it the CoreUI bar (.progress) with the track in rule and the advance in neutral-solid.',
      },
    },
  },
  args: {
    current: 2,
    total: 5,
    className: '',
  },
  argTypes: {
    current: {
      control: { type: 'range', min: 0, max: 10, step: 1 },
      description: 'Current step (clamped between 0 and total).',
    },
    total: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Total number of steps.',
    },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LastStep: Story = {
  args: {
    current: 5,
    total: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the indicator when the journey is already at the final step.',
      },
    },
  },
};

export const EarlyStep: Story = {
  args: {
    current: 1,
    total: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The start of the flow, useful to check the contrast of the line and of the bar with little fill.',
      },
    },
  },
};
