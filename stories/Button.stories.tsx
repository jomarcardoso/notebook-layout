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
    children: (
      <>
        <IoAddCircleOutline />
        New entry
      </>
    ),
    variant: 'primary',
    fullWidth: false,
    theme: 'theme-base',
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['theme-base', 'theme-light', 'theme-primary'],
      description: 'Selects which global theme class is applied to preview.',
    },
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
    className: { control: false },
    type: { control: false },
    onClick: { control: false },
  },
  decorators: [
    (StoryFn, context) => {
      const { theme } = context.args;
      const body = document.body;

      // Remove qualquer tema anterior
      body.classList.remove('theme-base', 'theme-light', 'theme-primary');

      // Adiciona o novo tema
      body.classList.add(theme);

      return <StoryFn />;
    },
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
