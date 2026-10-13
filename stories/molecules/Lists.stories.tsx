// notebook-layout/stories/molecules/Lists.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LineList, LineListCheck, LineListItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { figures } from './figures';

const meta = {
  title: 'Molecules/Lists',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single list. The family decides the marker of the whole list (none, lozenge, numeral) or removes the margin column (data). The rest comes from the content: each filled slot — figure, description, trailing — appears in its place, and an item with href or onClick becomes a link or button without changing variant.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ingredients = [
  { name: 'Farinha de trigo', amount: '250 g', figure: figures.flour },
  { name: 'Acucar', amount: '80 g', figure: figures.sugar },
  { name: 'Ovos', amount: '150 g', figure: figures.egg },
  { name: 'Queijo ralado na hora', amount: '200 g', figure: figures.cheese },
  { name: 'Tomate maduro', amount: '1 000 g', figure: figures.tomato },
];

export const Prose: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Prose"
        note="The lozenge is the marker, and only in this family: a text list inside reading content. Smaller and lighter than the section mark, because both live in the same column."
      >
        <div>
          <h3 className="title-md">
            <span className="section-mark" aria-hidden="true" />
            Dicas
          </h3>
          <LineList family="prose">
            <LineListItem>
              Peneire a farinha junto com o fermento, para a massa crescer por
              igual.
            </LineListItem>
            <LineListItem>
              Os ovos devem estar em temperatura ambiente.
            </LineListItem>
            <LineListItem>
              Nao abra o forno nos primeiros <strong>20 minutos</strong>.
            </LineListItem>
          </LineList>
        </div>
      </Group>
    </Sheet>
  ),
};

export const Steps: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Steps"
        note="The numeral sits in the column, in numeric and supporting ink, with the unit line height. Between steps, half a unit."
      >
        <LineList family="steps">
          {[
            'Bata as claras em neve e reserve na geladeira enquanto prepara o restante.',
            'Misture as gemas com o acucar ate formar um creme claro.',
            'Junte a farinha aos poucos, alternando com o leite.',
            'Leve ao forno preaquecido a 180 graus.',
            'Espere esfriar antes de cobrir.',
          ].map((step) => (
            <LineListItem key={step}>{step}</LineListItem>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};

export const Slots: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Figure and description"
        note="The figure takes the margin column. The description comes below, in caption, with half a unit: the item measures one and a half units and the text runs to the end of the line. It is the place for redundant information, like an ingredient's amount."
      >
        <LineList>
          {ingredients.map(({ name, amount, figure }) => (
            <LineListItem key={name} figure={figure} description={amount}>
              {name}
            </LineListItem>
          ))}
        </LineList>
      </Group>

      <Group
        title="Value at the end"
        note="With the value slot, a column in tabular numeric appears, the same for every item. Without a figure, the margin column still exists and the text does not change edge."
      >
        <LineList>
          {ingredients.slice(0, 3).map(({ name, amount }) => (
            <LineListItem key={name} trailing={amount}>
              {name}
            </LineListItem>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};

export const Data: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Data"
        note="Label and value, no margin column, horizontal rules between the lines: the column governs the width."
      >
        <LineList family="data" ruled>
          {[
            ['Calorias', '3 823 kcal'],
            ['Proteinas', '29 g'],
            ['Carboidratos', '512,4 g'],
            ['Gorduras', '164 g'],
          ].map(([label, value]) => (
            <LineListItem key={label} trailing={value}>
              {label}
            </LineListItem>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};

const ActionDemo = () => {
  const [open, setOpen] = useState('Farinha de trigo');

  return (
    <Sheet>
      <Group
        title="Action item"
        note="The same item, with onClick: it becomes a button and the whole line is the target, one and a half units tall. With href it becomes a link. Selected is aria-current, in neutral wash and emphasis ink."
      >
        <LineList ruled>
          {ingredients.map(({ name, figure }) => (
            <LineListItem
              key={name}
              figure={figure}
              selected={open === name}
              onClick={() => setOpen(name)}
            >
              {name}
            </LineListItem>
          ))}
          <LineListItem href="#">Um link</LineListItem>
          <LineListItem onClick={() => {}} disabled>
            Indisponivel
          </LineListItem>
        </LineList>
      </Group>
    </Sheet>
  );
};

export const Action: Story = {
  name: 'Action',
  render: () => <ActionDemo />,
};

export const Check: Story = {
  name: 'Check',
  render: () => (
    <Sheet>
      <Group
        title="Check"
        note="The box takes the margin column and the whole line is the target. Checked, the item recedes to supporting ink, without a strike-through."
      >
        <LineList>
          {ingredients.map(({ name, amount }, index) => (
            <LineListCheck key={name} trailing={amount} defaultChecked={index < 2}>
              {name}
            </LineListCheck>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};
