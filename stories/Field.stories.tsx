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
  title: 'Form/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Campo de formulario inspirado em paginas de caderno. Suporta entrada unica ou multiline, exibicao de rotulo independente e acao de apagar com icone contextual.',
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
      description: 'Mensagem auxiliar exibida abaixo do campo.',
    },
    label: {
      control: 'text',
      description: 'Titulo associado ao campo.',
    },
    multiline: {
      control: 'boolean',
      description: 'Alterna entre input tradicional e textarea auto ajustavel.',
    },
    breakline: {
      control: 'boolean',
      description:
        'Quando falso, forca o uso de input de linha unica mesmo com multiline true.',
    },
    size: {
      control: 'radio',
      options: [undefined, 'large'],
      description: 'Define o espaco vertical especial do layout "grande".',
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
    maxRows: 6,
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
          'Ao fornecer `onErase`, o componente exibe um botao contextual que limpa o campo e dispara a acao informada.',
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
          'Quando nenhum `label` e fornecido o espaco e ajustado automaticamente, mantendo o layout consistente.',
      },
    },
  },
};
