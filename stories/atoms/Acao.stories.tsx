// notebook-layout/stories/atoms/Acao.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import {
  PiBookmarkSimple,
  PiBookmarkSimpleFill,
  PiDotsThree,
  PiPlus,
  PiX,
} from 'react-icons/pi';
import { Button, IconButton } from '@components/atoms';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atomos/Acao',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Os cinco pesos do botao, o botao so de icone e o link. O hover so existe em aparelhos com hover real, entao passe o ponteiro para ve-lo; no toque, o retorno e o pressionado, que desce 1px em todos os pesos.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Botao: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Os cinco pesos"
        note="O peso comunica o custo de desfazer. O compromisso nunca leva icone: o verbo basta, e ele ja e o unico preenchido da tela."
      >
        <Row label="compromisso">
          <Button weight="compromisso">Guardar receita</Button>
        </Row>
        <Row label="estruturante">
          <Button weight="estruturante">Cancelar</Button>
          <Button weight="estruturante" icon={PiPlus}>
            Adicionar parte
          </Button>
        </Row>
        <Row label="texto">
          <Button weight="texto">Editar</Button>
        </Row>
        <Row label="destrutiva">
          <Button weight="destrutiva">Excluir</Button>
        </Row>
        <Row label="confirmacao-destrutiva">
          <Button weight="confirmacao-destrutiva">Excluir mesmo assim</Button>
        </Row>
      </Group>

      <Group
        title="Desabilitado"
        note="A forma nao muda. Nos preenchidos o botao inteiro vai a 0.45, para o accent continuar reconhecivel mas apagado; nos demais, a tinta vai para fg-disabled. Nenhum botao vira caixa cinza."
      >
        <Row label="compromisso">
          <Button weight="compromisso" disabled>
            Guardar receita
          </Button>
        </Row>
        <Row label="estruturante">
          <Button weight="estruturante" disabled>
            Cancelar
          </Button>
        </Row>
        <Row label="texto">
          <Button weight="texto" disabled>
            Editar
          </Button>
        </Row>
        <Row label="confirmacao-destrutiva">
          <Button weight="confirmacao-destrutiva" disabled>
            Excluir mesmo assim
          </Button>
        </Row>
      </Group>

      <Group
        title="Carregando"
        note="Carregando nao e desabilitado: o botao nao esta indisponivel, esta trabalhando. Ele mantem forma, cor e LARGURA — o rotulo some por opacidade e continua no lugar, entao o nome acessivel tambem fica. Novos cliques sao ignorados."
      >
        <Row label="em curso">
          <Button weight="compromisso" loading>
            Guardar receita
          </Button>
          <Button weight="estruturante" loading>
            Adicionar parte
          </Button>
        </Row>
      </Group>

      <Group
        title="Lado a lado"
        note="O de compromisso e sempre o ultimo da fila."
      >
        <Row label="rodape de modal">
          <Button weight="estruturante">Cancelar</Button>
          <Button weight="compromisso">Guardar</Button>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const BotaoSoDeIcone: Story = {
  name: 'Botao so de icone',
  render: () => (
    <Sheet>
      <Group
        title="Botao so de icone"
        note="O unico lugar onde o icone aparece sem palavra, entao ele so existe com desenho universal e com nome acessivel obrigatorio. A tinta e cheia, e nao accent: uma barra com quatro icones em accent gastaria o orcamento da tela inteira."
      >
        <Row label="repouso">
          <IconButton icon={PiDotsThree} label="Mais opcoes" />
          <IconButton icon={PiX} label="Fechar" />
          <IconButton icon={PiPlus} label="Adicionar" />
        </Row>
        <Row label="alternavel, desligado">
          <IconButton
            icon={PiBookmarkSimple}
            iconMarked={PiBookmarkSimpleFill}
            label="Salvar"
            pressed={false}
          />
        </Row>
        <Row label="alternavel, ligado">
          <IconButton
            icon={PiBookmarkSimple}
            iconMarked={PiBookmarkSimpleFill}
            label="Salvar"
            pressed
          />
        </Row>
        <Row label="desabilitado">
          <IconButton icon={PiDotsThree} label="Mais opcoes" disabled />
        </Row>
      </Group>
      <p className="caption">
        Ligado, o icone PREENCHE e a tinta sobe para a enfase. Ele nao ganha
        fundo selecionado, porque o preenchimento ja e a marca — e assim o
        estado e visivel pela forma, nao so pela cor.
      </p>
    </Sheet>
  ),
};

export const Link: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Na prosa"
        note="O texto fica na tinta do corpo e so o sublinhado leva accent. Em texto corrido ninguem distingue a cor de um link da cor de uma enfase, entao o sublinhado tem que estar sempre presente — e com ele presente, pintar tambem o texto e redundante."
      >
        <p className="p">
          Bata as claras em neve antes de misturar, como está escrito na{' '}
          <a href="#nowhere">receita original da sua avó</a>, e reserve. O
          sublinhado engrossa no hover: é o mesmo gesto do fio do campo no foco,
          a linha que já existe ganhando tinta.
        </p>
      </Group>

      <Group
        title="Fora da prosa"
        note="O texto e accent e o sublinhado so aparece no hover. Todo link tem accent em algum lugar: na prosa e a linha, fora dela e o texto."
      >
        <Row label="metadado">
          <a href="#nowhere">Ver todas as receitas</a>
        </Row>
      </Group>

      <p className="caption">
        Link visitado nao tem aparencia propria — e um caderno, nao um documento
        de pesquisa. E link nunca leva icone: o sinal de &ldquo;leva a outro
        lugar&rdquo; ja e o sublinhado.
      </p>
    </Sheet>
  ),
};
