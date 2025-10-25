import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../styles/main.scss';

// Toolbar para trocar temas globais
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'theme-base',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: 'theme-base', title: 'Base' },
        { value: 'theme-light', title: 'Light' },
        { value: 'theme-primary', title: 'Primary' },
      ],
      showName: true,
    },
  },
};

// Decorator global que aplica a classe de tema
const withTheme = (StoryFn: any, context: any) => {
  const { theme } = context.globals;

  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-base', 'theme-light', 'theme-primary');
    body.classList.add(theme);
  }, [theme]);

  return <StoryFn />;
};

// Configuração global do Storybook
const preview: Preview = {
  decorators: [withTheme],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
