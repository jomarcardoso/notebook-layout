import {
  type FC,
  type ButtonHTMLAttributes,
  ElementType,
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
      button: true,
      'button--secondary': variant === 'secondary',
      'button--tertiary': variant === 'tertiary',
      'button--full': fullWidth,
      [className]: className,
    });
  }, [className, fullWidth, variant]);

  return (
    <Component className={classes} type={type} {...props}>
      <span className="button__content">{children}</span>
    </Component>
  );
};
