// notebook-layout/stories/atoms/ReaderMarks.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox, Radio, Switch } from '@components/reader-marks';
import {
  Chip,
  Chips,
  FilterChip,
  RemovableChip,
} from '@components/chips/chips';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atoms/Reader marks',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Checkbox, radio, switch and chip. Navigate with Tab to see the browser ring outline the whole LINE, which is exactly the clickable area.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxRadioSwitch: Story = {
  name: 'Checkbox, radio and switch',
  render: () => (
    <Sheet>
      <Group
        title="Checkbox"
        note="Checked, it fills in neutral-solid with the cut-out tick. The tick is Phosphor's Check at bold weight in 14px: at that size it gives the same stroke thickness as the other icons at 20px, so the weight changes for the ink to stay the same."
      >
        <Row label="unchecked">
          <Checkbox label="Por e-mail" />
        </Row>
        <Row label="checked">
          <Checkbox label="Por e-mail" defaultChecked />
        </Row>
        <Row label="indeterminate">
          <Checkbox
            label="Todos os avisos"
            ref={(node) => {
              if (node) node.indeterminate = true;
            }}
          />
        </Row>
        <Row label="error">
          <Checkbox label="Aceito os termos" aria-invalid />
        </Row>
        <Row label="disabled">
          <Checkbox label="No aplicativo" disabled />
          <Checkbox label="Por e-mail" defaultChecked disabled />
        </Row>
      </Group>

      <Group
        title="Radio"
        note="Round, and it is the only exception to the radius rule: there the shape IS the meaning — round is single choice, square is multiple choice. A sharp-cornered radio would read as a checkbox."
      >
        <Row label="group">
          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="form-legend">Como medir</legend>
            <Radio label="Em xicaras" name="measure" defaultChecked />
            <Radio label="Em gramas" name="measure" />
          </fieldset>
        </Row>
      </Group>

      <Group
        title="Switch"
        note="Square, with the control radius. Its shape comes from the sliding thumb, not from the pill: a nearly sharp-cornered track with a square thumb belongs to the system's paper."
      >
        <Row label="off">
          <Switch label="Guardar rascunho" />
        </Row>
        <Row label="on">
          <Switch label="Guardar rascunho" defaultChecked />
        </Row>
        <Row label="disabled">
          <Switch label="Guardar rascunho" disabled />
        </Row>
      </Group>

      <Group
        title="Without label"
        note="When whoever assembles it has already wrapped the control in its own label, the target is the 44px box. Same rule, smaller layout."
      >
        <Row label="the box alone">
          <Checkbox aria-label="Selecionar" defaultChecked />
          <Radio aria-label="Escolher" name="loose" />
          <Switch aria-label="Alternar" />
        </Row>
      </Group>
    </Sheet>
  ),
};

const ChipDemo = () => {
  const [noOven, setNoOven] = useState(true);
  const [quick, setQuick] = useState(false);
  const [items, setItems] = useState(['Queijo', 'Tomate', 'Manjericao']);

  return (
    <Sheet>
      <Group
        title="Choice chip"
        note="An input inside a named group. With radio the group is single choice, which is the right component for it — the FILTER chip exists only for multiple choice."
      >
        <Chips name="time" legend="Tempo de preparo" type="radio">
          <Chip defaultChecked>Ate 30 minutos</Chip>
          <Chip>Ate 1 hora</Chip>
          <Chip>Mais de 1 hora</Chip>
        </Chips>
      </Group>

      <Group
        title="Filter chip"
        note="The tick is what marks the selection without relying on colour. It enters on the left and shifts the text: the chip gets a little wider when selected, and that is accepted — reserving the tick's space on the unselected chip would leave an unbalanced gap in all of them."
      >
        <div className="chip-group" role="group" aria-label="Filtrar receitas">
          <FilterChip selected={noOven} onClick={() => setNoOven((v) => !v)}>
            Sem forno
          </FilterChip>
          <FilterChip selected={quick} onClick={() => setQuick((v) => !v)}>
            Rapido <span className="count">12</span>
          </FilterChip>
          <FilterChip selected={false} disabled>
            Vegetariano
          </FilterChip>
        </div>
      </Group>

      <Group
        title="Removable chip"
        note="The body is not clickable; only the X is. On the X's hover the whole chip darkens, because it is the one leaving. The accessible name says the whole action: 'Remover queijo', never just 'Remover'."
      >
        <div className="chip-group">
          {items.map((item) => (
            <RemovableChip
              key={item}
              removeLabel={`Remover ${item.toLowerCase()}`}
              onRemove={() =>
                setItems((rest) => rest.filter((name) => name !== item))
              }
            >
              {item}
            </RemovableChip>
          ))}
        </div>
      </Group>
    </Sheet>
  );
};

export const ChipComponent: Story = {
  name: 'Chip',
  render: () => <ChipDemo />,
};
