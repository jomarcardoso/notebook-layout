// notebook-layout/stories/Tabs.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from '@components/tabs';

const meta = {
  title: 'Navegacao/Abas',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'As abas do CoreUI (.nav-tabs), configuradas por variavel: um fio sob a fila, a escolhida com o contorno na mesma cor do fio e o fundo da pagina apagando o fio no pedaco dela. O que e nosso: o fundo das nao escolhidas e o radio por dentro do rotulo. Passe o ponteiro numa aba para ver a caixa dela.',
      },
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const ABAS = [
  { label: 'Ingredientes', value: 'ingredientes' },
  { label: 'Modo de preparo', value: 'preparo' },
  { label: 'Nutricional', value: 'nutricional' },
];

const PAINEL: Record<string, string> = {
  ingredientes:
    'Duas xicaras de farinha de trigo peneirada, uma xicara de acucar, tres ovos e duzentos gramas de queijo ralado na hora.',
  preparo:
    'Bata as claras em neve e reserve. Misture a farinha com o fermento e junte as gemas, mexendo devagar ate a massa ficar lisa.',
  nutricional:
    'Os valores sao por porcao e vem da tabela de composicao dos alimentos, nao de uma analise desta receita.',
};

const Fichario = ({ abas = ABAS }: { abas?: typeof ABAS }) => {
  const [aba, setAba] = useState(abas[0]?.value ?? '');

  return (
    <div style={{ maxInlineSize: '40rem' }}>
      <Tabs tabs={abas} value={aba} onChange={setAba} />
      <p className="p" style={{ paddingBlockStart: 'var(--app-rhythm-1)' }}>
        {PAINEL[aba] ?? ''}
      </p>
    </div>
  );
};

export const Playground: Story = {
  args: { tabs: ABAS },
  render: () => <Fichario />,
};

export const DuasAbas: Story = {
  name: 'Duas abas',
  args: { tabs: ABAS.slice(0, 2) },
  render: () => <Fichario abas={ABAS.slice(0, 2)} />,
};

export const ComDesabilitada: Story = {
  name: 'Com uma desabilitada',
  args: { tabs: ABAS },
  render: () => (
    <div style={{ maxInlineSize: '40rem' }}>
      <Tabs
        tabs={[...ABAS, { label: 'Em breve', value: 'breve', disabled: true }]}
        defaultValue="ingredientes"
      />
    </div>
  ),
};

export const ReferenciaCoreUI: Story = {
  name: 'Referencia CoreUI',
  args: { tabs: ABAS },
  parameters: {
    docs: {
      description: {
        story:
          'Em cima, a marcacao crua do .nav-tabs da biblioteca com a nossa configuracao; embaixo, o componente. As bordas, a descida sobre o fio e a junta tem que ser as mesmas; as diferencas esperadas sao o fundo da fila, o hover so de fundo e o raio de controle.',
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
            Em breve
          </a>
        </li>
      </ul>
      <Tabs
        data-reference="component"
        tabs={[...ABAS, { label: 'Em breve', value: 'breve', disabled: true }]}
        defaultValue="ingredientes"
      />
    </div>
  ),
};
