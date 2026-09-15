// notebook-layout/stories/compositions/Vazio.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PiPlus } from 'react-icons/pi';
import { Button } from '@components/atoms';
import { Group, Sheet } from '../atoms/specimen';
import { figures } from '../molecules/figures';

const meta = {
  title: 'Composicoes/Vazio',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O estado vazio e tipografico: frase curta dizendo o que falta, uma linha dizendo para que serve e, quando houver, a acao que resolve. Sem caixa e sem fundo. A ilustracao e opcional e usa .state-illustration, a figura de conteudo em duas linhas de ritmo.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListaVazia: Story = {
  name: 'Lista vazia',
  render: () => (
    <Sheet>
      <Group
        title="Lista vazia"
        note="O que falta, para que serve e o que fazer. A acao e estruturante: adicionar nao produz nem destroi nada."
      >
        <div className="l-measure -narrow l-stack -tight">
          <img className="state-illustration" src={figures.farinha} alt="" />
          <p className="title-sm">Nenhuma receita nesta lista</p>
          <p className="p">
            Guarde aqui as receitas que voce quer encontrar sem precisar buscar.
          </p>
          <div>
            <Button weight="estruturante" icon={PiPlus}>
              Adicionar receita
            </Button>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};

export const BuscaSemResultado: Story = {
  name: 'Busca sem resultado',
  render: () => (
    <Sheet>
      <Group
        title="Busca sem resultado"
        note="Sem ilustracao: o leitor esta no meio de uma tarefa, e a resposta cabe em texto. A saida e um link, porque leva a outro estado da mesma pagina e nao executa nada."
      >
        <div className="l-measure -narrow l-stack -tight">
          <p className="title-sm">Nada encontrado para “bolo de fubá cremoso”</p>
          <p className="p">
            Confira a grafia ou procure por um ingrediente.{' '}
            <a href="#">Limpar a busca</a>
          </p>
        </div>
      </Group>
    </Sheet>
  ),
};
