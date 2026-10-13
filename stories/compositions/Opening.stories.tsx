// notebook-layout/stories/compositions/Opening.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@components/atoms';
import { ExpandableText } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Compositions/Opening',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The opening of a reading page: display title, the fact sheet, the 1:1 figure, the headnote cut at four lines and the action line. Narrow, it is a sequence in DOM order; with content width, the figure moves to the right, pinned to the top of the title.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FACT_SHEET = [
  ['Rendimento', '12 fatias'],
  ['Tempo de preparo', '1 h 10 min'],
  ['Dificuldade', 'Facil'],
];

const LONG_HEADNOTE =
  'Ela fazia aos domingos, sempre na forma de furo que veio do enxoval. Aprendi olhando, porque ela nunca mediu nada, e passei anos errando o ponto ate entender que o segredo e nao bater depois de colocar o queijo.\n\nEsta versao e a mais perto que cheguei da dela.';

const Opening = ({ photo = '', headnote = '' }) => (
  <header className={photo ? 'opening opening--with-figure' : 'opening'}>
    <div className="opening__grid">
      <h1 className="display opening__title">
        Bolo de fuba cremoso da vo Lurdes
      </h1>
      <dl className="description-list">
        {FACT_SHEET.map(([label, value]) => (
          <div className="description-list__item" key={label}>
            <dt className="description-list__term">{label}</dt>
            <dd className="description-list__details">{value}</dd>
          </div>
        ))}
      </dl>
      {photo && (
        <div className="opening__figure">
          <img className="app-image" src={photo} alt="" />
        </div>
      )}
      {headnote && <ExpandableText text={headnote} textClassName="subtitle" />}
      <div className="opening__actions">
        <Button weight="text">Editar</Button>
        <Button weight="text">Compartilhar</Button>
        <Button weight="destructive">Apagar</Button>
      </div>
    </div>
  </header>
);

export const WithPhoto: Story = {
  name: 'With photo',
  render: () => (
    <Sheet>
      <Group
        title="With photo and long headnote"
        note="The headnote cuts at four lines and only then gets Continue reading, which reveals in place. Below 600px of content the figure sits between the fact sheet and the headnote."
      >
        <Opening photo={photos.cake} headnote={LONG_HEADNOTE} />
      </Group>
    </Sheet>
  ),
};

export const WithoutPhoto: Story = {
  name: 'Without photo',
  render: () => (
    <Sheet>
      <Group
        title="Without photo, short headnote"
        note="Nothing takes the figure's place, and the text moves up. The short headnote has no button, because there is no cut."
      >
        <Opening headnote="Pra usar o arroz que sobrou do almoco." />
      </Group>
    </Sheet>
  ),
};
