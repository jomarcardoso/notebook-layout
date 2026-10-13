// notebook-layout/stories/Section.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '@components/section';
import { Field } from '@components/field';

const textBlock = (
  <>
    <p className="body">
      Estrutura usada para separar conteudos em paginas de receita, aplicando o
      mesmo espaco das paginas ilustradas.
    </p>
    <p className="body">
      Combine com `.section-title` ou `Field` para manter o layout coerente em
      diferentes contextos.
    </p>
  </>
);

const meta = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A section of the page: header following the section ladder, body stacked in multiples of the rhythm unit. It never changes surface and never carries a band.',
      },
    },
  },
  args: {
    title: 'Resumo da receita',
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
    title: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The component accepts content without a title while keeping the space.',
      },
    },
  },
};

export const WithInteractiveContent: Story = {
  args: {
    title: 'Detalhes da etapa',
  },
  render: (args) => (
    <Section {...args}>
      <Section title="Informacoes principais">
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
          'Shows how to nest sections and Fields to build a complete form flow.',
      },
    },
  },
};
