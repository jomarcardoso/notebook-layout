// notebook-layout/stories/coreui/Mechanics.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Row, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'CoreUI/Mechanics',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'What CoreUI delivers as mechanics and is used directly, without CSS of our own: grid, CSS grid, sticky-top, visually-hidden, ratio and text-truncate. The utilities that carry a value — colour, background, border, radius, shadow, typography — are not compiled, and neither are the text-bg-*, link-*, icon-link, focus-ring, vr, vstack, hstack and stretched-link helpers. The full list is in CoreUI/Inventory.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grids: Story = {
  render: () => (
    <Sheet>
      <Group
        title="12-column grid"
        note="row and col-* in flex. The gutter is --app-gutter, 32px. Below md the columns become a sequence: it is reassembly, not restyling."
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
        title="CSS grid"
        note=".grid and g-col-* in CSS grid, the same gutter. For a collection without prose in several columns; an item with prose is a single vertical list."
      >
        <div className="grid">
          {Object.values(photos).map((photo) => (
            <img
              key={photo}
              className="app-image g-col-6 g-col-md-4"
              src={photo}
              alt=""
            />
          ))}
        </div>
      </Group>
    </Sheet>
  ),
};

export const Accessibility: Story = {
  render: () => (
    <Sheet>
      <Group
        title="visually-hidden"
        note="Text only the screen reader reads. The -focusable version appears when it receives focus: it is the skip-to-content link. Press Tab inside the frame to see it."
      >
        <Row label="skip">
          <a className="visually-hidden-focusable" href="#content">
            Pular para o conteudo
          </a>
        </Row>
        <Row label="hidden label">
          <span className="caption">
            3 823 <span className="visually-hidden">quilocalorias</span>
            <span aria-hidden="true">kcal</span>
          </span>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const RatioAndTruncation: Story = {
  name: 'Ratio and truncation',
  render: () => (
    <Sheet>
      <Group
        title="ratio"
        note="For video and embeds at the system image ratio, 1:1. The photo stays in .app-image, which already carries the ratio through the token."
      >
        <div className="ratio ratio-1x1" style={{ maxInlineSize: '12rem' }}>
          <span className="app-image" />
        </div>
      </Group>

      <Group
        title="text-truncate"
        note="A single line, with an ellipsis. It serves a short label in a narrow place; never prose, which respects the measure and wraps."
      >
        <p className="label text-truncate" style={{ maxInlineSize: '16rem' }}>
          Torta de frango de liquidificador com massa que nao precisa de sova
        </p>
      </Group>
    </Sheet>
  ),
};
