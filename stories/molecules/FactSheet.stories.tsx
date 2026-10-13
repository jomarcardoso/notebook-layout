// notebook-layout/stories/molecules/FactSheet.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'Molecules/Fact sheet',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The fact sheet (.description-list) is the key data side by side. Each pair is one datum: label in label-sm and fg-muted, value in numeric. The pairs are separated by the gutter, never by a vertical rule. On paper the fact sheet is set apart by space; inside .box it becomes a box. The band between two rules is not an option, because it draws two parallel rules.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Datum {
  label: string;
  value: string;
}

const DATA: Datum[] = [
  { label: 'Preparo', value: '50 min' },
  { label: 'Rende', value: '12 porcoes' },
  { label: 'Energia', value: '255 kcal' },
  { label: 'Dificuldade', value: 'Facil' },
];

const FactSheet = ({
  data = DATA,
  className = '',
}: {
  data?: Datum[];
  className?: string;
}) => (
  <dl className={`description-list ${className}`.trim()}>
    {data.map(({ label, value }) => (
      <div className="description-list__item" key={label}>
        <dt className="description-list__term">{label}</dt>
        <dd className="description-list__details">{value}</dd>
      </div>
    ))}
  </dl>
);

export const OnPaper: Story = {
  name: 'On paper',
  render: () => (
    <Sheet>
      <Group
        title="On paper"
        note="The first step of the ladder: only space. The fact sheet sits right below the headnote, and what sets it apart from the text is the change of scale and ink."
      >
        <div className="l-stack -block">
          <p className="title-lg">Bolo de cenoura da vo Lurdes</p>
          <p className="subtitle">
            O de todo aniversario. A cobertura vai quente, para escorrer pelos
            lados.
          </p>
          <FactSheet />
        </div>
      </Group>
    </Sheet>
  ),
};

export const InBox: Story = {
  name: 'In a box',
  render: () => (
    <Sheet>
      <Group
        title="In a box"
        note="When the fact sheet must be read as a separate block — on a busy page, or next to another fact sheet —, it goes into .box. The same markup with one more class."
      >
        <FactSheet className="box" />
      </Group>
    </Sheet>
  ),
};

export const Wrap: Story = {
  name: 'When it does not fit',
  render: () => (
    <Sheet>
      <Group
        title="When it does not fit"
        note="The pairs wrap to the line below keeping the gutter between columns and one inner step between lines. No pair shrinks the label or the value."
      >
        <Row label="apparatus">
          <div className="l-measure -apparatus">
            <FactSheet
              data={[
                ...DATA,
                { label: 'Forno', value: '180 °C' },
                { label: 'Custo', value: 'R$ 18' },
              ]}
            />
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};
