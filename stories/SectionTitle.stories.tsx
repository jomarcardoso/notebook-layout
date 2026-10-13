// notebook-layout/stories/SectionTitle.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from './atoms/specimen';

const meta = {
  title: 'Typography/Section title',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The section title is a class, .section-title, on the heading of whatever level the page asks for: title-md role with a rule underneath. The modifiers change the size, the alignment and the rule.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Sheet>
      <Group title=".section-title">
        <Row label="default">
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
