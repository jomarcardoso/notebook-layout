import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '@components';

const meta: Meta<typeof Section> = {
  title: 'Section',
  component: Section,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    title: 'title',
    children:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae qui nisi quisquam distinctio error et sapiente delectus labore magnam, nihil odit ipsum provident non modi, dolorem quibusdam blanditiis voluptas similique!',
  },
};
