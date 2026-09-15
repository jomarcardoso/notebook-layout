// notebook-layout/stories/compositions/GrupoDeCampos.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@components/field';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'Composicoes/Grupo de campos',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A pagina de composicao divide o formulario em grupos com .fieldset: legenda em label e fg-muted, uma linha de apoio em caption, e os campos empilhados em l-stack. Entre grupos, uma unidade de ritmo. Quem governa a largura e o campo, na medida estreita. O sistema marca o opcional, nunca o obrigatorio.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DoisGrupos: Story = {
  name: 'Dois grupos',
  render: () => (
    <Sheet>
      <Group
        title="Dois grupos"
        note="Frase do leitor em manuscrita (titulo, nota) e dado em fonte de corpo (numero). A legenda nomeia o grupo; ela nao repete o rotulo de nenhum campo."
      >
        <form className="l-measure -narrow" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="fieldset">
            <legend>Sobre a receita</legend>
            <p>O titulo e a primeira coisa que aparece no seu caderno.</p>
            <div className="l-stack">
              <Field label="Titulo" defaultValue="Bolo de cenoura da vo Lurdes" />
              <Field label="Rende" type="number" defaultValue="12" hint="Em porcoes." />
              <Field label="Nota" multiline optional />
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend>Tempo</legend>
            <p>Os dois somados aparecem na ficha da receita.</p>
            <div className="l-stack">
              <Field label="Preparo" type="number" defaultValue="20" hint="Em minutos." />
              <Field label="Forno" type="number" optional hint="Em minutos." />
            </div>
          </fieldset>
        </form>
      </Group>
    </Sheet>
  ),
};
