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
          'The section title is a class, .section-title, on the heading of whatever level the page asks for: title-md role with a rule underneath. Its only modifier is -sub, the title-sm size. A heading that needs another look uses one of the title roles (display, title-lg, title-md, title-sm), never a new section-title variant.',
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
      </Group>
    </Sheet>
  ),
};
