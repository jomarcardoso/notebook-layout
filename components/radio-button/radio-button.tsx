import { type FC, type HTMLProps } from 'react';
import { IoRadioButtonOffOutline, IoRadioButtonOnOutline } from 'react-icons/io5';
import { generateClasses } from '../../utils/utils';
import './radio-button.scss';

export type RadioButtonProps = HTMLProps<HTMLInputElement>;

export const RadioButton: FC<RadioButtonProps> = ({ className = '', ...props }) => {
  const classes = generateClasses({
    'radio-button': true,
    [className]: Boolean(className),
  });

  return (
    <span className={classes}>
      <input type="radio" {...props} />
      <span className="radio-button__icon radio-button__icon--checked" aria-hidden="true">
        <IoRadioButtonOnOutline />
      </span>
      <span
        className="radio-button__icon radio-button__icon--unchecked"
        aria-hidden="true"
      >
        <IoRadioButtonOffOutline />
      </span>
    </span>
  );
};
