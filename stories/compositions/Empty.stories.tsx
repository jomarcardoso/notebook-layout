// notebook-layout/stories/compositions/Empty.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Button } from '@components/atoms';
import { Group, Sheet } from '../atoms/specimen';
import { figures } from '../molecules/figures';

const meta = {
  title: 'Compositions/Empty',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The empty state is typographic: a short phrase saying what is missing, a line saying what it is for and, when there is one, the action that solves it. No box and no background. The illustration is optional and uses .state-illustration, the content figure at two rhythm lines.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyList: Story = {
  name: 'Empty list',
  render: () => (
    <Sheet>
      <Group
        title="Empty list"
        note="What is missing, what it is for and what to do. The action is structural: adding neither produces nor destroys anything."
      >
        <div className="l-measure -narrow l-stack -block">
          <img className="state-illustration" src={figures.flour} alt="" />
          <p className="title-sm">Nenhuma receita nesta lista</p>
          <p className="body">
            Guarde aqui as receitas que voce quer encontrar sem precisar buscar.
          </p>
          <div>
            <Button weight="structural" icon={PlusIcon}>
              Adicionar receita
            </Button>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};

export const SearchWithoutResults: Story = {
  name: 'Search without results',
  render: () => (
    <Sheet>
      <Group
        title="Search without results"
        note="No illustration: the reader is in the middle of a task, and the answer fits in text. The way out is a link, because it leads to another state of the same page and runs nothing."
      >
        <div className="l-measure -narrow l-stack -block">
          <p className="title-sm">Nada encontrado para “bolo de fubá cremoso”</p>
          <p className="body">
            Confira a grafia ou procure por um ingrediente.{' '}
            <a href="#">Limpar a busca</a>
          </p>
        </div>
      </Group>
    </Sheet>
  ),
};
