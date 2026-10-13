// notebook-layout/stories/compositions/FieldGroup.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from '@components/field';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'Compositions/Field group',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The composition page splits the form into groups with .fieldset: legend in label and fg-muted, a supporting line in caption, and the fields stacked in l-stack. Between groups, one rhythm unit. The field governs the width, at the narrow measure. The system marks the optional, never the required.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoGroups: Story = {
  name: 'Two groups',
  render: () => (
    <Sheet>
      <Group
        title="Two groups"
        note="The reader's phrase in handwriting (title, note) and data in body type (number). The legend names the group; it does not repeat any field's label."
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
