'use client';
import {
  type FC,
  type HTMLProps,
  createContext,
  useContext,
  useId,
} from 'react';
import './chips.scss';
import { generateClasses } from '../../utils/utils';

type ChipInputType = 'radio' | 'checkbox';
const ChipConfigContext = createContext<{ name: string; type: ChipInputType }>({
  name: '',
  type: 'radio',
});

export const Chip: FC<HTMLProps<HTMLInputElement>> = ({
  children,
  ...props
}) => {
  const id = useId();
  const { name, type } = useContext(ChipConfigContext);

  return (
    <li className="chip">
      <input type={type} name={name} {...props} id={id} />
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
  ...props
}) => {
  const classes = generateClasses({
    chips: true,
    'mt-2': true,
    '-full': full,
  });

  return (
    <ChipConfigContext.Provider value={{ name, type }}>
      <fieldset className="fieldset" {...props}>
        <legend>{legend}</legend>
        {description && <p>{description}</p>}
        <ul className={classes}>{children}</ul>
      </fieldset>
    </ChipConfigContext.Provider>
  );
};
