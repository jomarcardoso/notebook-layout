// notebook-layout/components/atoms/select.tsx
import { type ComponentProps, type FC } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { generateClasses } from '../../utils/utils';
import { Icon } from './icon';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  ComponentProps<'select'>,
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
      className={generateClasses({
        'form-select': true,
        [className]: Boolean(className),
      })}
    >
      {children ??
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
    </select>
    <Icon icon={CaretDownIcon} className="select-field-caret" />
  </span>
);
