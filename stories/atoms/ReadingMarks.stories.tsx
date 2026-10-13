// notebook-layout/stories/atoms/ReadingMarks.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { HeartIcon } from '@phosphor-icons/react/dist/ssr/Heart';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { withWeight } from '@components/atoms';
import { Icon, Tag } from '@components/atoms';
import { LineList, LineListItem } from '@components/molecules';
import { Group, Row, Sheet } from './specimen';

const HeartFillIcon = withWeight(HeartIcon, 'fill');

const meta = {
  title: 'Atoms/Reading marks',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelHintError: Story = {
  name: 'Label, hint and error',
  render: () => (
    <Sheet>
      <Group
        title="Field label"
        note="Label role, weight 500, in supporting ink: the firm weight makes up for the soft ink, and what was typed is still what weighs most in the field. The system marks the OPTIONAL, never the required — a red asterisk is a form mark, not a book mark."
      >
        <div>
          <label className="form-label" htmlFor="a">
            Titulo da receita
          </label>
          <input className="form-control" id="a" />
        </div>
        <div>
          <label className="form-label" htmlFor="b">
            Subtitulo <span className="form-label-optional">(opcional)</span>
          </label>
          <input className="form-control" id="b" />
        </div>
      </Group>

      <Group
        title="Hint and error"
        note="Both in caption, below the field, linked by aria-describedby. Neither carries an icon: a coloured icon to convey state is an anti-pattern, and the field has already changed its rule. The error message says what to DO, not what went wrong."
      >
        <div>
          <label className="form-label" htmlFor="c">
            Rendimento
          </label>
          <input className="form-control" id="c" aria-describedby="c-hint" />
          <div className="form-text" id="c-hint">
            Quantas porcoes a receita rende.
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="d">
            Titulo da receita
          </label>
          <input
            className="form-control"
            id="d"
            aria-invalid
            aria-describedby="d-err"
          />
          <div className="invalid-feedback" id="d-err">
            Escreva um titulo.
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};

export const TagAndCounter: Story = {
  name: 'Tag, counter and number',
  render: () => (
    <Sheet>
      <Group
        title="Tag"
        note="Static marker: faint wash, supporting ink, caption, zero radius. It does not react to the pointer and carries no icon — a 20px icon next to 14px text weighs more than the word. A tag is washed and a chip is outlined, and that is how the two are told apart by look."
      >
        <Row label="category">
          <Tag>Doces</Tag>
          <Tag>Sem gluten</Tag>
        </Row>
        <Row label="status">
          <Tag status="success">Publicada</Tag>
          <Tag status="warning">Rascunho</Tag>
          <Tag status="danger">Removida</Tag>
        </Row>
        <Row label="counter">
          <Tag count>12</Tag>
        </Row>
      </Group>

      <Group
        title="Inline counter"
        note="Inside another control the counter loses its wash and becomes just the number in faint ink: a wash inside an outline would be a box inside another box."
      >
        <Row label="in a tab">
          <span className="label">
            Minhas receitas <span className="count">28</span>
          </span>
        </Row>
      </Group>

      <Group
        title="Number"
        note="The numeric role is tabular: in a column, the figures line up. It does not speak of the domain — it serves the amount of an ingredient, a nutrition value and a table cell."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-space-2xs)',
            inlineSize: '12rem',
          }}
        >
          {[
            ['Farinha', '250 g'],
            ['Acucar', '80 g'],
            ['Leite', '1 000 ml'],
          ].map(([name, amount]) => (
            <div
              key={name}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>{name}</span>
              <span className="numeric">{amount}</span>
            </div>
          ))}
        </div>
      </Group>
    </Sheet>
  ),
};

export const Iconography: Story = {
  render: () => (
    <Sheet>
      <Group
        title="System icon"
        note="A single size, 20px. In Phosphor the stroke is tied to the weight, so two sizes on the same screen would be two ink thicknesses. It never has a colour of its own: it inherits the ink of the element that contains it."
      >
        <Row label="in body ink">
          <Icon icon={PlusIcon} />
          <Icon icon={MagnifyingGlassIcon} />
          <Icon icon={CaretDownIcon} />
        </Row>
        <Row label="outline and filled">
          <Icon icon={HeartIcon} iconMarked={HeartFillIcon} />
          <Icon icon={HeartIcon} iconMarked={HeartFillIcon} marked />
        </Row>
        <Row label="inheriting ink">
          <span style={{ color: 'var(--app-fg-muted)' }}>
            <Icon icon={PlusIcon} />
          </span>
          <span style={{ color: 'var(--app-fg-accent)' }}>
            <Icon icon={PlusIcon} />
          </span>
          <span style={{ color: 'var(--app-fg-danger)' }}>
            <Icon icon={PlusIcon} />
          </span>
        </Row>
      </Group>
      <p className="caption">
        Filled is not decoration: more ink means more emphasis. Outline is the
        default and filled means MARKED — saved, favourite, the active
        navigation item. A favourite heart is neutral ink, never red: the colour
        &ldquo;of what the drawing represents&rdquo; belongs to the content
        figure.
      </p>
    </Sheet>
  ),
};

export const Ornament: Story = {
  render: () => (
    <Sheet>
      <Group
        title="The lozenge"
        note="A single ornament shape, in two roles. Section mark: larger, in accent, because it is rubrication and belongs to the document. Prose list marker: small, in tertiary ink, in the same margin column. The lists are in Molecules/Lists."
      >
        <div>
          <h3 className="title-md">
            <span className="section-mark" aria-hidden="true" />
            Dicas
          </h3>
          <LineList family="prose">
            <LineListItem>Peneire a farinha com o fermento</LineListItem>
            <LineListItem>Use ovos em temperatura ambiente</LineListItem>
            <LineListItem>Rale o queijo na hora</LineListItem>
          </LineList>
        </div>
      </Group>

      <p className="caption">
        One mark per line: never a marker together with a figure, never a
        lozenge together with a vignette. The section mark rule is per document
        — either every section has it, or none does.
      </p>
    </Sheet>
  ),
};
