// notebook-layout/components/atoms/select.tsx
import { type FC, type SelectHTMLAttributes } from 'react';
import { PiCaretDown } from 'react-icons/pi';
import { Icon } from './icon';

/** Uma escolha num campo que oferece um conjunto fechado delas. */
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'className'
> {
  options?: SelectOption[];
  className?: string;
}

export const Select: FC<SelectProps> = ({
  options = [],
  className = '',
  children,
  ...props
}) => (
  <span className="select-field">
    <select
      {...props}
      className={['form-select', className].filter(Boolean).join(' ')}
    >
      {children ??
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
    <Icon icon={PiCaretDown} className="select-field-caret" />
  </span>
);
