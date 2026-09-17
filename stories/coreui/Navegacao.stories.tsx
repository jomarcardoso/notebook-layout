// notebook-layout/stories/coreui/Navegacao.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  PiBookOpen,
  PiDotsThree,
  PiGear,
  PiListBullets,
  PiMagnifyingGlass,
} from 'react-icons/pi';
import { IconButton, Icon } from '@components/atoms';
import { Breadcrumbs } from '@components/breadcrumbs';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Navegacao',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Trilha, paginacao, menu suspenso e barra lateral: as classes do CoreUI com a configuracao do entry e do adapter, sem CSS proprio. As abas ficam em Navegacao/Abas.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trilha: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Trilha"
        note="O componente Breadcrumbs sobre .breadcrumb. O ultimo item e a pagina atual, em fg-emphasis e sem link."
      >
        <Breadcrumbs
          items={[
            { label: 'Caderno', href: '#' },
            { label: 'Doces', href: '#' },
            { label: 'Bolo de laranja' },
          ]}
        />
      </Group>
    </Sheet>
  ),
};

export const Paginacao: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Paginacao"
        note="Itens sem borda em fg-muted. A pagina atual e o lavado de selecionado com tinta de enfase; hover so em aparelho com hover."
      >
        <nav aria-label="Paginas de receitas">
          <ul className="pagination">
            <li className="page-item disabled">
              <span className="page-link">Anterior</span>
            </li>
            <li className="page-item active" aria-current="page">
              <span className="page-link">1</span>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Proxima
              </a>
            </li>
          </ul>
        </nav>
      </Group>
    </Sheet>
  ),
};

const MenuDemo = () => {
  const [aberto, setAberto] = useState(true);

  return (
    <Sheet>
      <Group
        title="Menu suspenso"
        note="A acao repetida em cada linha vira menu. O menu e papel da pagina com fio; o item escolhido e o lavado de selecionado. Raio e sombra da folha ainda nao sao emitidos: ver as pendencias do inventario."
      >
        <Row label="aberto">
          <div className="dropdown" style={{ minBlockSize: '17rem' }}>
            <IconButton
              icon={PiDotsThree}
              label="Mais opcoes"
              aria-haspopup="menu"
              aria-expanded={aberto}
              onClick={() => setAberto(!aberto)}
            />
            <ul className={`dropdown-menu${aberto ? ' show' : ''}`} role="menu">
              <li>
                <span className="dropdown-header">Esta receita</span>
              </li>
              <li>
                <button className="dropdown-item" type="button" role="menuitem">
                  Duplicar
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item active"
                  type="button"
                  role="menuitem"
                  aria-current="true"
                >
                  Mover para outra lista
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item disabled"
                  type="button"
                  role="menuitem"
                  disabled
                >
                  Publicar
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" type="button" role="menuitem">
                  Imprimir
                </button>
              </li>
            </ul>
          </div>
        </Row>
      </Group>
    </Sheet>
  );
};

export const MenuSuspenso: Story = {
  name: 'Menu suspenso',
  render: () => <MenuDemo />,
};

const ITENS_DA_BARRA = [
  { rotulo: 'Minhas receitas', icone: PiBookOpen, ativo: true },
  { rotulo: 'Listas', icone: PiListBullets, ativo: false },
  { rotulo: 'Buscar', icone: PiMagnifyingGlass, ativo: false },
  { rotulo: 'Ajustes', icone: PiGear, ativo: false },
];

export const BarraLateral: Story = {
  name: 'Barra lateral',
  render: () => (
    <Sheet>
      <Group
        title="Barra lateral"
        note="A marcacao que o CSidebar do www renderiza, com a configuracao atual do adapter: fundo da pagina, hover e ativo com lavado. A barra tem a altura da janela, como no www. O DESIGN_LANGUAGE pede ativo em fg-emphasis; a divergencia esta nas pendencias do inventario."
      >
        <div style={{ display: 'flex' }}>
          <nav className="sidebar" aria-label="Navegacao primaria">
            <div className="sidebar-header">
              <span className="title-sm">Caderninho</span>
            </div>
            <ul className="sidebar-nav">
              <li className="nav-title">Caderno</li>
              {ITENS_DA_BARRA.map(({ rotulo, icone, ativo }) => (
                <li className="nav-item" key={rotulo}>
                  <a
                    className={`nav-link${ativo ? ' active' : ''}`}
                    href="#"
                    aria-current={ativo ? 'page' : 'false'}
                  >
                    <Icon icon={icone} className="nav-icon" />
                    {rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Group>
    </Sheet>
  ),
};
