import { type FC, type HTMLProps } from 'react';
import { IoCheckboxOutline, IoSquareOutline } from 'react-icons/io5';
import { generateClasses } from '../../utils/utils';
import './checkbox.scss';

export type CheckboxProps = HTMLProps<HTMLInputElement>;

export const Checkbox: FC<CheckboxProps> = ({ className = '', ...props }) => {
  const classes = generateClasses({
    checkbox: true,
    [className]: Boolean(className),
  });

  return (
    <span className={classes}>
      <input type="checkbox" {...props} />
      <span className="checkbox__icon checkbox__icon--checked" aria-hidden="true">
        <IoCheckboxOutline />
      </span>
      <span
        className="checkbox__icon checkbox__icon--unchecked"
        aria-hidden="true"
      >
        <IoSquareOutline />
      </span>
    </span>
  );
};
