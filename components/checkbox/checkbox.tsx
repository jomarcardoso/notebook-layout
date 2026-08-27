// notebook-layout/components/checkbox/checkbox.tsx
import { type FC, type HTMLProps } from 'react';
import { IoCheckmarkSharp, IoSquareOutline } from 'react-icons/io5';
import { generateClasses } from '../../utils/utils';
import './checkbox.scss';

export type CheckboxProps = HTMLProps<HTMLInputElement>;

/**
 * A box you tick.
 *
 * Ticked, the box FILLS and the tick is cut out of it — the shape CoreUI and
 * Bootstrap draw, and the only one that survives a theme whose selected colour
 * is a shade of the text colour. An outline glyph recoloured to `fg-selected`
 * reads as black wherever the theme pencils its choices instead of inking them.
 */
export const Checkbox: FC<CheckboxProps> = ({ className = '', ...props }) => {
  const classes = generateClasses({
    checkbox: true,
    [className]: Boolean(className),
  });

  return (
    <span className={classes}>
      <input type="checkbox" {...props} />
      <span
        className="checkbox__icon checkbox__icon--checked"
        aria-hidden="true"
      >
        <IoCheckmarkSharp />
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
