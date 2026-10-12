// notebook-layout/stories/SectionTitle.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from './atoms/specimen';

const meta = {
  title: 'Tipografia/Titulo de secao',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O titulo de secao e uma classe, .section-title, no heading do nivel que a pagina pedir: papel title-md com um fio embaixo. Os modificadores mudam o tamanho, o alinhamento e o fio.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variantes: Story = {
  render: () => (
    <Sheet>
      <Group title=".section-title">
        <Row label="padrao">
          <h2 className="section-title">Ingredientes</h2>
        </Row>
        <Row label="-sub">
          <h3 className="section-title -sub">Massa</h3>
        </Row>
        <Row label="-center">
          <h2 className="section-title -center">Modo de preparo</h2>
        </Row>
        <Row label="-plain">
          <h2 className="section-title -plain">Relacionadas</h2>
        </Row>
      </Group>
    </Sheet>
  ),
};
