'use client';
// notebook-layout/components/field/field.controls.tsx
import {
  type ChangeEventHandler,
  type FC,
  type FocusEventHandler,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { PiCaretDown } from 'react-icons/pi';
import { Icon } from '../atoms/icon';
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
    {...(props as InputHTMLAttributes<HTMLInputElement>)}
    className="form-control"
  />
);

export const FieldTextarea: FC<
  FieldControlProps & { minRows?: number | string }
> = ({ minRows, ...props }) => (
  <Textarea
    {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
    minRows={minRows}
  />
);

export const FieldSelect: FC<
  FieldControlProps & { options: FieldOption[] }
> = ({ options, ...props }) => {
  const select = props as SelectHTMLAttributes<HTMLSelectElement> & {
    onChange?: unknown;
    onBlur?: unknown;
    onFocus?: unknown;
  };

  return (
    <span className="select-field">
      <select
        {...select}
        className="form-select"
        onChange={select.onChange as ChangeEventHandler<HTMLSelectElement>}
        onBlur={select.onBlur as FocusEventHandler<HTMLSelectElement>}
        onFocus={select.onFocus as FocusEventHandler<HTMLSelectElement>}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon icon={PiCaretDown} className="select-field-caret" />
    </span>
  );
};
