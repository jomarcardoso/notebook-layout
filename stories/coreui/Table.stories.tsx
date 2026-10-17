// notebook-layout/stories/coreui/Table.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '@components/reader-marks';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Table',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CoreUI\'s .table configured in the entry, with what no variable expresses in the _table.scss atom. A table is a data page: horizontal rules, header in a short label and supporting ink, number columns in numeric aligned to the end. These do not exist in this system: table-striped (zebra), table-bordered (vertical rule), table-borderless, table-dark, the colour variants and table-group-divider — a row group is a th with scope="rowgroup".',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const MACRONUTRIENTS = [
  { name: 'Energia', portion: '382 kcal', per100g: '255 kcal', dailyValue: '19%' },
  { name: 'Carboidratos', portion: '51,2 g', per100g: '34,1 g', dailyValue: '17%' },
  { name: 'Proteinas', portion: '7,4 g', per100g: '4,9 g', dailyValue: '10%' },
  { name: 'Gorduras totais', portion: '16,4 g', per100g: '10,9 g', dailyValue: '30%' },
];

const MINERALS = [
  { name: 'Calcio', portion: '120 mg', per100g: '80 mg', dailyValue: '12%' },
  { name: 'Ferro', portion: '2,1 mg', per100g: '1,4 mg', dailyValue: '15%' },
  { name: 'Sodio', portion: '310 mg', per100g: '207 mg', dailyValue: '13%' },
];

type Nutrient = (typeof MACRONUTRIENTS)[number];

const TableHead = () => (
  <thead>
    <tr>
      <th scope="col">Nutriente</th>
      <th scope="col" className="text-end">
        Porcao
      </th>
      <th scope="col" className="text-end">
        100 g
      </th>
      <th scope="col" className="text-end">
        %VD
      </th>
    </tr>
  </thead>
);

const NutrientRow = ({ name, portion, per100g, dailyValue }: Nutrient) => (
  <tr>
    <th scope="row">{name}</th>
    <td className="text-end">{portion}</td>
    <td className="text-end">{per100g}</td>
    <td className="text-end">{dailyValue}</td>
  </tr>
);

export const Data: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Data"
        note="The basic table. One rule under each row, the header one a step darker. The row name is a th with scope row, and each number column carries .numeric on the cell and on the header."
      >
        <table className="table">
          <caption>
            Valores por portion de 150 g, calculados pela tabela de composicao
            dos alimentos.
          </caption>
          <TableHead />
          <tbody>
            {MACRONUTRIENTS.map((nutrient) => (
              <NutrientRow key={nutrient.name} {...nutrient} />
            ))}
          </tbody>
        </table>
      </Group>
    </Sheet>
  ),
};

export const RowGroups: Story = {
  name: 'Row groups',
  render: () => (
    <Sheet>
      <Group
        title="Row groups"
        note="One tbody per group, and the group name is a th with scope rowgroup in label. It is set apart by space above and by typography; it gets no band and no rule of its own."
      >
        <table className="table">
          <TableHead />
          {[
            { group: 'Macronutrientes', rows: MACRONUTRIENTS },
            { group: 'Minerais', rows: MINERALS },
          ].map(({ group, rows }) => (
            <tbody key={group}>
              <tr>
                <th scope="rowgroup" colSpan={4}>
                  {group}
                </th>
              </tr>
              {rows.map((nutrient) => (
                <NutrientRow key={nutrient.name} {...nutrient} />
              ))}
            </tbody>
          ))}
        </table>
      </Group>
    </Sheet>
  ),
};

const RECIPES = [
  { name: 'Bolo de laranja', list: 'Doces', servings: '12' },
  { name: 'Pao de queijo', list: 'Lanches', servings: '30' },
  { name: 'Feijoada', list: 'Almoco de domingo', servings: '8' },
];

const ActionRowsDemo = () => {
  const [chosen, setChosen] = useState(RECIPES[0].name);

  return (
    <Sheet>
      <Group
        title="Action rows"
        note="table-hover paints the hover wash only on devices with hover, and only makes sense when the row leads somewhere: the link sits in the first cell. table-active marks the chosen row with the selected wash and emphasis ink."
      >
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Receita</th>
              <th scope="col">Lista</th>
              <th scope="col" className="text-end">
                Porcoes
              </th>
            </tr>
          </thead>
          <tbody>
            {RECIPES.map(({ name, list, servings }) => (
              <tr
                key={name}
                className={chosen === name ? 'table-active' : ''}
              >
                <th scope="row">
                  <a
                    className="link"
                    href="#"
                    aria-current={chosen === name ? 'true' : 'false'}
                    onClick={(event) => {
                      event.preventDefault();
                      setChosen(name);
                    }}
                  >
                    {name}
                  </a>
                </th>
                <td>{list}</td>
                <td className="text-end">{servings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Group>
    </Sheet>
  );
};

export const ActionRows: Story = {
  name: 'Action rows',
  render: () => <ActionRowsDemo />,
};

const FIELDS = [
  { field: 'Nome', base: 'Farinha de trigo', proposal: 'Farinha de trigo integral' },
  { field: 'Densidade', base: '0,59 g/ml', proposal: '0,55 g/ml' },
  { field: 'Categoria', base: 'Graos', proposal: 'Farinhas' },
];

const CheckboxDemo = () => {
  const [marked, setMarked] = useState<string[]>([FIELDS[0].field]);

  return (
    <Sheet>
      <Group
        title="With checkbox"
        note="The first column chooses the rows. The box is the library Checkbox with an accessible name, and the row stays a data row: the choice does not change its background."
      >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Usar</th>
              <th scope="col">Campo</th>
              <th scope="col">Base</th>
              <th scope="col">Proposta</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map(({ field, base, proposal }) => (
              <tr key={field}>
                <td>
                  <Checkbox
                    aria-label={`Usar ${field}`}
                    checked={marked.includes(field)}
                    onChange={(event) =>
                      setMarked(
                        event.target.checked
                          ? [...marked, field]
                          : marked.filter((item) => item !== field),
                      )
                    }
                  />
                </td>
                <th scope="row">{field}</th>
                <td>{base}</td>
                <td>{proposal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Group>
    </Sheet>
  );
};

export const WithCheckbox: Story = {
  name: 'With checkbox',
  render: () => <CheckboxDemo />,
};

export const InApparatus: Story = {
  name: 'In the apparatus',
  render: () => (
    <Sheet>
      <Group
        title="In the apparatus"
        note="In a margin note the table stays at the apparatus measure, without a variant: the same .table, without taking the content width."
      >
        <div className="l-measure -apparatus">
          <table className="table">
            <tbody>
              {MACRONUTRIENTS.map(({ name, portion }) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td className="text-end">{portion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
    </Sheet>
  ),
};

const COLUMNS = ['Quantidade', 'Energia', 'Carboidratos', 'Proteinas', 'Gorduras', 'Fibras'];

const INGREDIENTS = [
  ['Farinha de trigo', '240 g', '871 kcal', '182,6 g', '23,5 g', '2,4 g', '5,8 g'],
  ['Acucar', '180 g', '697 kcal', '179,6 g', '0 g', '0 g', '0 g'],
  ['Ovos', '150 g', '215 kcal', '1,1 g', '18,9 g', '14,3 g', '0 g'],
];

export const Scroll: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Scroll"
        note="When the columns do not fit, table-responsive scrolls the table horizontally and the page stays still. The columns do not wrap and the table does not change its look by screen width."
      >
        <div className="table-responsive" style={{ maxInlineSize: '28rem' }}>
          <table className="table" style={{ minInlineSize: '44rem' }}>
            <thead>
              <tr>
                <th scope="col">Ingrediente</th>
                {COLUMNS.map((column) => (
                  <th key={column} scope="col" className="text-end">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INGREDIENTS.map(([name, ...values]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  {values.map((value, index) => (
                    <td key={COLUMNS[index]} className="text-end">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
    </Sheet>
  ),
};
