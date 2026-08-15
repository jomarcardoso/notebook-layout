import {
  type ButtonHTMLAttributes,
  type ElementType,
  type FC,
  useMemo,
} from 'react';
import './button.scss';
import { generateClasses } from '../../utils/utils';

interface Props {
  as?: ElementType;
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
}

export type ButtonProps = Props &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string; // caso use <a> ou <Link>
  };

/**
 * The three emphases, in ONE colour.
 *
 * `secondary` and `tertiary` are RANKS — how much this button matters on this
 * screen — not colours. The design language says emphasis is carried by fill,
 * border and nothing, never by hue, so all three take the action colour and
 * differ only in treatment:
 *
 *   primary    filled    bg-action + fg-on-action
 *   secondary  outline   border-action + fg-action, no fill
 *   tertiary   ghost     fg-action only, subtle tint on hover
 *
 * What they mapped to before, and why each was wrong:
 *
 *   `btn-outline-secondary` — CoreUI's `secondary` is its GREY button, and the
 *   adapter binds it to the `neutral` ramp on purpose. So the second-most
 *   important action on 51 screens rendered in grey, which reads as disabled
 *   rather than as the other choice.
 *
 *   `btn-link` — a button dressed as a link: underlined, in the LINK colour. A
 *   link promises navigation; a tertiary button still acts. Same shape,
 *   different promise.
 */
const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'btn-primary',
  secondary: 'btn-outline-primary',
  tertiary: 'btn-ghost-primary',
};

export const Button: FC<ButtonProps> = ({
  as: Component = 'button',
  className = '',
  children,
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const classes = useMemo(() => {
    return generateClasses({
      btn: true,
      [variantClasses[variant]]: true,
      'w-100': fullWidth,
      [className]: className,
    });
  }, [className, fullWidth, variant]);

  return (
    <Component className={classes} type={type} {...props}>
      <span className="d-inline-flex align-items-center justify-content-center gap-2">
        {children}
      </span>
    </Component>
  );
};
