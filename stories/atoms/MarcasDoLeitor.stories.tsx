// notebook-layout/stories/atoms/MarcasDoLeitor.stories.tsx
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
  title: 'Atomos/Marcas do leitor',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Caixa de marcar, radio, interruptor e chip. Navegue por Tab para ver o anel do navegador contornar a LINHA inteira, que e exatamente a area clicavel.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CaixaRadioInterruptor: Story = {
  name: 'Caixa, radio e interruptor',
  render: () => (
    <Sheet>
      <Group
        title="Caixa de marcar"
        note="Marcada, ela preenche em neutral-solid com o tique recortado. O tique e o Check da Phosphor no peso bold em 14px: nesse tamanho ele da a mesma espessura de traco dos outros icones em 20px, entao o peso muda para a tinta continuar igual."
      >
        <Row label="desmarcada">
          <Checkbox label="Por e-mail" />
        </Row>
        <Row label="marcada">
          <Checkbox label="Por e-mail" defaultChecked />
        </Row>
        <Row label="indeterminada">
          <Checkbox
            label="Todos os avisos"
            ref={(node) => {
              if (node) node.indeterminate = true;
            }}
          />
        </Row>
        <Row label="erro">
          <Checkbox label="Aceito os termos" aria-invalid />
        </Row>
        <Row label="desabilitada">
          <Checkbox label="No aplicativo" disabled />
          <Checkbox label="Por e-mail" defaultChecked disabled />
        </Row>
      </Group>

      <Group
        title="Radio"
        note="Redondo, e e a unica excecao a regra de raio: ali a forma E o significado — redondo e escolha unica, quadrado e escolha multipla. Um radio de canto vivo seria lido como caixa de marcar."
      >
        <Row label="grupo">
          <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
            <legend className="form-legend">Como medir</legend>
            <Radio label="Em xicaras" name="medida" defaultChecked />
            <Radio label="Em gramas" name="medida" />
          </fieldset>
        </Row>
      </Group>

      <Group
        title="Interruptor"
        note="Quadrado, com o raio de controle. A forma dele vem do cursor que desliza, e nao da pilula: trilho de canto quase vivo com cursor quadrado pertence ao papel do sistema."
      >
        <Row label="desligado">
          <Switch label="Guardar rascunho" />
        </Row>
        <Row label="ligado">
          <Switch label="Guardar rascunho" defaultChecked />
        </Row>
        <Row label="desabilitado">
          <Switch label="Guardar rascunho" disabled />
        </Row>
      </Group>

      <Group
        title="Sem rotulo"
        note="Quando quem monta ja envolveu o controle no proprio label, o alvo e a caixa de 44px. Mesma regra, layout menor."
      >
        <Row label="a caixa sozinha">
          <Checkbox aria-label="Selecionar" defaultChecked />
          <Radio aria-label="Escolher" name="solto" />
          <Switch aria-label="Alternar" />
        </Row>
      </Group>
    </Sheet>
  ),
};

export const ListaDeMarcar: Story = {
  name: 'Lista de marcar',
  render: () => (
    <Sheet>
      <Group
        title="Lista de marcar"
        note="A caixa ocupa a coluna de margem, e por isso o texto comeca no mesmo ponto que o de qualquer outra lista do sistema. Marcado, o item recua para a tinta de apoio: o que ja foi feito sai da frente do que falta. Nao ha risco sobre o texto, porque risco atrapalha quem ainda confere a lista."
      >
        <div className="check-list">
          <Checkbox label="2 xicaras de farinha de trigo" defaultChecked />
          <Checkbox label="1 xicara de acucar" defaultChecked />
          <Checkbox label="200 g de queijo ralado" />
          <Checkbox label="3 ovos" />
        </div>
      </Group>
    </Sheet>
  ),
};

const ChipDemo = () => {
  const [sem, setSem] = useState(true);
  const [rapido, setRapido] = useState(false);
  const [itens, setItens] = useState(['Queijo', 'Tomate', 'Manjericao']);

  return (
    <Sheet>
      <Group
        title="Chip de escolha"
        note="Um input dentro de um grupo nomeado. Com radio o grupo e escolha unica, que e o componente certo para isso — o chip de FILTRO existe so para escolha multipla."
      >
        <Chips name="tempo" legend="Tempo de preparo" type="radio">
          <Chip defaultChecked>Ate 30 minutos</Chip>
          <Chip>Ate 1 hora</Chip>
          <Chip>Mais de 1 hora</Chip>
        </Chips>
      </Group>

      <Group
        title="Chip de filtro"
        note="O tique e o que marca a selecao sem depender de cor. Ele entra a esquerda e desloca o texto: o chip fica um pouco mais largo quando selecionado, e isso e aceito — reservar o espaco do tique no chip desmarcado deixaria um vazio desequilibrado em todos eles."
      >
        <div className="chip-group" role="group" aria-label="Filtrar receitas">
          <FilterChip selected={sem} onClick={() => setSem((v) => !v)}>
            Sem forno
          </FilterChip>
          <FilterChip selected={rapido} onClick={() => setRapido((v) => !v)}>
            Rapido <span className="count">12</span>
          </FilterChip>
          <FilterChip selected={false} disabled>
            Vegetariano
          </FilterChip>
        </div>
      </Group>

      <Group
        title="Chip removivel"
        note="O corpo nao e clicavel; so o X e. No hover do X o chip inteiro escurece, porque e ele que vai sair. O nome acessivel diz a acao inteira: 'Remover queijo', nunca so 'Remover'."
      >
        <div className="chip-group">
          {itens.map((item) => (
            <RemovableChip
              key={item}
              removeLabel={`Remover ${item.toLowerCase()}`}
              onRemove={() =>
                setItens((rest) => rest.filter((name) => name !== item))
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

export const ChipComponente: Story = {
  name: 'Chip',
  render: () => <ChipDemo />,
};
