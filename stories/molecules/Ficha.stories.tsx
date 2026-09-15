// notebook-layout/stories/molecules/Ficha.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'Moleculas/Ficha',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A ficha (.facts) sao os dados-chave lado a lado. Cada par e um dado: rotulo em label-sm e fg-muted, valor em numeric. Os pares se separam pela calha, nunca por fio vertical. No papel a ficha se separa por espaco; dentro de .box ela vira boxe. A faixa entre dois fios nao e opcao, porque desenha dois fios paralelos.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Dado {
  rotulo: string;
  valor: string;
}

const DADOS: Dado[] = [
  { rotulo: 'Preparo', valor: '50 min' },
  { rotulo: 'Rende', valor: '12 porcoes' },
  { rotulo: 'Energia', valor: '255 kcal' },
  { rotulo: 'Dificuldade', valor: 'Facil' },
];

const Ficha = ({
  dados = DADOS,
  className = '',
}: {
  dados?: Dado[];
  className?: string;
}) => (
  <dl className={`facts ${className}`.trim()}>
    {dados.map(({ rotulo, valor }) => (
      <div className="facts__item" key={rotulo}>
        <dt className="facts__label">{rotulo}</dt>
        <dd className="facts__value">{valor}</dd>
      </div>
    ))}
  </dl>
);

export const NoPapel: Story = {
  name: 'No papel',
  render: () => (
    <Sheet>
      <Group
        title="No papel"
        note="O primeiro degrau da escada: so espaco. A ficha fica logo abaixo do headnote, e o que a separa do texto e a mudanca de escala e de tinta."
      >
        <div className="l-stack -tight">
          <p className="title-lg">Bolo de cenoura da vo Lurdes</p>
          <p className="subtitle">
            O de todo aniversario. A cobertura vai quente, para escorrer pelos
            lados.
          </p>
          <Ficha />
        </div>
      </Group>
    </Sheet>
  ),
};

export const NoBoxe: Story = {
  name: 'No boxe',
  render: () => (
    <Sheet>
      <Group
        title="No boxe"
        note="Quando a ficha precisa ser lida como um bloco a parte — numa pagina cheia, ou ao lado de outra ficha —, ela entra no .box. A mesma marcacao com uma classe a mais."
      >
        <Ficha className="box" />
      </Group>
    </Sheet>
  ),
};

export const Quebra: Story = {
  name: 'Quando nao cabe',
  render: () => (
    <Sheet>
      <Group
        title="Quando nao cabe"
        note="Os pares quebram para a linha de baixo mantendo a calha entre colunas e um passo interno entre linhas. Nenhum par encolhe o rotulo ou o valor."
      >
        <Row label="aparato">
          <div className="l-measure -apparatus">
            <Ficha
              dados={[
                ...DADOS,
                { rotulo: 'Forno', valor: '180 °C' },
                { rotulo: 'Custo', valor: 'R$ 18' },
              ]}
            />
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};
