// notebook-layout/stories/compositions/Folio.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'Composicoes/Folio',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O folio (.folio) e o texto de pe e cabeca que orienta sem pedir leitura: titulo corrido, posicao numa sequencia, numero de pagina. Tinta fg-subtle em caption, com algarismos tabulares. Separa-se do conteudo por espaco, sem fio.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PeDePagina: Story = {
  name: 'Pe de pagina',
  render: () => (
    <Sheet>
      <Group
        title="Pe de pagina"
        note="O titulo corrido no inicio e a posicao no fim, na mesma linha de base. O espaco acima e uma unidade de ritmo inteira."
      >
        <div className="l-measure l-stack">
          <p className="p">
            Leve ao forno preaquecido a 180 graus por quarenta minutos, ou ate o
            palito sair limpo. Espere esfriar antes de desenformar.
          </p>
          <footer className="l-cluster -between -baseline">
            <span className="folio">Caderno da vo Lurdes · Doces</span>
            <span className="folio">3 de 12</span>
          </footer>
        </div>
      </Group>
    </Sheet>
  ),
};

export const PosicaoNaSequencia: Story = {
  name: 'Posicao na sequencia',
  render: () => (
    <Sheet>
      <Group
        title="Posicao na sequencia"
        note="Acima do passo, dizendo onde o leitor esta. O numero muda de largura sem mover o texto ao lado, porque os algarismos sao tabulares."
      >
        <div className="l-measure l-stack -tight">
          <p className="folio">Passo 7 de 12</p>
          <p className="p">Junte a farinha aos poucos, alternando com o leite.</p>
        </div>
      </Group>
    </Sheet>
  ),
};
