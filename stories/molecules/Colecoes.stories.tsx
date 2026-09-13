// notebook-layout/stories/molecules/Colecoes.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import {
  IndexItem,
  IndexList,
  ThumbGrid,
  ThumbItem,
} from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from './figures';

const meta = {
  title: 'Moleculas/Indice e grade',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Duas colecoes, nao um item em duas larguras. O excerpt decide: item com prosa vai para o indice, lista vertical unica; item sem prosa pode ir para a grade. Nos dois o link e o unico filho do li e o item inteiro e o alvo. Navegue com Tab para ver o anel contornar o item.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const receitas = [
  {
    titulo: 'Bolo de cenoura da vo Lurdes',
    excerpt:
      'O de todo aniversario. A cobertura vai quente, para escorrer pelos lados.',
    descricao: ['50 min', '12 porcoes', 'Lurdes Cardoso'],
    foto: photos.bolo,
  },
  {
    titulo: 'Torta de frango de liquidificador',
    excerpt: 'Massa que nao precisa de sova, para o dia sem tempo.',
    descricao: ['1 h', '8 porcoes', '320 kcal'],
    foto: photos.torta,
  },
  {
    titulo: 'Sopa de tomate assado',
    excerpt: '',
    descricao: ['40 min', '4 porcoes'],
    foto: photos.sopa,
  },
  {
    titulo: 'Pao de queijo',
    excerpt:
      'Polvilho azedo e doce meio a meio. Congela bem cru e vai direto ao forno.',
    descricao: ['35 min', '30 unidades'],
    foto: '',
  },
];

export const Indice: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Indice"
        note="A coluna da imagem existe em todo item, com ou sem foto, entao o texto comeca sempre no mesmo ponto. Sem excerpt o item e baixo: imagem de duas unidades e o texto centrado nela. Com excerpt em algum item, a lista inteira sobe a imagem para tres unidades, sem variante. A quarta receita nao tem foto e continua alinhada."
      >
        <IndexList>
          {receitas.map(({ titulo, excerpt, descricao, foto }) => (
            <IndexItem
              key={titulo}
              href="#"
              excerpt={excerpt}
              description={descricao}
              image={{ src: foto }}
            >
              {titulo}
            </IndexItem>
          ))}
        </IndexList>
      </Group>
    </Sheet>
  ),
};

export const Grade: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Grade"
        note="Miniatura e texto, nada de prosa. A grade aceita quantas colunas couberem; ao estreitar, ela so remonta o numero de colunas — o item continua o mesmo, com os mesmos papeis."
      >
        <ThumbGrid>
          {[
            ['Bolo de cenoura', photos.bolo, '50 min'],
            ['Torta de frango', photos.torta, '1 h'],
            ['Sopa de tomate', photos.sopa, '40 min'],
            ['Pao caseiro', photos.pao, '3 h'],
            ['Salada de graos', photos.salada, '20 min'],
            ['Pudim de leite', photos.pudim, '1 h 30'],
          ].map(([titulo, foto, tempo]) => (
            <ThumbItem
              key={titulo}
              href="#"
              image={{ src: foto }}
              description={[tempo]}
            >
              {titulo}
            </ThumbItem>
          ))}
        </ThumbGrid>
      </Group>
    </Sheet>
  ),
};
