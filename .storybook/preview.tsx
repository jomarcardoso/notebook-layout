// notebook-layout/.storybook/preview.tsx
import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../styles/app.scss';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'The paper the component is printed on',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: [{ value: 'light', title: 'Light' }],
      showName: true,
    },
  },
};

const withTheme = (StoryFn: () => React.ReactElement, context: any) => {
  const { theme } = context.globals;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <StoryFn />;
};

const preview: Preview = {
  decorators: [withTheme],

  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
