// notebook-layout/stories/coreui/Navigation.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BookOpenIcon } from '@phosphor-icons/react/dist/ssr/BookOpen';
import { DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { GearIcon } from '@phosphor-icons/react/dist/ssr/Gear';
import { ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { IconButton, Icon } from '@components/atoms';
import { Breadcrumbs } from '@components/breadcrumbs';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Navigation',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Breadcrumb, pagination, dropdown and sidebar: CoreUI's classes with the entry and adapter configuration, without CSS of our own. The tabs are in Navigation/Tabs.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Breadcrumb: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Breadcrumb"
        note="The Breadcrumbs component over CBreadcrumb. The last item is the current page, in fg-emphasis and without a link."
      >
        <Breadcrumbs
          items={[
            { label: 'Caderno', href: '#' },
            { label: 'Doces', href: '#' },
            { label: 'Bolo de laranja' },
          ]}
        />
      </Group>

      <Group
        title="Compact breadcrumb"
        note="In a container narrower than the trail, only the parent appears, as a way back. The container width decides, not the screen width."
      >
        <div style={{ maxWidth: 320 }}>
          <Breadcrumbs
            items={[
              { label: 'Caderno', href: '#' },
              { label: 'Doces', href: '#' },
              { label: 'Bolo de laranja' },
            ]}
          />
        </div>
      </Group>
    </Sheet>
  ),
};

export const Pagination: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Pagination"
        note="Items without a border in fg-muted. The current page is the selected wash with emphasis ink; hover only on devices with hover."
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
  const [open, setOpen] = useState(true);

  return (
    <Sheet>
      <Group
        title="Dropdown"
        note="The action repeated on every line becomes a menu. The menu is page paper with a rule; the chosen item is the selected wash. The sheet radius and shadow are not emitted yet: see the inventory's open items."
      >
        <Row label="open">
          <div className="dropdown" style={{ minBlockSize: '17rem' }}>
            <IconButton
              icon={DotsThreeIcon}
              label="Mais opcoes"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            />
            <ul className={`dropdown-menu${open ? ' show' : ''}`} role="menu">
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

export const Dropdown: Story = {
  name: 'Dropdown',
  render: () => <MenuDemo />,
};

const SIDEBAR_ITEMS = [
  { label: 'Minhas receitas', icon: BookOpenIcon, active: true },
  { label: 'Listas', icon: ListBulletsIcon, active: false },
  { label: 'Buscar', icon: MagnifyingGlassIcon, active: false },
  { label: 'Ajustes', icon: GearIcon, active: false },
];

export const SidebarMarkup: Story = {
  name: 'Sidebar',
  render: () => (
    <Sheet>
      <Group
        title="Sidebar"
        note="The markup www's CSidebar renders, with the current adapter configuration: page background, hover and active with a wash. The bar is the height of the window, as in www. DESIGN_LANGUAGE asks for active in fg-emphasis; the divergence is in the inventory's open items."
      >
        <div style={{ display: 'flex' }}>
          <nav className="sidebar" aria-label="Navegacao primaria">
            <div className="sidebar-header">
              <span className="title-sm">Caderninho</span>
            </div>
            <ul className="sidebar-nav">
              <li className="nav-title">Caderno</li>
              {SIDEBAR_ITEMS.map(({ label, icon, active }) => (
                <li className="nav-item" key={label}>
                  <a
                    className={`nav-link${active ? ' active' : ''}`}
                    href="#"
                    aria-current={active ? 'page' : 'false'}
                  >
                    <Icon icon={icon} className="nav-icon" />
                    {label}
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
