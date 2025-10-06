import type { Meta, StoryObj } from '@storybook/react';
import { IoAddCircleOutline, IoSaveOutline } from 'react-icons/io5';
import { Button } from '@components/button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Primary call to action styled to match the notebook look and feel. Provides size control through `fullWidth`, tone adjustments via `contrast`, and a secondary palette for less prominent actions.',
      },
    },
  },
  args: {
    children: 'Add recipe',
    variant: 'primary',
    fullWidth: false,
    contrast: 'white',
    onClick: () => {},
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description:
        'Switches between the primary (orange) and secondary (dark) palettes.',
    },
    fullWidth: {
      control: 'boolean',
      description:
        'Expands the button to occupy the full width of its container.',
    },
    contrast: {
      control: 'radio',
      options: ['white', 'light', 'dark'],
      description:
        'Adjusts text and background treatment depending on where the button sits (paper texture, light cards, or dark imagery).',
    },
    className: { control: false },
    type: { control: false },
    onClick: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Share recipe',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Submit form',
    contrast: 'light',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Full-width layout pairs well with stacked forms and dialog actions where horizontal space is limited.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <IoAddCircleOutline />
        New entry
      </>
    ),
  },
};

export const OnDarkSurface: Story = {
  args: {
    contrast: 'dark',
    variant: 'secondary',
    children: (
      <>
        <IoSaveOutline />
        Save changes
      </>
    ),
  },
  decorators: [
    (StoryFn) => (
      <div
        style={{
          background: '#1f2a33',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <StoryFn />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Use `contrast="dark"` when placing the button over photography or dark blocks so the orange and dark variants stay legible.',
      },
    },
  },
};
