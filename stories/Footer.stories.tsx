import type { Meta, StoryObj } from '@storybook/react';
import { ExportIcon } from '@phosphor-icons/react/dist/ssr/Export';
import { PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { PlusCircleIcon } from '@phosphor-icons/react/dist/ssr/PlusCircle';
import { TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Footer } from '@components/footer';

const meta = {
  title: 'Componentes/Rodape',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sticky footer with action buttons styled to match the notebook look. Use items to pass actions (icon + onClick), and the variants ooterMenu/open to render an expanded contextual area.',
      },
    },
  },
  args: {
    footerMenu: false,
    open: false,
    items: [
      {
        icon: <PlusCircleIcon />,
        'aria-label': 'Adicionar',
        onClick: () => {},
      },
      { icon: <PencilSimpleIcon />, 'aria-label': 'Editar', onClick: () => {} },
      {
        icon: <ExportIcon />,
        'aria-label': 'Compartilhar',
        onClick: () => {},
      },
      { icon: <TrashIcon />, 'aria-label': 'Remover', onClick: () => {} },
    ],
  },
  argTypes: {
    footerMenu: {
      control: 'boolean',
      description: 'Renders the expanded menu style.',
    },
    open: {
      control: 'boolean',
      description: 'Applies the open state background.',
    },
    items: { control: false },
    className: { control: false },
  },
  decorators: [
    (StoryFn) => (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <StoryFn />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
