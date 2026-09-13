// notebook-layout/stories/atoms/MarcasDeLeitura.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import {
  PiCaretDown,
  PiHeart,
  PiHeartFill,
  PiMagnifyingGlass,
  PiPlus,
} from 'react-icons/pi';
import { Icon, Tag } from '@components/atoms';
import { LineList, LineListItem } from '@components/molecules';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atomos/Marcas de leitura',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RotuloAjudaErro: Story = {
  name: 'Rotulo, ajuda e erro',
  render: () => (
    <Sheet>
      <Group
        title="Rotulo de campo"
        note="Papel label, peso 500, em tinta de apoio: o peso firme compensa a tinta suave, e o que foi digitado continua sendo o que mais pesa no campo. O sistema marca o OPCIONAL, nunca o obrigatorio — asterisco vermelho e marca de formulario, nao de livro."
      >
        <div>
          <label className="form-label" htmlFor="a">
            Titulo da receita
          </label>
          <input className="form-control" id="a" />
        </div>
        <div>
          <label className="form-label" htmlFor="b">
            Subtitulo <span className="form-label-optional">(opcional)</span>
          </label>
          <input className="form-control" id="b" />
        </div>
      </Group>

      <Group
        title="Ajuda e erro"
        note="Os dois em caption, abaixo do campo, ligados por aria-describedby. Nenhum leva icone: icone colorido para transmitir estado e antipadrao, e o campo ja mudou de fio. A mensagem de erro diz o que FAZER, nao o que deu errado."
      >
        <div>
          <label className="form-label" htmlFor="c">
            Rendimento
          </label>
          <input className="form-control" id="c" aria-describedby="c-hint" />
          <div className="form-text" id="c-hint">
            Quantas porcoes a receita rende.
          </div>
        </div>
        <div>
          <label className="form-label" htmlFor="d">
            Titulo da receita
          </label>
          <input
            className="form-control"
            id="d"
            aria-invalid
            aria-describedby="d-err"
          />
          <div className="invalid-feedback" id="d-err">
            Escreva um titulo.
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};

export const TagEContador: Story = {
  name: 'Tag, contador e numero',
  render: () => (
    <Sheet>
      <Group
        title="Tag"
        note="Marcador estatico: lavado fraco, tinta de apoio, caption, raio zero. Ela nao reage ao ponteiro e nao leva icone — um icone de 20px ao lado de um texto de 14px pesa mais que a palavra. Tag e lavada e chip e contornado, e e assim que os dois se distinguem pela aparencia."
      >
        <Row label="categoria">
          <Tag>Doces</Tag>
          <Tag>Sem gluten</Tag>
        </Row>
        <Row label="status">
          <Tag status="success">Publicada</Tag>
          <Tag status="warning">Rascunho</Tag>
          <Tag status="danger">Removida</Tag>
        </Row>
        <Row label="contador">
          <Tag count>12</Tag>
        </Row>
      </Group>

      <Group
        title="Contador em linha"
        note="Dentro de outro controle o contador perde o lavado e vira so o numero em tinta fraca: um lavado dentro de um contorno seria uma caixa dentro de outra caixa."
      >
        <Row label="numa aba">
          <span className="label">
            Minhas receitas <span className="count">28</span>
          </span>
        </Row>
      </Group>

      <Group
        title="Numero"
        note="O papel numeric e tabular: numa coluna, os algarismos alinham. Ele nao fala do dominio — serve a quantidade de um ingrediente, a um valor nutricional e a uma celula de tabela."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-space-2xs)',
            inlineSize: '12rem',
          }}
        >
          {[
            ['Farinha', '250 g'],
            ['Acucar', '80 g'],
            ['Leite', '1 000 ml'],
          ].map(([nome, medida]) => (
            <div
              key={nome}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <span>{nome}</span>
              <span className="numeric">{medida}</span>
            </div>
          ))}
        </div>
      </Group>
    </Sheet>
  ),
};

export const Iconografia: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Icone de sistema"
        note="Um tamanho so, 20px. Na Phosphor a espessura vem presa ao peso, entao dois tamanhos na mesma tela seriam duas espessuras de tinta. Ele nunca tem cor propria: herda a tinta do elemento que o contem."
      >
        <Row label="na tinta do corpo">
          <Icon icon={PiPlus} />
          <Icon icon={PiMagnifyingGlass} />
          <Icon icon={PiCaretDown} />
        </Row>
        <Row label="contorno e preenchido">
          <Icon icon={PiHeart} iconMarked={PiHeartFill} />
          <Icon icon={PiHeart} iconMarked={PiHeartFill} marked />
        </Row>
        <Row label="herdando a tinta">
          <span style={{ color: 'var(--app-fg-muted)' }}>
            <Icon icon={PiPlus} />
          </span>
          <span style={{ color: 'var(--app-fg-accent)' }}>
            <Icon icon={PiPlus} />
          </span>
          <span style={{ color: 'var(--app-fg-danger)' }}>
            <Icon icon={PiPlus} />
          </span>
        </Row>
      </Group>
      <p className="caption">
        Preenchido nao e decoracao: mais tinta significa mais destaque. Contorno
        e o padrao e preenchido significa MARCADO — salvo, favorito, o item
        ativo da navegacao. Um coracao de favoritar e tinta neutra, nunca
        vermelho: a cor &ldquo;do que o desenho representa&rdquo; pertence a
        figura de conteudo.
      </p>
    </Sheet>
  ),
};

export const Ornamento: Story = {
  render: () => (
    <Sheet>
      <Group
        title="O losango"
        note="Uma forma de ornamento so, em dois papeis. Marca de secao: maior, em accent, porque e rubricacao e pertence ao documento. Marcador da lista de prosa: pequeno, em tinta terciaria, na mesma coluna de margem. As listas estao em Moleculas/Listas."
      >
        <div>
          <h3 className="title-md">
            <span className="section-mark" aria-hidden="true" />
            Dicas
          </h3>
          <LineList family="prose">
            <LineListItem>Peneire a farinha com o fermento</LineListItem>
            <LineListItem>Use ovos em temperatura ambiente</LineListItem>
            <LineListItem>Rale o queijo na hora</LineListItem>
          </LineList>
        </div>
      </Group>

      <p className="caption">
        Uma marca por linha: nunca marcador junto com figura, nunca losango
        junto com vinheta. A regra da marca de secao e por documento — ou todas
        as secoes tem, ou nenhuma tem.
      </p>
    </Sheet>
  ),
};
