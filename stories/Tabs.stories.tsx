// notebook-layout/stories/Tabs.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from '@components/tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "CoreUI's tabs (.nav-tabs), configured by variable: a rule under the row, the chosen one outlined in the rule's colour with the page background erasing the rule under it. What is ours: the background of the unchosen ones and the radio inside the label. Move the pointer over a tab to see its box.",
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const TABS = [
  { label: 'Ingredientes', value: 'ingredients' },
  { label: 'Modo de preparo', value: 'method' },
  { label: 'Nutricional', value: 'nutrition' },
];

const PANEL: Record<string, string> = {
  ingredients:
    'Duas xicaras de farinha de trigo peneirada, uma xicara de acucar, tres ovos e duzentos gramas de queijo ralado na hora.',
  method:
    'Bata as claras em neve e reserve. Misture a farinha com o fermento e junte as gemas, mexendo devagar ate a massa ficar lisa.',
  nutrition:
    'Os valores sao por porcao e vem da tabela de composicao dos alimentos, nao de uma analise desta receita.',
};

const TabbedPanel = ({ tabs = TABS }: { tabs?: typeof TABS }) => {
  const [tab, setTab] = useState(tabs[0]?.value ?? '');

  return (
    <div style={{ maxInlineSize: '40rem' }}>
      <Tabs tabs={tabs} value={tab} onChange={setTab} />
      <p className="body" style={{ paddingBlockStart: 'var(--app-rhythm-1)' }}>
        {PANEL[tab] ?? ''}
      </p>
    </div>
  );
};

export const Playground: Story = {
  args: { tabs: TABS },
  render: () => <TabbedPanel />,
};

export const TwoTabs: Story = {
  name: 'Two tabs',
  args: { tabs: TABS.slice(0, 2) },
  render: () => <TabbedPanel tabs={TABS.slice(0, 2)} />,
};

export const WithDisabled: Story = {
  name: 'With one disabled',
  args: { tabs: TABS },
  render: () => (
    <div style={{ maxInlineSize: '40rem' }}>
      <Tabs
        tabs={[...TABS, { label: 'Em breve', value: 'soon', disabled: true }]}
        defaultValue="ingredientes"
      />
    </div>
  ),
};

export const CoreUIReference: Story = {
  name: 'CoreUI reference',
  args: { tabs: TABS },
  parameters: {
    docs: {
      description: {
        story:
          "On top, the raw markup of the library's .nav-tabs with our configuration; below, the component. The borders, the drop over the rule and the joint must be the same; the expected differences are the row background, the background-only hover and the control radius.",
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '2rem', maxInlineSize: '40rem' }}>
      <ul className="nav nav-tabs" data-reference="coreui">
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">
            Ingredientes
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Modo de preparo
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">
            Nutricional
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link disabled" aria-disabled="true">
            Em soon
          </a>
        </li>
      </ul>
      <Tabs
        data-reference="component"
        tabs={[...TABS, { label: 'Em breve', value: 'soon', disabled: true }]}
        defaultValue="ingredientes"
      />
    </div>
  ),
};
