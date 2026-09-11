import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '@components/section';
import { Field } from '@components/field';

const textBlock = (
  <>
    <p className="p">
      Estrutura usada para separar conteudos em paginas de receita, aplicando o
      mesmo espaco das paginas ilustradas.
    </p>
    <p className="p">
      Combine com `SectionTitle` ou `Field` para manter o layout coerente em
      diferentes contextos.
    </p>
  </>
);

const meta = {
  title: 'Layout/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Uma secao da pagina: cabecalho conforme a escada de secao, corpo empilhado em multiplos da unidade de ritmo. Nunca troca superficie e nunca leva faixa.',
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
      <Section header="Informacoes principais">
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
      </Section>
    </Section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Mostra como aninhar secoes e Fields para construir um fluxo completo de formulario.',
      },
    },
  },
};
