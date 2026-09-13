// notebook-layout/stories/molecules/Listas.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LineList, LineListCheck, LineListItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { figures } from './figures';

const meta = {
  title: 'Moleculas/Listas',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Uma lista so. A familia decide o marcador da lista inteira (nenhum, losango, numeral) ou tira a coluna de margem (dados). O resto vem do conteudo: cada slot preenchido — figure, description, trailing — aparece no seu lugar, e um item com href ou onClick vira link ou botao sem trocar de variante.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ingredientes = [
  { nome: 'Farinha de trigo', medida: '250 g', figura: figures.farinha },
  { nome: 'Acucar', medida: '80 g', figura: figures.acucar },
  { nome: 'Ovos', medida: '150 g', figura: figures.ovo },
  { nome: 'Queijo ralado na hora', medida: '200 g', figura: figures.queijo },
  { nome: 'Tomate maduro', medida: '1 000 g', figura: figures.tomate },
];

export const Prosa: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Prosa"
        note="O losango e o marcador, e so nesta familia: lista de texto dentro de conteudo de leitura. Menor e mais claro que a marca de secao, porque os dois moram na mesma coluna."
      >
        <div>
          <h3 className="title-md">
            <span className="section-mark" aria-hidden="true" />
            Dicas
          </h3>
          <LineList family="prose">
            <LineListItem>
              Peneire a farinha junto com o fermento, para a massa crescer por
              igual.
            </LineListItem>
            <LineListItem>
              Os ovos devem estar em temperatura ambiente.
            </LineListItem>
            <LineListItem>
              Nao abra o forno nos primeiros <strong>20 minutos</strong>.
            </LineListItem>
          </LineList>
        </div>
      </Group>
    </Sheet>
  ),
};

export const Passos: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Passos"
        note="O numeral fica na coluna, em numeric e tinta de apoio, com a entrelinha da unidade. Entre passos, meia unidade."
      >
        <LineList family="steps">
          {[
            'Bata as claras em neve e reserve na geladeira enquanto prepara o restante.',
            'Misture as gemas com o acucar ate formar um creme claro.',
            'Junte a farinha aos poucos, alternando com o leite.',
            'Leve ao forno preaquecido a 180 graus.',
            'Espere esfriar antes de cobrir.',
          ].map((step) => (
            <LineListItem key={step}>{step}</LineListItem>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};

export const Slots: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Figura e descricao"
        note="A figura ocupa a coluna de margem. A descricao vem abaixo, em caption, com meia unidade: o item mede uma unidade e meia e o texto vai ate o fim da linha. E o lugar de uma informacao redundante, como a medida de um ingrediente."
      >
        <LineList>
          {ingredientes.map(({ nome, medida, figura }) => (
            <LineListItem key={nome} figure={figura} description={medida}>
              {nome}
            </LineListItem>
          ))}
        </LineList>
      </Group>

      <Group
        title="Valor no fim"
        note="Com o slot de valor, aparece uma coluna em numeric tabular, a mesma para todos os itens. Sem figura, a coluna de margem continua existindo e o texto nao muda de borda."
      >
        <LineList>
          {ingredientes.slice(0, 3).map(({ nome, medida }) => (
            <LineListItem key={nome} trailing={medida}>
              {nome}
            </LineListItem>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};

export const Dados: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Dados"
        note="Rotulo e valor, sem coluna de margem, fios horizontais entre as linhas: quem governa a largura e a coluna."
      >
        <LineList family="data" ruled>
          {[
            ['Calorias', '3 823 kcal'],
            ['Proteinas', '29 g'],
            ['Carboidratos', '512,4 g'],
            ['Gorduras', '164 g'],
          ].map(([rotulo, valor]) => (
            <LineListItem key={rotulo} trailing={valor}>
              {rotulo}
            </LineListItem>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};

const AcaoDemo = () => {
  const [aberto, setAberto] = useState('Farinha de trigo');

  return (
    <Sheet>
      <Group
        title="Item de acao"
        note="O mesmo item, com onClick: vira botao e a linha inteira e o alvo, de uma unidade e meia. Com href vira link. Selecionado e aria-current, em lavado neutro e tinta de enfase."
      >
        <LineList ruled>
          {ingredientes.map(({ nome, figura }) => (
            <LineListItem
              key={nome}
              figure={figura}
              selected={aberto === nome}
              onClick={() => setAberto(nome)}
            >
              {nome}
            </LineListItem>
          ))}
          <LineListItem href="#">Um link</LineListItem>
          <LineListItem onClick={() => {}} disabled>
            Indisponivel
          </LineListItem>
        </LineList>
      </Group>
    </Sheet>
  );
};

export const DeAcao: Story = {
  name: 'De acao',
  render: () => <AcaoDemo />,
};

export const DeMarcar: Story = {
  name: 'De marcar',
  render: () => (
    <Sheet>
      <Group
        title="Marcar"
        note="A caixa ocupa a coluna de margem e a linha inteira e o alvo. Marcado, o item recua para a tinta de apoio, sem risco."
      >
        <LineList>
          {ingredientes.map(({ nome, medida }, index) => (
            <LineListCheck key={nome} trailing={medida} defaultChecked={index < 2}>
              {nome}
            </LineListCheck>
          ))}
        </LineList>
      </Group>
    </Sheet>
  ),
};
