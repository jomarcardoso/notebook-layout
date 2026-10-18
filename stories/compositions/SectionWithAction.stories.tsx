// notebook-layout/stories/compositions/SectionWithAction.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { IndexItem, IndexList } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Compositions/Section with action',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The section header with an action at the end of the line: l-cluster -between -baseline with the title and a link. The action is a link, not a button, because it leads somewhere else. The title is title-md, with no rule: the link beside it already marks the start of the section, and a rule running only under the title would look cut off.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RECIPES = [
  { title: 'Torta de frango de liquidificador', meta: ['1 h', '8 porcoes'], photo: photos.pie },
  { title: 'Sopa de tomate assado', meta: ['40 min', '4 porcoes'], photo: photos.soup },
  { title: 'Salada de graos', meta: ['25 min', '6 porcoes'], photo: photos.salad },
];

export const SeeAll: Story = {
  name: 'See all',
  render: () => (
    <Sheet>
      <Group
        title="See all"
        note="Title and link share the baseline. On a narrow screen the link drops to the line below, without changing its look."
      >
        <section className="l-measure">
          <div className="l-cluster -between -baseline">
            <h2 className="title-md">Relacionadas</h2>
            <a className="link" href="#">Ver todas</a>
          </div>
          <IndexList>
            {RECIPES.map(({ title, meta: description, photo }) => (
              <IndexItem
                key={title}
                href="#"
                image={{ src: photo }}
                description={description}
              >
                {title}
              </IndexItem>
            ))}
          </IndexList>
        </section>
      </Group>
    </Sheet>
  ),
};
