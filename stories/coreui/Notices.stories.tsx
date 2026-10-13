// notebook-layout/stories/coreui/Notices.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Notices',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The alert (.alert) in the three status colours and the callout (.callout). The colours come from the adapter; info, primary, light and dark are not part of the system.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AlertStory: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Alert"
        note="Status wash and status ink, no border and no radius. The alert has no margin of its own: the space between it and the rest comes from the page flow."
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

export const Callout: Story = {
  name: 'Callout',
  render: () => (
    <Sheet>
      <Group
        title="Callout"
        note="The .callout without a modifier: the usual rule on the start edge, in rule-strong, and nothing else. It sets an aside apart without colour: it has no background, radius or variant."
      >
        <div className="l-measure">
          <p className="body">
            Bata as claras em neve e reserve na geladeira enquanto prepara o
            restante da massa.
          </p>
          <div className="callout">
            <p className="body">
              Se a sua batedeira for fraca, bata as claras com uma pitada de sal:
              elas firmam mais depressa e nao desandam quando entram na massa.
            </p>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};
