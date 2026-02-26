import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton, type RadioButtonProps } from '@components/radio-button';

const meta = {
  title: 'Inputs/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Notebook-style radio button that swaps icon states instead of browser defaults.',
      },
    },
  },
  args: {
    name: 'radio-group',
    'aria-label': 'Radio option',
    theme: 'theme-base',
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['theme-base', 'theme-light', 'theme-primary'],
      description: 'Selects which global theme class is applied to preview.',
    },
    className: { control: false },
  },
  decorators: [
    (StoryFn, context) => {
      const { theme } = context.args;
      const body = document.body;

      body.classList.remove('theme-base', 'theme-light', 'theme-primary');
      body.classList.add(theme);

      return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StoryFn />
            <span style={{ fontFamily: 'var(--font-family-body)' }}>
              Example option
            </span>
          </label>
        </div>
      );
    },
  ],
} satisfies Meta<typeof RadioButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  } satisfies RadioButtonProps,
};
