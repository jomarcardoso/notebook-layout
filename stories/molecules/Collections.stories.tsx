// notebook-layout/stories/molecules/Collections.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import {
  IndexItem,
  IndexList,
  ThumbGrid,
  ThumbItem,
} from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from './figures';

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
  },
];

export const Index: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Index"
        note="The image column exists on every item, with or without a photo, so the text always starts at the same point. Without an excerpt the item is short: a two-unit image with the text centred on it. With an excerpt on any item, the whole list raises the image to three units, without a variant. The fourth recipe has no photo and stays aligned."
      >
        <IndexList>
          {recipes.map(({ title, excerpt, description, photo }) => (
            <IndexItem
              key={title}
              href="#"
              excerpt={excerpt}
              description={description}
              image={{ src: photo }}
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
        note="Thumbnail and text, no prose. The grid takes as many columns as fit; when it narrows, it only reassembles the number of columns — the item stays the same, with the same roles."
      >
        <ThumbGrid>
          {[
            ['Bolo de cenoura', photos.cake, '50 min'],
            ['Torta de frango', photos.pie, '1 h'],
            ['Sopa de tomate', photos.soup, '40 min'],
            ['Pao caseiro', photos.bread, '3 h'],
            ['Salada de graos', photos.salad, '20 min'],
            ['Pudim de leite', photos.pudding, '1 h 30'],
          ].map(([title, photo, time]) => (
            <ThumbItem
              key={title}
              href="#"
              image={{ src: photo }}
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
