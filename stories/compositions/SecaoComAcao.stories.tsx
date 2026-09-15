// notebook-layout/stories/compositions/SecaoComAcao.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { IndexItem, IndexList } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Composicoes/Secao com acao',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O cabecalho de secao com uma acao no fim da linha: l-cluster -between -baseline com o titulo e um link. A acao e link, e nao botao, porque leva a outro lugar. O titulo perde o fio (.section-title.-plain), porque o link ao lado ja marca o comeco da secao e um fio correndo so sob o titulo ficaria cortado.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RECEITAS = [
  { titulo: 'Torta de frango de liquidificador', meta: ['1 h', '8 porcoes'], foto: photos.torta },
  { titulo: 'Sopa de tomate assado', meta: ['40 min', '4 porcoes'], foto: photos.sopa },
  { titulo: 'Salada de graos', meta: ['25 min', '6 porcoes'], foto: photos.salada },
];

export const VerTodas: Story = {
  name: 'Ver todas',
  render: () => (
    <Sheet>
      <Group
        title="Ver todas"
        note="Titulo e link dividem a linha de base. Numa tela estreita o link desce para a linha de baixo, sem mudar de aparencia."
      >
        <section className="l-measure">
          <div className="l-cluster -between -baseline">
            <h2 className="section-title -plain">Relacionadas</h2>
            <a href="#">Ver todas</a>
          </div>
          <IndexList>
            {RECEITAS.map(({ titulo, meta: descricao, foto }) => (
              <IndexItem
                key={titulo}
                href="#"
                image={{ src: foto }}
                description={descricao}
              >
                {titulo}
              </IndexItem>
            ))}
          </IndexList>
        </section>
      </Group>
    </Sheet>
  ),
};
