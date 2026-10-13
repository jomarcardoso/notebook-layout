import type { Meta, StoryObj } from '@storybook/react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Field, FieldProps } from '@components/field';

const normalizeValue = (value: FieldProps['value']) => {
  if (typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value ?? '';
};

const ControlledField: FC<FieldProps> = ({
  value: valueProp,
  onChange,
  onErase,
  ...rest
}) => {
  const [value, setValue] = useState(() => normalizeValue(valueProp));

  useEffect(() => {
    setValue(normalizeValue(valueProp));
  }, [valueProp]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(event.currentTarget.value);
    onChange?.(event as any);
  };

  const handleErase = () => {
    setValue('');
    onErase?.();
  };

  return (
    <Field
      {...rest}
      value={value}
      onChange={handleChange as FieldProps['onChange']}
      onErase={onErase ? handleErase : undefined}
    />
  );
};

const meta = {
  title: 'Molecules/Complete field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The first molecule: label, control, hint and error, with the aria-describedby wiring done in a single place. It invents no paint of its own — each piece is an atom, and what is written here is the arrangement. For the full state matrix, see Atoms/Fields.',
      },
    },
  },
  args: {
    label: 'Nome da receita',
    placeholder: 'Digite aqui...',
    hint: '',
    multiline: false,
    breakline: true,
  },
  argTypes: {
    value: { control: false },
    rootProps: { control: false },
    labelProps: { control: false },
    onChange: { control: false },
    onErase: { control: false },
    className: { control: false },
    hint: {
      control: 'text',
      description: 'Hint text below the field. It says what to fill in.',
    },
    error: {
      control: 'text',
      description:
        'The error message. It says what to DO, not what went wrong: "Escreva um titulo" is better than "Campo obrigatorio". When rendered, it sets the control to aria-invalid and switches the base rule to danger.',
    },
    optional: {
      control: 'boolean',
      description:
        'The system marks the OPTIONAL field, never the required one: a red asterisk is a form mark, not a book mark.',
    },
    label: {
      control: 'text',
      description: 'Title tied to the field.',
    },
    multiline: {
      control: 'boolean',
      description:
        'Switches between a regular input and a self-sizing textarea.',
    },
    breakline: {
      control: 'boolean',
      description:
        'When false, forces a single-line input even with multiline true.',
    },
    size: {
      control: 'radio',
      options: [undefined, 'large'],
      description: 'Sets the special vertical spacing of the "large" layout.',
      table: {
        type: {
          summary: "'large' | undefined",
        },
        defaultValue: {
          summary: 'undefined',
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(420px, 100%)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <ControlledField {...args} />,
};

export const WithHint: Story = {
  args: {
    hint: 'A dica pode orientar o usuario sem poluir o layout.',
  },
  render: (args) => <ControlledField {...args} />,
};

export const MultilineNote: Story = {
  args: {
    multiline: true,
    minRows: 3,
    placeholder: 'Liste ingredientes ou descreva o modo de preparo...',
  },
  render: (args) => <ControlledField {...args} />,
};

export const WithEraseAction: Story = {
  args: {
    onErase: () => {},
    onChange: () => {},
    value: 'Texto inicial para demonstrar o botao de apagar.',
  },
  render: (args) => <ControlledField {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'When `onErase` is given, the component shows a contextual button that clears the field and fires the given action.',
      },
    },
  },
};

export const LargeVariant: Story = {
  args: {
    size: 'large',
    label: 'Campo grande',
  },
  render: (args) => <ControlledField {...args} />,
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    placeholder: 'Uso livre sem label visivel',
  },
  render: (args) => <ControlledField {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'When no `label` is given the space adjusts automatically, keeping the layout consistent.',
      },
    },
  },
};
