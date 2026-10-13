// notebook-layout/stories/compositions/Folio.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'Compositions/Folio',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The folio (.folio) is the header and footer text that orients without asking to be read: running title, position in a sequence, page number. fg-subtle ink in caption, with tabular figures. It is set apart from the content by space, without a rule.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Footer: Story = {
  name: 'Footer',
  render: () => (
    <Sheet>
      <Group
        title="Footer"
        note="The running title at the start and the position at the end, on the same baseline. The space above is one whole rhythm unit."
      >
        <div className="l-measure l-stack">
          <p className="body">
            Leve ao forno preaquecido a 180 graus por quarenta minutos, ou ate o
            palito sair limpo. Espere esfriar antes de desenformar.
          </p>
          <footer className="l-cluster -between -baseline">
            <span className="folio">Caderno da vo Lurdes · Doces</span>
            <span className="folio">3 de 12</span>
          </footer>
        </div>
      </Group>
    </Sheet>
  ),
};

export const PositionInSequence: Story = {
  name: 'Position in sequence',
  render: () => (
    <Sheet>
      <Group
        title="Position in sequence"
        note="Above the step, telling the reader where they are. The number changes width without moving the text beside it, because the figures are tabular."
      >
        <div className="l-measure l-stack -block">
          <p className="folio">Passo 7 de 12</p>
          <p className="body">Junte a farinha aos poucos, alternando com o leite.</p>
        </div>
      </Group>
    </Sheet>
  ),
};
