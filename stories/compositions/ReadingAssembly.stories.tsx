// notebook-layout/stories/compositions/ReadingAssembly.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineList, LineListItem } from '@components/molecules';

const meta = {
  title: 'Compositions/Reading assembly',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The reading page across the three regions of l-regions. OPEN PROPOSAL: the anchored index lives in the margin, held by sticky-top, and the apparatus keeps what accompanies the content, nutrition and related recipes. It only closes with three regions if the app navigation rail is a frame and not a region; counting the rail, the screen has four and goes over the ceiling. The decision is in docs/composition.md. As the screen narrows, the regions become a sequence: margin, content, apparatus.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = [
  {
    id: 'ingredientes',
    title: 'Ingredientes',
    text: 'Tres cenouras medias, tres ovos, uma xicara de oleo, duas xicaras de acucar, duas xicaras e meia de farinha de trigo e uma colher de fermento.',
  },
  {
    id: 'preparo',
    title: 'Modo de preparo',
    text: 'Bata as cenouras com os ovos e o oleo ate ficar liso. Junte o acucar e a farinha aos poucos e, por ultimo, o fermento. Asse a 180 graus por quarenta minutos.',
  },
  {
    id: 'cobertura',
    title: 'Cobertura',
    text: 'Leve ao fogo o chocolate, a manteiga e o leite, mexendo ate engrossar. Despeje quente sobre o bolo ainda morno, para escorrer pelos lados.',
  },
];

const NUTRITION = [
  ['Energia', '255 kcal'],
  ['Carboidratos', '34,1 g'],
  ['Proteinas', '4,9 g'],
  ['Gorduras', '10,9 g'],
];

export const Recipe: Story = {
  render: () => (
    <div className="l-regions" style={{ padding: 'var(--app-gutter)' }}>
      <nav className="l-regions__margin" aria-label="Nesta receita">
        <div className="sticky-top">
          <LineList family="data">
            {SECTIONS.map(({ id, title }, index) => (
              <LineListItem key={id} href={`#${id}`} selected={index === 0}>
                {title}
              </LineListItem>
            ))}
          </LineList>
        </div>
      </nav>

      <article className="l-regions__content">
        <div className="l-stack -container">
          {SECTIONS.map(({ id, title, text }) => (
            <section key={id} id={id}>
              <h2 className="section-title text-center">{title}</h2>
              <p className="body">{text}</p>
            </section>
          ))}
        </div>
      </article>

      <aside className="l-regions__apparatus" aria-label="Sobre esta receita">
        <div className="l-stack">
          <section className="l-stack">
            <h2 className="label-sm">Nutricional por porcao</h2>
            <table className="table">
              <tbody>
                {NUTRITION.map(([name, value]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td className="text-end">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="l-stack">
            <h2 className="label-sm">Relacionadas</h2>
            <LineList family="data">
              <LineListItem href="#">Bolo de laranja</LineListItem>
              <LineListItem href="#">Bolo de fuba cremoso</LineListItem>
            </LineList>
          </section>
        </div>
      </aside>
    </div>
  ),
};
