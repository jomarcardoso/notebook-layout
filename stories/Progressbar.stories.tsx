import type { Meta, StoryObj } from '@storybook/react';
import { Progressbar } from '@components/progressbar';

const meta = {
  title: 'Feedback/Progressbar',
  component: Progressbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Wrapper simples para o elemento nativo `<progress>`, com visual do notebook: trilha clara com borda e sombra interna e preenchimento na cor primária.',
      },
    },
  },
  args: {
    value: 40,
    max: 100,
    className: '',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Valor atual do progresso.',
    },
    max: {
      control: { type: 'number', min: 1, max: 200, step: 1 },
      description: 'Valor máximo a ser atingido.',
    },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progressbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NearComplete: Story = {
  args: {
    value: 85,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mostra o preenchimento quase completo, mantendo trilha clara e borda visível.',
      },
    },
  },
};

export const MinimalProgress: Story = {
  args: {
    value: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado inicial com pouco preenchimento para checar contraste em barras curtas.',
      },
    },
  },
};
