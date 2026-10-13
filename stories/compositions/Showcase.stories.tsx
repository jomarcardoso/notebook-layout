// notebook-layout/stories/compositions/Showcase.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { ThumbGrid, ThumbItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Compositions/Showcase highlight',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The showcase section: one larger main item (ThumbItem variant featured, text in title-md) and three or four secondary ones (variant brief, no image, text in label). The hierarchy is of size, never of wrapping. In all of them the link IS the item: the click area, the hover and the focus ring are the same box.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ONE_COLUMN = { '--thumb-grid-track': '100%' } as CSSProperties;

const SECONDARY = [
  { title: 'Pudim de leite condensado', meta: ['1 h 20 min', '10 porcoes'] },
  { title: 'Brigadeiro de colher', meta: ['20 min', '6 porcoes'] },
  { title: 'Torta de limao', meta: ['1 h', '8 porcoes'] },
  { title: 'Pao de mel', meta: ['45 min', '20 unidades'] },
];

export const Highlight: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Highlight"
        note="Seven columns for the main item, five for the secondary ones. The section title is the only heading: the items are things inside the section, not parts of the page. Navigate with Tab to see the ring outline the whole item."
      >
        <section className="l-stack">
          <h2 className="section-title">Doces</h2>
          <div className="row">
            <div className="col-md-7">
              <ThumbGrid style={ONE_COLUMN}>
                <ThumbItem
                  variant="featured"
                  href="#"
                  image={{ src: photos.pudding }}
                  description={['50 min', '12 porcoes', 'Lurdes Cardoso']}
                >
                  Bolo de cenoura da vo Lurdes
                </ThumbItem>
              </ThumbGrid>
            </div>
            <div className="col-md-5">
              <ThumbGrid style={ONE_COLUMN}>
                {SECONDARY.map(({ title, meta: description }) => (
                  <ThumbItem
                    key={title}
                    variant="brief"
                    href="#"
                    description={description}
                  >
                    {title}
                  </ThumbItem>
                ))}
              </ThumbGrid>
            </div>
          </div>
        </section>
      </Group>
    </Sheet>
  ),
};
