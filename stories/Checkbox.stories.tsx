import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, type CheckboxProps } from '@components/checkbox';

const meta = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Rounded notebook-style checkbox that swaps between illustrated icons instead of the browser default. Works with both controlled and uncontrolled React forms.',
      },
    },
  },
  args: {
    'aria-label': 'Item checkbox',
    theme: 'theme-base',
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['theme-base', 'theme-light', 'theme-primary'],
      description: 'Selects which global theme class is applied to preview.',
    },
    className: { control: false },
    onChange: {
      description:
        'Triggered whenever the user toggles the checkbox. Provide your own handler when using the controlled pattern.',
    },
  },
  decorators: [
    (StoryFn, context) => {
      const { theme } = context.args;
      const body = document.body;

      // Remove qualquer tema anterior
      body.classList.remove('theme-base', 'theme-light', 'theme-primary');

      // Adiciona o novo tema
      body.classList.add(theme);

      return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StoryFn />
            <span style={{ fontFamily: 'var(--font-family-body)' }}>
              Example label
            </span>
          </label>
        </div>
      );
    },
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
