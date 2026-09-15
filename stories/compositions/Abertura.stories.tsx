// notebook-layout/stories/compositions/Abertura.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Composicoes/Abertura',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A abertura de uma pagina de leitura: figura 1:1, titulo em display, headnote em subtitle e a ficha no papel logo abaixo. E composicao de pecas que ja existem — grade, .app-image, tipografia e .facts —, sem CSS proprio.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FICHA = [
  ['Preparo', '50 min'],
  ['Rende', '12 porcoes'],
  ['Energia', '255 kcal'],
];

const Abertura = ({ foto = '' }: { foto?: string }) => (
  <header className="row">
    <div className="col-md-4">
      {foto ? (
        <img className="app-image" src={foto} alt="Bolo de cenoura com cobertura" />
      ) : (
        <span className="app-image" aria-hidden="true" />
      )}
    </div>
    <div className="col-md-8">
      <div className="l-stack -tight">
        <h1 className="display">Bolo de cenoura da vo Lurdes</h1>
        <p className="subtitle">
          O de todo aniversario. A cobertura vai quente, para escorrer pelos
          lados.
        </p>
        <dl className="facts">
          {FICHA.map(([rotulo, valor]) => (
            <div className="facts__item" key={rotulo}>
              <dt className="facts__label">{rotulo}</dt>
              <dd className="facts__value">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </header>
);

export const ComFoto: Story = {
  name: 'Com foto',
  render: () => (
    <Sheet>
      <Group
        title="Com foto"
        note="A figura ocupa as quatro colunas e o texto as oito. Abaixo de md a figura vem primeiro e o texto depois, na mesma ordem de leitura."
      >
        <Abertura foto={photos.bolo} />
      </Group>
    </Sheet>
  ),
};

export const SemFoto: Story = {
  name: 'Sem foto',
  render: () => (
    <Sheet>
      <Group
        title="Sem foto"
        note="O lugar da imagem continua ocupado pelo lavado bg-subtle. O titulo nao sobe para ocupar o espaco: a abertura tem a mesma forma com e sem foto."
      >
        <Abertura />
      </Group>
    </Sheet>
  ),
};
