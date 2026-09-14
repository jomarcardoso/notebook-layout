// notebook-layout/stories/coreui/Dica.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties, type ReactNode, useEffect, useId, useState } from 'react';
import { PiDotsThree, PiPlus, PiX } from 'react-icons/pi';
import { Button, IconButton } from '@components/atoms';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Dica',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O .tooltip do CoreUI como folha: papel da pagina, fio rule, raio e sombra da folha sobreposta, texto em caption, sem seta. A dica complementa o nome acessivel e nunca carrega sozinha a informacao: no toque nao ha hover, entao o que ela diz ja precisa estar no aria-label. O lugar dela e o botao so de icone com desenho universal.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Lado = 'top' | 'bottom' | 'start' | 'end';

const POSICAO: Record<Lado, CSSProperties> = {
  top: {
    insetBlockEnd: 'calc(100% + var(--app-space-2xs))',
    insetInlineStart: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    insetBlockStart: 'calc(100% + var(--app-space-2xs))',
    insetInlineStart: '50%',
    transform: 'translateX(-50%)',
  },
  start: {
    insetBlockStart: '50%',
    insetInlineEnd: 'calc(100% + var(--app-space-2xs))',
    transform: 'translateY(-50%)',
  },
  end: {
    insetBlockStart: '50%',
    insetInlineStart: 'calc(100% + var(--app-space-2xs))',
    transform: 'translateY(-50%)',
  },
};

interface DicaProps {
  id: string;
  lado: Lado;
  visivel: boolean;
  children: ReactNode;
}

const Dica = ({ id, lado, visivel, children }: DicaProps) => (
  <div
    id={id}
    role="tooltip"
    className={`tooltip fade bs-tooltip-${lado}${visivel ? ' show' : ''}`}
    style={{ inlineSize: 'max-content', position: 'absolute', ...POSICAO[lado] }}
  >
    <div className="tooltip-arrow" />
    <div className="tooltip-inner">{children}</div>
  </div>
);

export const Posicoes: Story = {
  name: 'Posicoes',
  render: () => (
    <Sheet>
      <Group
        title="Posicoes"
        note="Acima, abaixo, no inicio e no fim do gatilho. Sem seta, a dica fica a um passo de espaco interno do controle."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-rhythm-2) 10rem',
            gridTemplateColumns: 'repeat(2, max-content)',
            justifyContent: 'center',
            paddingBlock: 'var(--app-rhythm-2)',
          }}
        >
          {(['top', 'bottom', 'start', 'end'] as Lado[]).map((lado) => (
            <div key={lado} style={{ position: 'relative' }}>
              <Button weight="estruturante">{lado}</Button>
              <Dica id={`dica-${lado}`} lado={lado} visivel>
                Duplicar a receita
              </Dica>
            </div>
          ))}
        </div>
      </Group>
    </Sheet>
  ),
};

const BOTOES = [
  { icone: PiPlus, rotulo: 'Adicionar ingrediente' },
  { icone: PiDotsThree, rotulo: 'Mais opcoes' },
  { icone: PiX, rotulo: 'Fechar' },
];

interface BotaoComDicaProps {
  icone: (typeof BOTOES)[number]['icone'];
  rotulo: string;
}

const BotaoComDica = ({ icone, rotulo }: BotaoComDicaProps) => {
  const id = useId();
  const [ponteiro, setPonteiro] = useState(false);
  const [foco, setFoco] = useState(false);
  const visivel = ponteiro || foco;

  useEffect(() => {
    if (!visivel) {
      return () => {};
    }

    const esconderNoEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPonteiro(false);
        setFoco(false);
      }
    };

    window.addEventListener('keydown', esconderNoEscape);

    return () => window.removeEventListener('keydown', esconderNoEscape);
  }, [visivel]);

  return (
    <div style={{ position: 'relative' }}>
      <IconButton
        icon={icone}
        label={rotulo}
        aria-describedby={visivel ? id : ''}
        onMouseEnter={() =>
          setPonteiro(window.matchMedia('(hover: hover)').matches)
        }
        onMouseLeave={() => setPonteiro(false)}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
      />
      <Dica id={id} lado="top" visivel={visivel}>
        {rotulo}
      </Dica>
    </div>
  );
};

export const EmUso: Story = {
  name: 'Em uso',
  render: () => (
    <Sheet>
      <Group
        title="Em uso"
        note="Aparece com o ponteiro do mouse ou com o foco do teclado, e some com Escape. No toque ela nao aparece: o nome acessivel do botao ja diz a mesma coisa."
      >
        <Row label="barra de acoes">
          <div style={{ display: 'flex', gap: 'var(--app-space-xs)', paddingBlockStart: 'var(--app-rhythm-2)' }}>
            {BOTOES.map((botao) => (
              <BotaoComDica key={botao.rotulo} {...botao} />
            ))}
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const TextoLongo: Story = {
  name: 'Texto longo',
  render: () => (
    <Sheet>
      <Group
        title="Texto longo"
        note="A largura maxima e a medida do aparato. Uma dica que precisa de mais que isso ja e nota de margem ou texto de ajuda do campo, e nao dica."
      >
        <div style={{ minBlockSize: 'var(--app-rhythm-4)', position: 'relative' }}>
          <IconButton icon={PiDotsThree} label="Mais opcoes" />
          <div
            role="tooltip"
            className="tooltip bs-tooltip-bottom show"
            style={{
              inlineSize: 'max-content',
              insetBlockStart: 'calc(var(--app-size-control) + var(--app-space-2xs))',
              insetInlineStart: 0,
              position: 'absolute',
            }}
          >
            <div className="tooltip-arrow" />
            <div className="tooltip-inner">
              Duplicar cria uma copia desta receita na mesma lista, com o titulo
              e as partes, mas sem as suas notas.
            </div>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};
