// notebook-layout/stories/compositions/Abertura.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@components/atoms';
import { ExpandableText } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Composicoes/Abertura',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A abertura de uma pagina de leitura: titulo em display, a ficha, a figura 1:1, o headnote cortado em quatro linhas e a linha de acao. Estreita, e sequencia na ordem do DOM; com largura de conteudo, a figura vai para a direita, presa ao topo do titulo.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FICHA = [
  ['Rendimento', '12 fatias'],
  ['Tempo de preparo', '1 h 10 min'],
  ['Dificuldade', 'Facil'],
];

const HEADNOTE_LONGO =
  'Ela fazia aos domingos, sempre na forma de furo que veio do enxoval. Aprendi olhando, porque ela nunca mediu nada, e passei anos errando o ponto ate entender que o segredo e nao bater depois de colocar o queijo.\n\nEsta versao e a mais perto que cheguei da dela.';

const Abertura = ({ foto = '', headnote = '' }) => (
  <header className={foto ? 'opening opening--with-figure' : 'opening'}>
    <div className="opening__grid">
      <h1 className="display opening__title">
        Bolo de fuba cremoso da vo Lurdes
      </h1>
      <dl className="description-list">
        {FICHA.map(([rotulo, valor]) => (
          <div className="description-list__item" key={rotulo}>
            <dt className="description-list__term">{rotulo}</dt>
            <dd className="description-list__details">{valor}</dd>
          </div>
        ))}
      </dl>
      {foto && (
        <div className="opening__figure">
          <img className="app-image" src={foto} alt="" />
        </div>
      )}
      {headnote && <ExpandableText text={headnote} textClassName="subtitle" />}
      <div className="opening__actions">
        <Button weight="texto">Editar</Button>
        <Button weight="texto">Compartilhar</Button>
        <Button weight="destrutiva">Apagar</Button>
      </div>
    </div>
  </header>
);

export const ComFoto: Story = {
  name: 'Com foto',
  render: () => (
    <Sheet>
      <Group
        title="Com foto e headnote longo"
        note="O headnote corta em quatro linhas e so entao ganha Continuar lendo, que revela no lugar. Abaixo de 600px de conteudo a figura fica entre a ficha e o headnote."
      >
        <Abertura foto={photos.bolo} headnote={HEADNOTE_LONGO} />
      </Group>
    </Sheet>
  ),
};

export const SemFoto: Story = {
  name: 'Sem foto',
  render: () => (
    <Sheet>
      <Group
        title="Sem foto, headnote curto"
        note="Nada ocupa o lugar da figura, e o texto sobe. O headnote curto nao tem botao, porque nao ha corte."
      >
        <Abertura headnote="Pra usar o arroz que sobrou do almoco." />
      </Group>
    </Sheet>
  ),
};
