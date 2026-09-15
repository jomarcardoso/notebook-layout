// notebook-layout/stories/coreui/Mecanica.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'CoreUI/Mecanica',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O que o CoreUI entrega como mecanica e se usa direto, sem CSS proprio: grade, grade CSS, sticky-top, visually-hidden, ratio e text-truncate. Os utilitarios que carregam valor — cor, fundo, borda, raio, sombra, tipografia — nao sao compilados, e os helpers text-bg-*, link-*, icon-link, focus-ring, vr, vstack, hstack e stretched-link tambem nao. A lista completa esta em CoreUI/Inventario.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grades: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Grade de 12 colunas"
        note="row e col-* em flex. A calha e --app-gutter, 32px. Abaixo de md as colunas viram sequencia: e remontagem, nao restyle."
      >
        <div className="row">
          <div className="col-md-4">
            <span className="app-image" style={{ aspectRatio: '4 / 1' }} />
          </div>
          <div className="col-md-8">
            <span className="app-image" style={{ aspectRatio: '8 / 1' }} />
          </div>
        </div>
      </Group>

      <Group
        title="Grade CSS"
        note=".grid e g-col-* em CSS grid, a mesma calha. Para colecao sem prosa em varias colunas; item com prosa e lista vertical unica."
      >
        <div className="grid">
          {Object.values(photos).map((foto) => (
            <img
              key={foto}
              className="app-image g-col-6 g-col-md-4"
              src={foto}
              alt=""
            />
          ))}
        </div>
      </Group>
    </Sheet>
  ),
};

export const Acessibilidade: Story = {
  render: () => (
    <Sheet>
      <Group
        title="visually-hidden"
        note="Texto que so o leitor de tela le. A versao -focusable aparece quando recebe foco: e o link de pular para o conteudo. Aperte Tab dentro do quadro para ve-lo."
      >
        <Row label="pular">
          <a className="visually-hidden-focusable" href="#conteudo">
            Pular para o conteudo
          </a>
        </Row>
        <Row label="rotulo oculto">
          <span className="caption">
            3 823 <span className="visually-hidden">quilocalorias</span>
            <span aria-hidden="true">kcal</span>
          </span>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const ProporcaoETruncamento: Story = {
  name: 'Proporcao e truncamento',
  render: () => (
    <Sheet>
      <Group
        title="ratio"
        note="Para video e embed na proporcao da imagem do sistema, 1:1. A foto continua em .app-image, que ja carrega a proporcao pelo token."
      >
        <div className="ratio ratio-1x1" style={{ maxInlineSize: '12rem' }}>
          <span className="app-image" />
        </div>
      </Group>

      <Group
        title="text-truncate"
        note="Uma linha so, com reticencias. Serve a um rotulo curto num lugar estreito; nunca a prosa, que respeita a medida e quebra."
      >
        <p className="label text-truncate" style={{ maxInlineSize: '16rem' }}>
          Torta de frango de liquidificador com massa que nao precisa de sova
        </p>
      </Group>
    </Sheet>
  ),
};
