import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs } from '@components/tabs';

/**
 * A ABA DE FICHARIO: a escolhida ABRE NA PAGINA.
 */
const meta = {
  title: 'Navegacao/Abas',
  component: Tabs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A aba so se julga COM o painel: e a junta entre os dois que faz o fichario. Passe o ponteiro para ver o lavado das nao escolhidas, e navegue por Tab para ver o anel do navegador contornar a aba inteira.',
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

const PAINEL: Record<string, { titulo: string; texto: string }> = {
  ingredientes: {
    titulo: 'Ingredientes',
    texto:
      'Duas xicaras de farinha de trigo peneirada, uma xicara de acucar, tres ovos e duzentos gramas de queijo ralado na hora.',
  },
  preparo: {
    titulo: 'Modo de preparo',
    texto:
      'Bata as claras em neve e reserve. Misture a farinha com o fermento e junte as gemas, mexendo devagar ate a massa ficar lisa.',
  },
  nutricional: {
    titulo: 'Nutricional',
    texto:
      'Os valores sao por porcao e vem da tabela de composicao dos alimentos, nao de uma analise desta receita.',
  },
};

const Fichario = ({ abas = ABAS }: { abas?: typeof ABAS }) => {
  const [aba, setAba] = useState(abas[0]?.value ?? '');
  const painel = PAINEL[aba] ?? PAINEL.ingredientes;

  return (
    <div style={{ maxInlineSize: '40rem' }}>
      <Tabs tabs={abas} value={aba} onChange={setAba} />

      <div style={{ paddingBlockStart: 'var(--app-rhythm-1)' }}>
        <h3 className="title-sm">{painel.titulo}</h3>
        <p className="p">{painel.texto}</p>
      </div>
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
      <div style={{ paddingBlockStart: 'var(--app-rhythm-1)' }}>
        <p className="p">
          A desabilitada fica fechada embaixo como as outras, so com a tinta
          apagada: ela continua sendo uma folha do fichario, nao um buraco na
          fila.
        </p>
      </div>
    </div>
  ),
};
