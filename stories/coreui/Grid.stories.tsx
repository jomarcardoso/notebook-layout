// notebook-layout/stories/coreui/Grid.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineList, LineListItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Grid',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CoreUI\'s 12-column grid used directly, because it is mechanics. The gutter is --app-gutter, 32px, the same as l-regions: the token and $grid-gutter-width read the same value from _metrics.scss.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = ['Ingredientes', 'Modo de preparo', 'Nutricional', 'Relacionadas'];

export const IndexAndContent: Story = {
  name: 'Index and content',
  render: () => (
    <Sheet>
      <Group
        title="4 e 8"
        note="col-md-4 for the anchored index and col-md-8 for the content. The index is a line-list of links, and position-sticky holds it while the content scrolls. Below md the two columns become a sequence, in the order index then content."
      >
        <div className="row">
          <div className="col-md-4">
            <nav
              className="position-sticky"
              style={{ insetBlockStart: 0 }}
              aria-label="Nesta receita"
            >
              <LineList>
                {SECTIONS.map((section, index) => (
                  <LineListItem key={section} href="#" selected={index === 0}>
                    {section}
                  </LineListItem>
                ))}
              </LineList>
            </nav>
          </div>
          <div className="col-md-8">
            <div className="l-stack">
              <h3 className="title-md">Ingredientes</h3>
              <p className="body">
                Duas xicaras de farinha de trigo peneirada, uma xicara de
                acucar, tres ovos e duzentos gramas de queijo ralado na hora.
              </p>
              <h3 className="title-md">Modo de preparo</h3>
              <p className="body">
                Bata as claras em neve e reserve. Misture a farinha com o
                fermento e junte as gemas, mexendo devagar ate a massa ficar
                lisa.
              </p>
            </div>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};
