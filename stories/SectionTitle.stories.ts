import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from '@components';

const meta: Meta<typeof SectionTitle> = {
  title: 'SectionTitle',
  component: SectionTitle,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SectionTitle>;

export const Default: Story = {
  args: {
    children: 'section title',
  },
};
