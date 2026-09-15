// notebook-layout/stories/compositions/MontagemDeLeitura.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineList, LineListItem } from '@components/molecules';

const meta = {
  title: 'Composicoes/Montagem de leitura',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A pagina de leitura nas tres regioes de l-regions. PROPOSTA EM ABERTO: o indice ancorado mora na margem, preso por sticky-top, e o aparato fica com o que acompanha o conteudo, nutricional e relacionadas. Ela so fecha com tres regioes se o trilho de navegacao do app for moldura e nao regiao; contando o trilho, a tela tem quatro e passa do teto. A decisao esta em docs/composition.md. Estreitando a tela, as regioes viram sequencia: margem, conteudo, aparato.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECOES = [
  {
    id: 'ingredientes',
    titulo: 'Ingredientes',
    texto:
      'Tres cenouras medias, tres ovos, uma xicara de oleo, duas xicaras de acucar, duas xicaras e meia de farinha de trigo e uma colher de fermento.',
  },
  {
    id: 'preparo',
    titulo: 'Modo de preparo',
    texto:
      'Bata as cenouras com os ovos e o oleo ate ficar liso. Junte o acucar e a farinha aos poucos e, por ultimo, o fermento. Asse a 180 graus por quarenta minutos.',
  },
  {
    id: 'cobertura',
    titulo: 'Cobertura',
    texto:
      'Leve ao fogo o chocolate, a manteiga e o leite, mexendo ate engrossar. Despeje quente sobre o bolo ainda morno, para escorrer pelos lados.',
  },
];

const NUTRICIONAL = [
  ['Energia', '255 kcal'],
  ['Carboidratos', '34,1 g'],
  ['Proteinas', '4,9 g'],
  ['Gorduras', '10,9 g'],
];

export const Receita: Story = {
  render: () => (
    <div className="l-regions" style={{ padding: 'var(--app-gutter)' }}>
      <nav className="l-regions__margin" aria-label="Nesta receita">
        <div className="sticky-top">
          <LineList family="data">
            {SECOES.map(({ id, titulo }, index) => (
              <LineListItem key={id} href={`#${id}`} selected={index === 0}>
                {titulo}
              </LineListItem>
            ))}
          </LineList>
        </div>
      </nav>

      <article className="l-regions__content">
        <div className="l-stack -loose">
          {SECOES.map(({ id, titulo, texto }) => (
            <section key={id} id={id}>
              <h2 className="section-title">{titulo}</h2>
              <p className="p">{texto}</p>
            </section>
          ))}
        </div>
      </article>

      <aside className="l-regions__apparatus" aria-label="Sobre esta receita">
        <div className="l-stack">
          <section className="l-stack -tight">
            <h2 className="label-sm">Nutricional por porcao</h2>
            <table className="table table-sm">
              <tbody>
                {NUTRICIONAL.map(([nome, valor]) => (
                  <tr key={nome}>
                    <th scope="row">{nome}</th>
                    <td className="numeric">{valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="l-stack -tight">
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
