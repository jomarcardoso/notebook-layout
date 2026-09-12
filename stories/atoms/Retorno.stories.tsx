// notebook-layout/stories/atoms/Retorno.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Button, Progress, SkeletonText, Waiting } from '@components/atoms';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atomos/Retorno',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Esqueleto: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Forma tipografica"
        note="O esqueleto desenha a forma do que vem, e nao retangulos genericos: cada linha vira uma barra fina centrada na linha do ritmo, com a altura das letras daquele papel. Visto de longe, um paragrafo de esqueleto tem o mesmo desenho de um paragrafo de verdade, e a troca pelo conteudo real nao mexe em nada ao redor."
      >
        <div aria-busy="true" style={{ maxInlineSize: '30rem' }}>
          <div className="title-md">
            <span
              className="skeleton skeleton-line"
              style={{ inlineSize: '70%' }}
            />
          </div>
          <p className="p">
            <SkeletonText lines={4} />
          </p>
        </div>
      </Group>

      <Group
        title="Lado a lado com o conteudo"
        note="A mesma medida, o mesmo ritmo. Se o esqueleto e o texto nao ocupam o mesmo espaco, a pagina pula quando o conteudo chega."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-space-lg)',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <p className="p">
            Bata as claras em neve e reserve. Misture a farinha peneirada com o
            fermento e junte as gemas, mexendo devagar ate a massa ficar lisa.
          </p>
          <p className="p" aria-busy="true">
            <SkeletonText lines={4} />
          </p>
        </div>
      </Group>
    </Sheet>
  ),
};

const ProgressoDemo = () => {
  const [valor, setValor] = useState(12);

  useEffect(() => {
    const id = setInterval(() => setValor((v) => (v >= 100 ? 0 : v + 4)), 450);

    return () => clearInterval(id);
  }, []);

  return (
    <Sheet>
      <Group
        title="Barra de progresso"
        note="Um fio que se enche de tinta: o trilho e o fio do sistema, com 4px e sem raio, e o que avanca e tinta solida neutra. Ela sempre vem com o VALOR ESCRITO ao lado — assim o trilho nao carrega a informacao sozinho."
      >
        <div style={{ maxInlineSize: '24rem' }}>
          <Progress label="Enviando a imagem" value={valor} />
        </div>
      </Group>

      <Group
        title="Spinner"
        note="Um anel do tamanho de um icone, com o traco de um icone, em currentColor: ele se comporta como icone de sistema e pega a tinta do lugar onde esta. Sozinho numa regiao, aparece depois de 300ms."
      >
        <Waiting />
      </Group>

      <Group
        title="Botao carregando"
        note="O retorno fica onde o olho ja esta. O botao mantem forma, cor e largura; o rotulo some por opacidade e continua no lugar, entao a largura e o nome acessivel ficam."
      >
        <Row label="em curso">
          <Button weight="compromisso" loading>
            Guardar receita
          </Button>
        </Row>
      </Group>

      <p className="caption">
        Progresso sem medida nao existe como barra. Se nao da para saber quanto
        falta, o retorno e o spinner.
      </p>
    </Sheet>
  );
};

export const Progresso: Story = {
  render: () => <ProgressoDemo />,
};
