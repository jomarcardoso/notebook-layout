import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from '@components/section-title';

const meta = {
  title: 'Layout/SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
  args: {
    children: 'Ingredientes',
    opaque: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Heading estilizado com linhas laterais que simula a escrita em caderno. Pode receber a variante opaca para uso fora do fundo texturizado.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Texto que sera exibido com o estilo de cabecalho.',
    },
    opaque: {
      control: 'boolean',
      description: 'Aplica fundo branco e contorno solido, pensado para fundos coloridos ou fotos.',
    },
    className: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          background: 'linear-gradient(180deg, #f9f0e3 0%, #fff8f0 100%)',
          padding: '32px',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Opaque: Story = {
  args: {
    opaque: true,
    children: 'Titulo sobre foto',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#24313c' },
      ],
    },
    docs: {
      description: {
        story:
          'A variante opaca adiciona uma faixa clara que melhora a leitura sobre fundos mais escuros.',
      },
    },
  },
};

export const LongText: Story = {
  args: {
    children: 'Um titulo extenso demonstra a distribuicao da tipografia com multiplas palavras',
  },
  parameters: {
    docs: {
      description: {
        story:
          'O componente permite titulos maiores mantendo o espacamento vertical definido pela tipografia base.',
      },
    },
  },
};
