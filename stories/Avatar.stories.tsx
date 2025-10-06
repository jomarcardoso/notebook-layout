import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Avatar, type AvatarProps } from '@components/avatar';

const meta = {
  title: 'Media/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Circular photo holder styled for the notebook interface. Provides a graceful fallback when the source is missing or fails to load.',
      },
    },
  },
  args: {
    alt: 'Chef portrait',
    src: 'https://images.unsplash.it/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=200&q=60',
  },
  argTypes: {
    className: { control: false },
    onError: { control: false },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const MissingSource: Story = {
  args: {
    src: undefined,
    alt: 'Fallback illustration',
  },
  parameters: {
    docs: {
      description: {
        story: 'When no `src` is provided the component displays the fallback illustration instead of leaving an empty frame.',
      },
    },
  },
};

export const CustomFallback: Story = {
  args: {
    src: undefined,
    fallbackSrc:
      'https://images.unsplash.it/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=200&q=60',
  },
  parameters: {
    docs: {
      description: {
        story: 'Override `fallbackSrc` to tailor the placeholder illustration to your product.',
      },
    },
  },
};

export const LoadError: Story = {
  args: {
    src: 'https://example.com/broken-image.jpg',
  },
  render: (args) => {
    const [attempts, setAttempts] = useState(0);

    const handleError: AvatarProps['onError'] = () => {
      setAttempts((prev) => prev + 1);
    };

    return (
      <div style={{ display: 'grid', gap: '12px', justifyItems: 'center' }}>
        <Avatar {...args} onError={handleError} />
        <span style={{ fontFamily: 'var(--font-family-text)' }}>
          Failed attempts: {attempts}
        </span>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'The component switches to the fallback when the network image errors out, while still allowing custom `onError` logic.',
      },
    },
  },
};
