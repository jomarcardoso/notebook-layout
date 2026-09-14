// notebook-layout/stories/coreui/Grade.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { LineList, LineListItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Grade',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A grade de 12 colunas do CoreUI usada direto, porque e mecanica. A calha e a da biblioteca, 24px, e nao --app-gutter; a troca esta nas pendencias do inventario.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SECOES = ['Ingredientes', 'Modo de preparo', 'Nutricional', 'Relacionadas'];

export const IndiceEConteudo: Story = {
  name: 'Indice e conteudo',
  render: () => (
    <Sheet>
      <Group
        title="4 e 8"
        note="col-md-4 para o indice ancorado e col-md-8 para o conteudo. O indice e uma line-list de links, e position-sticky o prende enquanto o conteudo rola. Abaixo de md as duas colunas viram sequencia, na ordem indice e conteudo."
      >
        <div className="row">
          <div className="col-md-4">
            <nav
              className="position-sticky"
              style={{ insetBlockStart: 0 }}
              aria-label="Nesta receita"
            >
              <LineList>
                {SECOES.map((secao, index) => (
                  <LineListItem key={secao} href="#" selected={index === 0}>
                    {secao}
                  </LineListItem>
                ))}
              </LineList>
            </nav>
          </div>
          <div className="col-md-8">
            <div className="l-stack">
              <h3 className="title-md">Ingredientes</h3>
              <p className="p">
                Duas xicaras de farinha de trigo peneirada, uma xicara de
                acucar, tres ovos e duzentos gramas de queijo ralado na hora.
              </p>
              <h3 className="title-md">Modo de preparo</h3>
              <p className="p">
                Bata as claras em neve e reserve. Misture a farinha com o
                fermento e junte as gemas, mexendo devagar ate a massa ficar
                lisa.
              </p>
            </div>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};
