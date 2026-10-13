// notebook-layout/stories/atoms/Box.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atoms/Box',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The box (.box) is the only content surface of the system: the strong wash, bg-muted, no radius, no border and no shadow. It holds an aside or a set that is read together. It is not clickable: a box that leads somewhere is a card by another name. The space around it is flow and comes from the page; the space inside is the inner scale.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Aside: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Aside"
        note="Inside the prose, at the body measure. The text inside stays in body; the link inside it uses the alpha hover, which darkens over the wash without a new token."
      >
        <div className="l-measure l-stack">
          <p className="body">
            Rale as cenouras no ralo fino e bata com os ovos e o oleo ate a
            mistura ficar lisa e alaranjada.
          </p>
          <aside className="box l-stack -block" aria-label="Dica">
            <p className="label">Dica da vo</p>
            <p className="body">
              Cenoura muito grande e fibrosa deixa o bolo pesado. Prefira as
              medias e, se puder, use a <a href="#">farinha peneirada duas
              vezes</a>.
            </p>
          </aside>
          <p className="body">
            Junte a farinha e o acucar aos poucos, mexendo com a espatula, e por
            ultimo o fermento.
          </p>
        </div>
      </Group>
    </Sheet>
  ),
};

export const BoxOrCallout: Story = {
  name: 'Box or callout',
  render: () => (
    <Sheet>
      <Group
        title="Box or callout"
        note="Both set an aside apart, with different strengths. The callout is a rule on the edge and has no surface; the box is material of another kind. By the separation ladder, the callout comes first: use the box when the aside has more than one block or must be read as a set."
      >
        <Row label="callout">
          <div className="callout l-measure">
            <p className="body">
              Nao abra o forno nos primeiros vinte minutos.
            </p>
          </div>
        </Row>
        <Row label="box">
          <div className="box l-measure l-stack -block">
            <p className="label">Antes de comecar</p>
            <p className="body">
              Deixe os ovos e a manteiga fora da geladeira por meia hora, e unte
              a forma antes de ligar o forno.
            </p>
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};
