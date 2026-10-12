// notebook-layout/stories/atoms/ReaderMark.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox, Radio, Switch } from '@components/reader-marks';

const meta = {
  title: 'Atomos/Marca do leitor',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Make this recipe public',
    description: 'Anyone with the link can read it. You can change it later.',
    disabled: false,
    defaultChecked: false,
  },
  argTypes: {
    className: { control: false },
    ref: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "A reader's mark is the box, the circle or the switch a person ticks while reading or filling in a form. The input is native and covers the whole row, so the click target, the hover and the browser's focus ring are one box: the line with the mark and its label. `Checkbox` is an independent yes or no, `Radio` one choice among a few visible at once, and `Switch` a setting that takes effect immediately. Every attribute an input accepts goes to the input; `label` and `description` are tied to it by `id`. Without a label the mark stands alone in a 44px target and needs an `aria-label`.",
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Caixa: Story = {};

export const SemDescricao: Story = {
  name: 'Sem descricao',
  args: { description: '' },
};

export const Radio_: Story = {
  name: 'Radio',
  render: (args) => (
    <div>
      <Radio {...args} name="porcao" label="One portion" defaultChecked />
      <Radio {...args} name="porcao" label="Two portions" description="" />
    </div>
  ),
};

export const Interruptor: Story = {
  render: (args) => <Switch {...args} label="Notify me by e-mail" />,
};

export const SoAMarca: Story = {
  name: 'So a marca',
  args: { label: '', description: '', 'aria-label': 'Select row' },
};
