'use client';
// notebook-layout/components/field/field.controls.tsx
import { type ComponentProps, type FC } from 'react';
import { Select, type SelectProps } from '../atoms/select';
import { Textarea } from '../atoms/textarea';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  [key: string]: unknown;
}

export const FieldInput: FC<FieldControlProps> = (props) => (
  <input
    type="text"
    {...(props as ComponentProps<'input'>)}
    className="form-control"
  />
);

export const FieldTextarea: FC<
  FieldControlProps & { minRows?: number | string }
> = ({ minRows, ...props }) => (
  <Textarea
    {...(props as ComponentProps<'textarea'>)}
    minRows={minRows}
  />
);

export const FieldSelect: FC<
  FieldControlProps & { options: FieldOption[] }
> = ({ options, ...props }) => (
  <Select {...(props as SelectProps)} options={options} />
);
