'use client';
// notebook-layout/components/chips/chips.tsx
import {
  type ButtonHTMLAttributes,
  type FC,
  type HTMLProps,
  type ReactNode,
  createContext,
  useContext,
  useId,
} from 'react';
import { PiCheck, PiX } from 'react-icons/pi';
import { Icon } from '../atoms/icon';

type ChipInputType = 'radio' | 'checkbox';

const ChipConfigContext = createContext<{ name: string; type: ChipInputType }>({
  name: '',
  type: 'radio',
});

/**
 * O chip de ESCOLHA: um `input` dentro de um grupo nomeado.
 */
export const Chip: FC<HTMLProps<HTMLInputElement>> = ({
  children,
  ...props
}) => {
  const id = useId();
  const { name, type } = useContext(ChipConfigContext);

  return (
    <li className="chip">
      <input type={type} name={name} {...props} id={id} />
      <Icon icon={PiCheck} className="chip-check" />
      <label htmlFor={id}>{children}</label>
    </li>
  );
};

export interface ChipsProps extends HTMLProps<HTMLFieldSetElement> {
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
      <ul className={['chip-group', full && '-full'].filter(Boolean).join(' ')}>
        {children}
      </ul>
    </fieldset>
  </ChipConfigContext.Provider>
);

export interface FilterChipProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
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
    className={['chip', className].filter(Boolean).join(' ')}
  >
    {selected && <Icon icon={PiCheck} />}
    {children}
  </button>
);

export interface RemovableChipProps {
  children: ReactNode;
  removeLabel: string;
  onRemove(): void;
  className?: string;
}

/**
 * Um valor ja escolhido, com o X de remover no fim.
 */
export const RemovableChip: FC<RemovableChipProps> = ({
  children,
  removeLabel,
  onRemove,
  className = '',
}) => (
  <span
    className={['chip', 'chip-removable', className].filter(Boolean).join(' ')}
  >
    {children}
    <button
      type="button"
      className="chip-remove"
      aria-label={removeLabel}
      onClick={onRemove}
    >
      <Icon icon={PiX} />
    </button>
  </span>
);
