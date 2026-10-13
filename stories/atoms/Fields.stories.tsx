// notebook-layout/stories/atoms/Fields.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Icon, IconButton, Select, Textarea } from '@components/atoms';
import { Field } from '@components/field';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atoms/Fields',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Click a field to see focus: the base rule thickens and darkens, the text does NOT move, and the browser ring outlines the whole box.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Block = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gap: 'var(--app-rhythm-1)' }}>{children}</div>
);

export const SingleLine: Story = {
  name: 'Single line',
  render: () => (
    <Sheet>
      <Group
        title="States"
        note="The rule's ink grows from rest to focus. The text sits close to the rule and the rest of the 44px box stays above it — if the text floated in the middle of the box, input and textarea would stop being the same family."
      >
        <Block>
          <Field label="Repouso" placeholder="Bolo de cenoura" />
          <Field label="Com texto" defaultValue="Bolo de cenoura" />
          <Field label="Com ajuda" hint="O nome que voce daria em casa." />
          <Field label="Com erro" error="Escreva um titulo." />
          <Field label="Opcional" optional placeholder="Um subtitulo curto" />
          <Field label="Desabilitado" disabled defaultValue="Bolo de cenoura" />
          <Field
            label="Somente leitura"
            readOnly
            defaultValue="Bolo de cenoura"
          />
        </Block>
      </Group>
    </Sheet>
  ),
};

export const RuledSheet: Story = {
  name: 'Ruled sheet',
  render: () => (
    <Sheet>
      <Group
        title="Textarea"
        note="The LAST line of the ruling is the base rule, drawn stronger: the label marks the start, the rule marks the end, and the faint ruling fills the middle. There is no double rule because there are never two lines in the same place."
      >
        <Block>
          <Field
            label="Modo de preparo"
            multiline
            minRows={4}
            placeholder="Um passo por linha, na ordem em que acontecem."
          />
          <Field
            label="Com texto"
            multiline
            minRows={4}
            defaultValue={
              'Bata as claras em neve.\nMisture a farinha.\nLeve ao forno.'
            }
          />
        </Block>
      </Group>

      <Group
        title="Handwriting belongs to every text field"
        note="Handwriting is not a modifier: it is the lettering of every text field, and it is what makes the notebook somebody's notebook. The select stays out, because it shows a value chosen from a list the product wrote — not a phrase the person typed."
      >
        <div>
          <label className="form-label" htmlFor="handwritten">
            Uma nota sua
          </label>
          <Textarea
            id="handwritten"
            rows={3}
            defaultValue={
              'A do jeito da vovo leva\numa colher a mais de acucar.'
            }
          />
        </div>
      </Group>

      <Group
        title="A single line"
        note="A one-line textarea looks identical to an input. That is what makes the two a real family, instead of two similar components."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-rhythm-1)',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Field label="Input" defaultValue="Bolo de cenoura" />
          <div>
            <label className="form-label" htmlFor="one">
              Textarea
            </label>
            <Textarea id="one" rows={1} defaultValue="Bolo de cenoura" />
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};

export const WithMarkers: Story = {
  name: 'With margin column',
  render: () => (
    <Sheet>
      <Group
        title="Sheet with markers"
        note="One mark per line, in the margin column, each the height of one rhythm line. The ruling and the column line up because both read the same unit."
      >
        <Field
          label="Ingredientes desta parte"
          multiline
          minRows={4}
          listStyle="disc"
          defaultValue={'2 xicaras de farinha\n1 ovo\n200 g de queijo ralado'}
          hint="Um ingrediente por linha, com a quantidade junto."
        />
      </Group>
    </Sheet>
  ),
};

const SelectAndAdornments = () => {
  const [term, setTerm] = useState('cenoura');
  const [visible, setVisible] = useState(false);

  return (
    <Sheet>
      <Group
        title="Select"
        note="The options list is still the system's: on a phone, the native picker is better than any recreated list, and it is already accessible. What changes is the closed box, which is the text field's with the arrow at the end."
      >
        <Block>
          <Field
            label="Unidade"
            options={[
              { value: 'g', label: 'Gramas' },
              { value: 'ml', label: 'Mililitros' },
              { value: 'cup', label: 'Xicaras' },
            ]}
          />
          <Field
            label="Desabilitado"
            disabled
            options={[{ value: 'g', label: 'Gramas' }]}
          />
        </Block>
      </Group>

      <Group
        title="Adornments"
        note="Only three exist. The magnifier is decorative — it says what kind of field this is, but it is not clickable, which is why it stays in supporting ink. Clear and show password are real buttons, with an accessible name and full ink."
      >
        <div>
          <label className="form-label" htmlFor="search">
            Buscar
          </label>
          <div className="field-adorned">
            <Icon icon={MagnifyingGlassIcon} className="field-adorned-lead" />
            <input
              id="search"
              className="form-control"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.currentTarget.value)}
            />
            {term && (
              <div className="field-adorned-trail">
                <IconButton
                  icon={XIcon}
                  label="Limpar busca"
                  onClick={() => setTerm('')}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="password">
            Senha
          </label>
          <div className="field-adorned">
            <input
              id="password"
              className="form-control"
              type={visible ? 'text' : 'password'}
              defaultValue="segredo"
              autoComplete="current-password"
            />
            <div className="field-adorned-trail">
              <IconButton
                icon={EyeIcon}
                label="Mostrar senha"
                pressed={visible}
                onClick={() => setVisible((v) => !v)}
              />
            </div>
          </div>
        </div>
      </Group>

      <Group
        title="Field with an action beside it"
        note="A field has at most one adornment at the start and one button at the end. When the action is a verb, it leaves the field and becomes a button on the line."
      >
        <Row label="search with button">
          <Select
            aria-label="Onde buscar"
            options={[
              { value: 'mine', label: 'Minhas receitas' },
              { value: 'all', label: 'Todas' },
            ]}
          />
        </Row>
      </Group>
    </Sheet>
  );
};

export const SelectAndAdornmentsStory: Story = {
  name: 'Select and adornments',
  render: () => <SelectAndAdornments />,
};
