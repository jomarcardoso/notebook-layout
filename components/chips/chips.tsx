'use client';
// notebook-layout/components/chips/chips.tsx
import {
  type ComponentProps,
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useId,
} from 'react';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { generateClasses } from '../../utils/utils';
import { Icon } from '../atoms/icon';

type ChipInputType = 'radio' | 'checkbox';

const ChipConfigContext = createContext<{ name: string; type: ChipInputType }>({
  name: '',
  type: 'radio',
});

/**
 * O chip de ESCOLHA: um `input` dentro de um grupo nomeado.
 */
export const Chip: FC<ComponentProps<'input'>> = ({
  children,
  ...props
}) => {
  const id = useId();
  const { name, type } = useContext(ChipConfigContext);

  return (
    <li className="chip">
      <input type={type} name={name} {...props} id={id} />
      <Icon icon={CheckIcon} className="chip-check" />
      <label htmlFor={id}>{children}</label>
    </li>
  );
};

export interface ChipsProps extends ComponentProps<'fieldset'> {
  full?: boolean;
  name: string;
  legend?: string;
  description?: ReactNode;
  type?: ChipInputType;
}

export const Chips: FC<ChipsProps> = ({
  children,
  full,
  name = '',
  legend = '',
  description,
  type = 'radio',
  className = '',
  ...props
}) => (
  <ChipConfigContext.Provider value={{ name, type }}>
    <fieldset {...props} className={className || undefined}>
      {legend && <legend className="form-legend">{legend}</legend>}
      {description && <p className="form-text">{description}</p>}
      <ul className={generateClasses({ 'chip-group': true, '-full': !!full })}>
        {children}
      </ul>
    </fieldset>
  </ChipConfigContext.Provider>
);

export interface FilterChipProps extends Omit<
  ComponentProps<'button'>,
  'type' | 'aria-pressed' | 'className'
> {
  selected: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * O chip de FILTRO liga e desliga um filtro.
 */
export const FilterChip: FC<FilterChipProps> = ({
  selected,
  children,
  className = '',
  ...props
}) => (
  <button
    {...props}
    type="button"
    aria-pressed={selected}
    className={generateClasses({ chip: true, [className]: Boolean(className) })}
  >
    {selected && <Icon icon={CheckIcon} />}
    {children}
  </button>
);

export interface RemovableChipProps extends ComponentProps<'span'> {
  removeLabel: string;
  onRemove(): void;
}

/**
 * Um valor ja escolhido, com o X de remover no fim.
 */
export const RemovableChip: FC<RemovableChipProps> = ({
  children,
  removeLabel,
  onRemove,
  className = '',
  ...props
}) => (
  <span
    {...props}
    className={generateClasses({
      'chip chip-removable': true,
      [className]: Boolean(className),
    })}
  >
    {children}
    <button
      type="button"
      className="chip-remove"
      aria-label={removeLabel}
      onClick={onRemove}
    >
      <Icon icon={XIcon} />
    </button>
  </span>
);
