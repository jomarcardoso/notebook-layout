// notebook-layout/stories/atoms/Boxe.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atomos/Boxe',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O boxe (.box) e a unica superficie de conteudo do sistema: o lavado forte, bg-muted, sem raio, sem borda e sem sombra. Guarda um aparte ou um conjunto que se le junto. Nao e clicavel: um boxe que leva a algum lugar e um card com outro nome. O espaco em volta e fluxo e vem da pagina; o de dentro e escala interna.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Aparte: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Aparte"
        note="Dentro da prosa, na medida do corpo. O texto de dentro continua em body; o link dentro dele usa o hover de alfa, que escurece sobre o lavado sem token novo."
      >
        <div className="l-measure l-stack">
          <p className="p">
            Rale as cenouras no ralo fino e bata com os ovos e o oleo ate a
            mistura ficar lisa e alaranjada.
          </p>
          <aside className="box l-stack -tight" aria-label="Dica">
            <p className="label">Dica da vo</p>
            <p className="p">
              Cenoura muito grande e fibrosa deixa o bolo pesado. Prefira as
              medias e, se puder, use a <a href="#">farinha peneirada duas
              vezes</a>.
            </p>
          </aside>
          <p className="p">
            Junte a farinha e o acucar aos poucos, mexendo com a espatula, e por
            ultimo o fermento.
          </p>
        </div>
      </Group>
    </Sheet>
  ),
};

export const BoxeOuMarcaDeMargem: Story = {
  name: 'Boxe ou callout',
  render: () => (
    <Sheet>
      <Group
        title="Boxe ou callout"
        note="Os dois separam um aparte, com forcas diferentes. O callout e um fio na borda e nao tem superficie; o boxe e material de outra natureza. Pela escada de separacao, o callout vem antes: use o boxe quando o aparte tem mais de um bloco ou precisa ser lido como um conjunto."
      >
        <Row label="callout">
          <div className="callout l-measure">
            <p className="p">
              Nao abra o forno nos primeiros vinte minutos.
            </p>
          </div>
        </Row>
        <Row label="boxe">
          <div className="box l-measure l-stack -tight">
            <p className="label">Antes de comecar</p>
            <p className="p">
              Deixe os ovos e a manteiga fora da geladeira por meia hora, e unte
              a forma antes de ligar o forno.
            </p>
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};
