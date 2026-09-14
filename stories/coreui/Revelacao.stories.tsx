// notebook-layout/stories/coreui/Revelacao.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState } from 'react';
import { PiCaretDown } from 'react-icons/pi';
import { Button, Icon, Tag } from '@components/atoms';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Revelacao',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Revelacao no lugar com as classes do CoreUI: o acordeao (.accordion) e a dobra (.collapse). Nenhum dos dois abre folha sobre a pagina.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface ItemDeAcordeaoProps {
  titulo: string;
  corpo: string;
  contagem: string;
  aberto: boolean;
  onAlternar: () => void;
}

const ItemDeAcordeao = ({
  titulo,
  corpo,
  contagem,
  aberto,
  onAlternar,
}: ItemDeAcordeaoProps) => {
  const id = useId();

  return (
    <div className="accordion-item">
      <h3 className="accordion-header" id={`${id}-cabecalho`}>
        <button
          className={`accordion-button${aberto ? '' : ' collapsed'}`}
          type="button"
          aria-expanded={aberto}
          aria-controls={`${id}-painel`}
          onClick={onAlternar}
        >
          {titulo}
          {contagem && (
            <>
              &nbsp;<Tag count>{contagem}</Tag>
            </>
          )}
          <Icon icon={PiCaretDown} className="accordion-indicator" />
        </button>
      </h3>
      <div
        id={`${id}-painel`}
        role="region"
        aria-labelledby={`${id}-cabecalho`}
        className={`accordion-collapse collapse${aberto ? ' show' : ''}`}
      >
        <div className="accordion-body">
          <p className="p">{corpo}</p>
        </div>
      </div>
    </div>
  );
};

const PARTES = [
  {
    titulo: 'Massa',
    contagem: '',
    corpo:
      'Peneire a farinha com o fermento e junte as gemas batidas com o acucar, mexendo devagar ate a massa ficar lisa.',
  },
  {
    titulo: 'Recheio',
    contagem: '',
    corpo:
      'Leve o leite condensado ao fogo baixo com a manteiga e mexa sem parar ate desgrudar do fundo da panela.',
  },
  {
    titulo: 'Ja guardadas nas suas listas',
    contagem: '12',
    corpo:
      'O mesmo item com uma tag de contagem antes do indicador, como o grupo de receitas guardadas do caderno.',
  },
];

const AcordeaoDemo = () => {
  const [aberto, setAberto] = useState(PARTES[0].titulo);

  return (
    <Sheet>
      <Group
        title="Acordeao"
        note="Um fio por item e o fio pertence ao item: dois itens vizinhos nao fazem fios paralelos. Titulo em label, indicador Phosphor no fim da linha, sem caixa, sem raio e sem fundo no aberto."
      >
        <div className="accordion" style={{ maxInlineSize: '40rem' }}>
          {PARTES.map((parte) => (
            <ItemDeAcordeao
              key={parte.titulo}
              {...parte}
              aberto={aberto === parte.titulo}
              onAlternar={() =>
                setAberto(aberto === parte.titulo ? '' : parte.titulo)
              }
            />
          ))}
        </div>
      </Group>
    </Sheet>
  );
};

export const Acordeao: Story = {
  render: () => <AcordeaoDemo />,
};

const DobraDemo = () => {
  const [aberta, setAberta] = useState(false);
  const id = useId();

  return (
    <Sheet>
      <Group
        title="Dobra"
        note="Um botao de texto controla um trecho que ja pertence a pagina. O trecho abre no lugar e empurra o que vem depois; o rotulo diz o que vai acontecer."
      >
        <div style={{ maxInlineSize: '40rem' }}>
          <p className="p">
            Tres ovos, duas xicaras de farinha, uma xicara de acucar e uma
            colher de fermento.
          </p>
          <Button
            weight="texto"
            className="btn-flush"
            aria-expanded={aberta}
            aria-controls={`${id}-dobra`}
            onClick={() => setAberta(!aberta)}
          >
            {aberta ? 'Esconder os opcionais' : 'Ver os opcionais'}
          </Button>
          <div id={`${id}-dobra`} className={`collapse${aberta ? ' show' : ''}`}>
            <p className="p">
              Raspas de laranja, uma pitada de canela e cem gramas de nozes
              picadas.
            </p>
          </div>
        </div>
      </Group>
    </Sheet>
  );
};

export const Dobra: Story = {
  render: () => <DobraDemo />,
};
