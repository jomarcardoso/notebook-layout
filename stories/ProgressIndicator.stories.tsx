import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator } from '@components/progress-indicator';

const meta = {
  title: 'Feedback/Progress Indicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Indicador de etapa que combina texto “etapa X / Y” com a linha de caderno e a barra de progresso nativa estilizada.',
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
      description: 'Etapa atual (clampado entre 0 e total).',
    },
    total: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Quantidade total de etapas.',
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
        story: 'Mostra o indicador quando a jornada já está na etapa final.',
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
          'Visual de início do fluxo, útil para validar contraste da linha e da barra com pouco preenchimento.',
      },
    },
  },
};
