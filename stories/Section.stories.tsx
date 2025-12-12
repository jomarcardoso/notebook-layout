import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '@components/section';
import { Field } from '@components/field';
import { SectionCard } from '@components/section-card';

const textBlock = (
  <div className="grid columns-1 g-2">
    <p>
      Estrutura usada para separar conteudos em paginas de receita, aplicando o
      mesmo espaco das paginas ilustradas.
    </p>
    <p>
      Combine com `SectionTitle`, `SectionCard` ou `Field` para manter o layout
      coerente em diferentes contextos.
    </p>
  </div>
);

const meta = {
  title: 'Layout/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Container vertical que agrupa trechos de conteudo em uma grade de uma coluna, mantendo margens e tipografia do tema notebook.',
      },
    },
  },
  args: {
    header: 'Resumo da receita',
    children: textBlock,
  },
  argTypes: {
    children: { control: false },
    className: { control: false },
    onBgWhite: {
      control: 'boolean',
      description:
        'Usa tipografia neutra (h2) pensada para fundos claros, sem textura do caderno.',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnWhiteBackground: Story = {
  args: {
    onBgWhite: true,
    header: 'Chamado em fundo claro',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Quando `onBgWhite` esta ativo o titulo usa uma heading padrao, ideal para paginas sem textura de papel.',
      },
    },
  },
};

export const WithoutTitle: Story = {
  args: {
    header: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'O componente aceita conteudo sem titulo mantendo o espaco.',
      },
    },
  },
};

export const WithInteractiveContent: Story = {
  args: {
    header: 'Detalhes da etapa',
  },
  render: (args) => (
    <Section {...args}>
      <SectionCard header="Informacoes principais">
        <div className="grid columns-1 g-2">
          <Field label="Titulo" placeholder="Bolo de chocolate" />
          <Field
            label="Ingredientes"
            multiline
            minRows={2}
            placeholder="2 xicaras de farinha, 1 xicara de acucar..."
          />
          <Field
            label="Observacoes"
            multiline
            minRows={3}
            onErase={() => undefined}
            placeholder="Anote variacoes, substituicoes ou observacoes de preparo."
          />
        </div>
      </SectionCard>
    </Section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Mostra como combinar Section com SectionCard e Fields para construir um fluxo completo de formulario.',
      },
    },
  },
};
