// notebook-layout/stories/coreui/Avisos.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Avisos',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O alerta (.alert) nas tres cores de status e a marca de margem (.callout). As cores vem do adapter; info, primary, light e dark nao fazem parte do sistema.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alerta: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Alerta"
        note="Lavado de status e tinta de status, sem borda e sem raio. O alerta nao tem margem propria: o espaco entre ele e o resto vem do fluxo da pagina."
      >
        <Row label="success">
          <div className="alert alert-success" role="status">
            Receita guardada na lista Doces.
          </div>
        </Row>
        <Row label="warning">
          <div className="alert alert-warning" role="status">
            Tres ingredientes ainda nao foram reconhecidos.{' '}
            <a className="alert-link" href="#">
              Revisar agora
            </a>
          </div>
        </Row>
        <Row label="danger">
          <div className="alert alert-danger" role="alert">
            Nao foi possivel enviar a imagem. Tente de novo em instantes.
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const MarcaDeMargem: Story = {
  name: 'Marca de margem',
  render: () => (
    <Sheet>
      <Group
        title="Marca de margem"
        note="O .callout sem modificador: um fio de marker-width na borda inicial, em border-selected, e mais nada. E a segunda tinta do autor marcando um aparte; nao tem fundo, raio nem variante de cor."
      >
        <div className="l-measure">
          <p className="p">
            Bata as claras em neve e reserve na geladeira enquanto prepara o
            restante da massa.
          </p>
          <div className="callout">
            <p className="p">
              Se a sua batedeira for fraca, bata as claras com uma pitada de sal:
              elas firmam mais depressa e nao desandam quando entram na massa.
            </p>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};
