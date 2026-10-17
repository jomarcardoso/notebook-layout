// notebook-layout/stories/layout/ColumnsAndSplit.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties, type FC, type ReactNode } from 'react';
import { Button } from '@components/atoms';
import { LineList, LineListItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { figures, photos } from '../molecules/figures';

const meta = {
  title: 'Layout/Columns and split',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Columns decided by the room the piece has, never by the window. The regions change with orientation, so a window width says nothing about the room left inside the content: a 1024px landscape tablet leaves the content 465px, less than a 768px portrait one. l-columns fits as many columns as there is room for; l-split lays two different parts side by side from 560px of its own width. Each specimen below sits in frames of fixed width, the room the content has on a phone (343px), a landscape tablet with the apparatus (465px) and a portrait tablet (720px).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const WIDTHS = [
  { width: 343, label: '343px, phone' },
  { width: 465, label: '465px, landscape tablet' },
  { width: 720, label: '720px, portrait tablet' },
];

const Frames: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="l-stack">
    {WIDTHS.map(({ width, label }) => (
      <div key={width} className="l-stack -block">
        <span className="caption">{label}</span>
        <div
          style={{
            border: '1px dashed var(--app-rule)',
            inlineSize: width,
            maxInlineSize: '100%',
            padding: 'var(--app-space-sm)',
          }}
        >
          {children}
        </div>
      </div>
    ))}
  </div>
);

const INGREDIENTS = [
  { text: '2 xicaras de farinha de trigo', figure: figures.flour },
  { text: '1 xicara de acucar', figure: figures.sugar },
  { text: '3 ovos', figure: figures.egg },
];

const STEPS = [
  'Bata os ovos com o acucar ate formar um creme claro.',
  'Junte a farinha aos poucos, mexendo devagar.',
  'Asse em forno medio por 40 minutos.',
];

export const Columns: Story = {
  name: 'l-columns',
  render: () => (
    <Sheet>
      <Group
        title="Peers that fit by room"
        note="The ingredients beside the method. Each column takes at least 280px (--l-columns-min), so the two stand side by side only where 280 + 280 and the gutter fit; at 343px and 465px they stack, at 720px they share the line. No breakpoint is written anywhere."
      >
        <Frames>
          <div className="l-columns">
            <section className="l-stack -block">
              <h3 className="section-title -center">Ingredientes</h3>
              <LineList>
                {INGREDIENTS.map(({ text, figure }) => (
                  <LineListItem key={text} figure={figure}>
                    {text}
                  </LineListItem>
                ))}
              </LineList>
            </section>
            <section className="l-stack -block">
              <h3 className="section-title -center">Modo de preparo</h3>
              <LineList family="steps">
                {STEPS.map((step) => (
                  <LineListItem key={step}>{step}</LineListItem>
                ))}
              </LineList>
            </section>
          </div>
        </Frames>
      </Group>

      <Group
        title="Thumbnails with the knobs"
        note="The photos chosen for a recipe: --l-columns-min at 140px fits two on a phone and more as the room grows, and --l-columns-gap brings both gaps down to the inner scale, since the thumbnails are one block and not a flow."
      >
        <Frames>
          <ol
            className="l-columns"
            style={
              {
                '--l-columns-gap': 'var(--app-space-xs)',
                '--l-columns-min': '140px',
              } as CSSProperties
            }
          >
            {Object.entries(photos).map(([name, src]) => (
              <li key={name}>
                <img className="app-image" src={src} alt="" />
              </li>
            ))}
          </ol>
        </Frames>
      </Group>
    </Sheet>
  ),
};

export const Split: Story = {
  name: 'l-split',
  render: () => (
    <Sheet>
      <Group
        title="A drawing beside its text"
        note="Two different parts: read in sequence when the frame is narrow, side by side from 560px of the frame's own width. Stacked they are centred; side by side each starts at the start of its part. --l-grow on each part sets its share as a whole number, here 5 and 7, like col-5 and col-7."
      >
        <Frames>
          <div className="l-split">
            <img
              className="app-image"
              src={photos.cake}
              alt=""
              style={{ '--l-grow': 5 } as CSSProperties}
            />
            <div
              className="l-stack -block"
              style={{ '--l-grow': 7 } as CSSProperties}
            >
              <h3 className="title-md">Seu caderninho comecou.</h3>
              <p className="body">
                Continue de onde parou: cada receita que voce escrever fica
                aqui.
              </p>
            </div>
          </div>
        </Frames>
      </Group>
    </Sheet>
  ),
};

export const SplitWithAction: Story = {
  name: 'l-split with flex-grow-0',
  render: () => (
    <Sheet>
      <Group
        title="A heading and its one action"
        note="CoreUI's flex-grow-0 keeps a part at its content's width, up to half the line, and the parts that grow take the rest. Stacked, both are centred."
      >
        <Frames>
          <div className="l-split">
            <h3 className="title-lg">Minhas receitas</h3>
            <div className="flex-grow-0">
              <Button weight="commitment">Escrever receita</Button>
            </div>
          </div>
        </Frames>
      </Group>

      <Group
        title="The fixed part first"
        note="The size belongs to the part, so the fixed one can stand on either side."
      >
        <Frames>
          <div className="l-split">
            <div className="flex-grow-0">
              <img className="app-image" src={photos.soup} alt="" width={96} />
            </div>
            <p className="body">
              Sopa de tomate assado, com manjericao e um fio de azeite.
            </p>
          </div>
        </Frames>
      </Group>

      <Group
        title="Three parts"
        note="Any number of parts: two that grow by equal shares and one at its content's width."
      >
        <Frames>
          <div className="l-split">
            <p className="body">Ingredientes conferidos</p>
            <p className="body">Modo de preparo conferido</p>
            <div className="flex-grow-0">
              <Button weight="structural">Revisar</Button>
            </div>
          </div>
        </Frames>
      </Group>
    </Sheet>
  ),
};
