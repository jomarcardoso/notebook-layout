// notebook-layout/stories/molecules/Collections.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import {
  IndexItem,
  IndexList,
  ThumbGrid,
  ThumbItem,
} from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { figures, photos } from './figures';

const meta = {
  title: 'Molecules/Index and grid',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Two collections, not one item at two widths. The excerpt decides: an item with prose goes to the index, a single vertical list; an item without prose may go to the grid. In both the link is the only child of the li and the whole item is the target. Navigate with Tab to see the ring outline the item.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const recipes = [
  {
    title: 'Bolo de cenoura da vo Lurdes',
    excerpt:
      'O de todo aniversario. A cobertura vai quente, para escorrer pelos lados.',
    description: ['50 min', '12 porcoes', 'Lurdes Cardoso'],
    photo: photos.cake,
  },
  {
    title: 'Torta de frango de liquidificador',
    excerpt: 'Massa que nao precisa de sova, para o dia sem time.',
    description: ['1 h', '8 porcoes', '320 kcal'],
    photo: photos.pie,
  },
  {
    title: 'Sopa de tomate assado',
    excerpt: '',
    description: ['40 min', '4 porcoes'],
    photo: photos.soup,
  },
  {
    title: 'Pao de queijo',
    excerpt:
      'Polvilho azedo e doce meio a meio. Congela bem cru e vai direto ao forno.',
    description: ['35 min', '30 unidades'],
    photo: '',
    figure: figures.cheese,
  },
];

export const Index: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Index"
        note="The image column exists on every item, with or without a photo, so the text always starts at the same point. Without an excerpt the item is short: a two-unit image with the text centred on it. With an excerpt on any item, the whole list raises the image to three units, without a variant. The fourth recipe has no photo: its content figure holds the image place and the text stays aligned."
      >
        <IndexList>
          {recipes.map(({ title, excerpt, description, photo, figure = '' }) => (
            <IndexItem
              key={title}
              href="#"
              excerpt={excerpt}
              description={description}
              image={{ src: photo }}
              figure={figure}
            >
              {title}
            </IndexItem>
          ))}
        </IndexList>
      </Group>
    </Sheet>
  ),
};

export const IndexUnruled: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Index without rules"
        note="The same item with `ruled={false}`: no rule between items, so a group of indexes under section titles reads as one block per title instead of a long ruled column."
      >
        <IndexList ruled={false}>
          {recipes.map(({ title, description, photo, figure = '' }) => (
            <IndexItem
              key={title}
              href="#"
              description={description}
              image={{ src: photo }}
              figure={figure}
            >
              {title}
            </IndexItem>
          ))}
        </IndexList>
      </Group>
    </Sheet>
  ),
};

export const Grid: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Grid"
        note="Thumbnail and text, no prose. The grid takes as many columns as fit; when it narrows, it only reassembles the number of columns — the item stays the same, with the same roles. An item without a photo shows its content figure in the image place."
      >
        <ThumbGrid>
          {[
            ['Bolo de cenoura', photos.cake, '50 min'],
            ['Torta de frango', photos.pie, '1 h'],
            ['Sopa de tomate', photos.soup, '40 min'],
            ['Pao caseiro', photos.bread, '3 h'],
            ['Salada de graos', photos.salad, '20 min'],
            ['Pudim de leite', photos.pudding, '1 h 30'],
            ['Torta de tomate', '', '1 h', figures.tomato],
          ].map(([title, photo, time, figure = '']) => (
            <ThumbItem
              key={title}
              href="#"
              image={{ src: photo }}
              figure={figure}
              description={[time]}
            >
              {title}
            </ThumbItem>
          ))}
        </ThumbGrid>
      </Group>
    </Sheet>
  ),
};

export const ChoiceGrid: Story = {
  name: 'Choice grid',
  render: () => (
    <Sheet>
      <Group
        title="Choice grid"
        note="The same grid when the item chooses instead of leading somewhere else: with onClick it is a button. With no photo on any item, the brief variant drops the image slot and only the label stays; with a photo on some of them, the wash holds the place of those without."
      >
        <ThumbGrid>
          {['Bolos e tortas', 'Massas', 'Sopas e caldos', 'Paes', 'Saladas'].map(
            (category) => (
              <ThumbItem key={category} variant="brief" onClick={() => {}}>
                {category}
              </ThumbItem>
            ),
          )}
        </ThumbGrid>
      </Group>
    </Sheet>
  ),
};
