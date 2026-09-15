// notebook-layout/stories/compositions/Vitrine.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { ThumbGrid, ThumbItem } from '@components/molecules';
import { Group, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Composicoes/Destaque de vitrine',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A secao de vitrine: um item principal maior (ThumbItem variant featured, texto em title-md) e tres ou quatro secundarios (variant brief, sem imagem, texto em label). A hierarquia e de tamanho, nunca de embalagem. Em todos o link E o item: a area de clique, o hover e o anel de foco sao a mesma caixa.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const UMA_COLUNA = { '--thumb-grid-track': '100%' } as CSSProperties;

const SECUNDARIOS = [
  { titulo: 'Pudim de leite condensado', meta: ['1 h 20 min', '10 porcoes'] },
  { titulo: 'Brigadeiro de colher', meta: ['20 min', '6 porcoes'] },
  { titulo: 'Torta de limao', meta: ['1 h', '8 porcoes'] },
  { titulo: 'Pao de mel', meta: ['45 min', '20 unidades'] },
];

export const Destaque: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Destaque"
        note="Sete colunas para o principal, cinco para os secundarios. O titulo da secao e o unico heading: os itens sao coisas dentro da secao, e nao partes da pagina. Navegue com Tab para ver o anel contornar o item inteiro."
      >
        <section className="l-stack">
          <h2 className="section-title">Doces</h2>
          <div className="row">
            <div className="col-md-7">
              <ThumbGrid style={UMA_COLUNA}>
                <ThumbItem
                  variant="featured"
                  href="#"
                  image={{ src: photos.pudim }}
                  description={['50 min', '12 porcoes', 'Lurdes Cardoso']}
                >
                  Bolo de cenoura da vo Lurdes
                </ThumbItem>
              </ThumbGrid>
            </div>
            <div className="col-md-5">
              <ThumbGrid style={UMA_COLUNA}>
                {SECUNDARIOS.map(({ titulo, meta: descricao }) => (
                  <ThumbItem
                    key={titulo}
                    variant="brief"
                    href="#"
                    description={descricao}
                  >
                    {titulo}
                  </ThumbItem>
                ))}
              </ThumbGrid>
            </div>
          </div>
        </section>
      </Group>
    </Sheet>
  ),
};
