import type { Meta, StoryObj } from '@storybook/react';
import { IoAddCircleOutline, IoCreateOutline, IoShareOutline, IoTrashOutline } from 'react-icons/io5';
import { Footer } from '@components/footer';

const meta = {
  title: 'Navigation/Footer',
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
    theme: 'theme-primary',
    items: [
      { icon: <IoAddCircleOutline />, title: 'Adicionar', onClick: () => {} },
      { icon: <IoCreateOutline />, title: 'Editar', onClick: () => {} },
      { icon: <IoShareOutline />, title: 'Compartilhar', onClick: () => {} },
      { icon: <IoTrashOutline />, title: 'Remover', onClick: () => {} },
    ],
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['theme-base', 'theme-light', 'theme-primary'],
      description: 'Selects which global theme class is applied to preview.',
    },
    footerMenu: { control: 'boolean', description: 'Renders the expanded menu style.' },
    open: { control: 'boolean', description: 'Applies the open state background.' },
    items: { control: false },
    className: { control: false },
  },
  decorators: [
    (StoryFn, context) => {
      const { theme } = context.args as any;
      const body = document.body;
      body.classList.remove('theme-base', 'theme-light', 'theme-primary');
      body.classList.add(theme);
      return (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <StoryFn />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
