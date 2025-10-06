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
    onChange: () => {},
  },
  argTypes: {
    className: { control: false },
    onChange: {
      description:
        'Triggered whenever the user toggles the checkbox. Provide your own handler when using the controlled pattern.',
    },
  },
  decorators: [
    (StoryFn) => (
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <StoryFn />
          <span style={{ fontFamily: 'var(--font-family-text)' }}>Example label</span>
        </label>
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `defaultChecked` for uncontrolled forms where the initial state should be marked.',
      },
    },
  },
};

export const Controlled: Story = {
  args: {
    onChange: undefined,
  },
  render: (args) => {
    const [checked, setChecked] = useState(true);

    const handleChange: CheckboxProps['onChange'] = (event) => {
      setChecked(event.currentTarget.checked);
    };

    return <Checkbox {...args} checked={checked} onChange={handleChange} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows how to wire the checkbox to component state using the `checked` and `onChange` props.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    onChange: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled checkboxes keep the illustrated style while preventing interaction.',
      },
    },
  },
};
