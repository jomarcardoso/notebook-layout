// notebook-layout/stories/coreui/Tabela.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '@components/reader-marks';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Tabela',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O .table do CoreUI configurado no entry, com o que nenhuma variavel expressa no atom _table.scss. Tabela e pagina de dados: fios horizontais, cabecalho em rotulo curto e tinta de apoio, coluna de numero em numeric alinhada ao fim. Nao existem neste sistema: table-striped (zebrado), table-bordered (fio vertical), table-borderless, table-dark, as variantes de cor e table-group-divider — grupo de linhas e um th com scope="rowgroup".',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const MACRONUTRIENTES = [
  { nome: 'Energia', porcao: '382 kcal', cem: '255 kcal', vd: '19%' },
  { nome: 'Carboidratos', porcao: '51,2 g', cem: '34,1 g', vd: '17%' },
  { nome: 'Proteinas', porcao: '7,4 g', cem: '4,9 g', vd: '10%' },
  { nome: 'Gorduras totais', porcao: '16,4 g', cem: '10,9 g', vd: '30%' },
];

const MINERAIS = [
  { nome: 'Calcio', porcao: '120 mg', cem: '80 mg', vd: '12%' },
  { nome: 'Ferro', porcao: '2,1 mg', cem: '1,4 mg', vd: '15%' },
  { nome: 'Sodio', porcao: '310 mg', cem: '207 mg', vd: '13%' },
];

type Nutriente = (typeof MACRONUTRIENTES)[number];

const Cabecalho = () => (
  <thead>
    <tr>
      <th scope="col">Nutriente</th>
      <th scope="col" className="numeric">
        Porcao
      </th>
      <th scope="col" className="numeric">
        100 g
      </th>
      <th scope="col" className="numeric">
        %VD
      </th>
    </tr>
  </thead>
);

const Linha = ({ nome, porcao, cem, vd }: Nutriente) => (
  <tr>
    <th scope="row">{nome}</th>
    <td className="numeric">{porcao}</td>
    <td className="numeric">{cem}</td>
    <td className="numeric">{vd}</td>
  </tr>
);

export const Dados: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Dados"
        note="A tabela basica. Um fio sob cada linha, o do cabecalho um degrau mais escuro. O nome da linha e th com scope row, e cada coluna de numero leva .numeric na celula e no cabecalho."
      >
        <table className="table">
          <caption>
            Valores por porcao de 150 g, calculados pela tabela de composicao
            dos alimentos.
          </caption>
          <Cabecalho />
          <tbody>
            {MACRONUTRIENTES.map((nutriente) => (
              <Linha key={nutriente.nome} {...nutriente} />
            ))}
          </tbody>
        </table>
      </Group>
    </Sheet>
  ),
};

export const GruposDeLinhas: Story = {
  name: 'Grupos de linhas',
  render: () => (
    <Sheet>
      <Group
        title="Grupos de linhas"
        note="Um tbody por grupo, e o nome do grupo e um th com scope rowgroup em label. Ele se separa por espaco acima e pela tipografia; nao ganha faixa nem fio proprio."
      >
        <table className="table">
          <Cabecalho />
          {[
            { grupo: 'Macronutrientes', linhas: MACRONUTRIENTES },
            { grupo: 'Minerais', linhas: MINERAIS },
          ].map(({ grupo, linhas }) => (
            <tbody key={grupo}>
              <tr>
                <th scope="rowgroup" colSpan={4}>
                  {grupo}
                </th>
              </tr>
              {linhas.map((nutriente) => (
                <Linha key={nutriente.nome} {...nutriente} />
              ))}
            </tbody>
          ))}
        </table>
      </Group>
    </Sheet>
  ),
};

const RECEITAS = [
  { nome: 'Bolo de laranja', lista: 'Doces', porcoes: '12' },
  { nome: 'Pao de queijo', lista: 'Lanches', porcoes: '30' },
  { nome: 'Feijoada', lista: 'Almoco de domingo', porcoes: '8' },
];

const LinhasDeAcaoDemo = () => {
  const [escolhida, setEscolhida] = useState(RECEITAS[0].nome);

  return (
    <Sheet>
      <Group
        title="Linhas de acao"
        note="table-hover pinta o lavado de hover so em aparelho com hover, e so faz sentido quando a linha leva a algum lugar: o link fica na primeira celula. table-active marca a linha escolhida com o lavado de selecionado e tinta de enfase."
      >
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Receita</th>
              <th scope="col">Lista</th>
              <th scope="col" className="numeric">
                Porcoes
              </th>
            </tr>
          </thead>
          <tbody>
            {RECEITAS.map(({ nome, lista, porcoes }) => (
              <tr
                key={nome}
                className={escolhida === nome ? 'table-active' : ''}
              >
                <th scope="row">
                  <a
                    href="#"
                    aria-current={escolhida === nome ? 'true' : 'false'}
                    onClick={(event) => {
                      event.preventDefault();
                      setEscolhida(nome);
                    }}
                  >
                    {nome}
                  </a>
                </th>
                <td>{lista}</td>
                <td className="numeric">{porcoes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Group>
    </Sheet>
  );
};

export const LinhasDeAcao: Story = {
  name: 'Linhas de acao',
  render: () => <LinhasDeAcaoDemo />,
};

const CAMPOS = [
  { campo: 'Nome', base: 'Farinha de trigo', proposta: 'Farinha de trigo integral' },
  { campo: 'Densidade', base: '0,59 g/ml', proposta: '0,55 g/ml' },
  { campo: 'Categoria', base: 'Graos', proposta: 'Farinhas' },
];

const CaixaDeMarcarDemo = () => {
  const [marcados, setMarcados] = useState<string[]>([CAMPOS[0].campo]);

  return (
    <Sheet>
      <Group
        title="Com caixa de marcar"
        note="A primeira coluna escolhe as linhas. A caixa e o Checkbox da biblioteca com nome acessivel, e a linha continua de dados: a escolha nao muda o fundo dela."
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
            {CAMPOS.map(({ campo, base, proposta }) => (
              <tr key={campo}>
                <td>
                  <Checkbox
                    aria-label={`Usar ${campo}`}
                    checked={marcados.includes(campo)}
                    onChange={(event) =>
                      setMarcados(
                        event.target.checked
                          ? [...marcados, campo]
                          : marcados.filter((item) => item !== campo),
                      )
                    }
                  />
                </td>
                <th scope="row">{campo}</th>
                <td>{base}</td>
                <td>{proposta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Group>
    </Sheet>
  );
};

export const ComCaixaDeMarcar: Story = {
  name: 'Com caixa de marcar',
  render: () => <CaixaDeMarcarDemo />,
};

export const CompactaNoAparato: Story = {
  name: 'Compacta no aparato',
  render: () => (
    <Sheet>
      <Group
        title="Compacta no aparato"
        note="table-sm e a densidade da nota de margem: meio padding, na medida do aparato. A tabela nao ganha a largura do conteudo."
      >
        <div className="l-measure -apparatus">
          <table className="table table-sm">
            <tbody>
              {MACRONUTRIENTES.map(({ nome, porcao }) => (
                <tr key={nome}>
                  <th scope="row">{nome}</th>
                  <td className="numeric">{porcao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Group>
    </Sheet>
  ),
};

const COLUNAS = ['Quantidade', 'Energia', 'Carboidratos', 'Proteinas', 'Gorduras', 'Fibras'];

const INGREDIENTES = [
  ['Farinha de trigo', '240 g', '871 kcal', '182,6 g', '23,5 g', '2,4 g', '5,8 g'],
  ['Acucar', '180 g', '697 kcal', '179,6 g', '0 g', '0 g', '0 g'],
  ['Ovos', '150 g', '215 kcal', '1,1 g', '18,9 g', '14,3 g', '0 g'],
];

export const Rolagem: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Rolagem"
        note="Quando as colunas nao cabem, table-responsive rola a tabela na horizontal e a pagina fica parada. As colunas nao quebram e a tabela nao muda de aparencia por largura de tela."
      >
        <div className="table-responsive" style={{ maxInlineSize: '28rem' }}>
          <table className="table" style={{ minInlineSize: '44rem' }}>
            <thead>
              <tr>
                <th scope="col">Ingrediente</th>
                {COLUNAS.map((coluna) => (
                  <th key={coluna} scope="col" className="numeric">
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INGREDIENTES.map(([nome, ...valores]) => (
                <tr key={nome}>
                  <th scope="row">{nome}</th>
                  {valores.map((valor, index) => (
                    <td key={COLUNAS[index]} className="numeric">
                      {valor}
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
