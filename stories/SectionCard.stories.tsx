import type { Meta, StoryObj } from '@storybook/react';
import { SectionCard } from '@components/section-card';
import { Field } from '@components/field';

const defaultBody = (
  <div className="grid columns-1 g-2">
    <p>
      Use SectionCard para destacar blocos de conteudo em secoes maiores. O
      titulo e renderizado no topo com tipografia consistente com os demais
      elementos do layout.
    </p>
    <p>
      O corpo aceita qualquer combinacao de elementos React, incluindo listas,
      formularios e imagens.
    </p>
  </div>
);

const meta = {
  title: 'Layout/SectionCard',
  component: SectionCard,
  tags: ['autodocs'],
  args: {
    title: 'Informacoes em destaque',
    children: defaultBody,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cartao com titulo alinhado ao grid principal do notebook. Ideal para separar conjuntos de dados dentro de uma mesma pagina.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    className: { control: false },
    title: {
      control: 'text',
      description: 'Texto exibido na faixa superior do cartao.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'O corpo pode ser renderizado sem cabecalho quando o destaque nao for necessario.',
      },
    },
  },
};

export const WithFormFields: Story = {
  args: {
    title: 'Campos do passo',
  },
  render: (args) => (
    <SectionCard {...args}>
      <div className="grid columns-1 g-2">
        <Field label="Tempo de preparo" placeholder="45 minutos" />
        <Field label="Rendimento" placeholder="8 porcoes" />
        <Field
          label="Observacoes"
          multiline
          minRows={2}
          placeholder="Inclua truques ou variacoes do preparo."
        />
      </div>
    </SectionCard>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de combinacao direta com Fields para montar um bloco de formulario.',
      },
    },
  },
};
