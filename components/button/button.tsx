import { type FC, type ButtonHTMLAttributes, ElementType } from 'react';
import './button.scss';

interface Props {
  as?: ElementType;
  variant?: 'primary' | 'secondary';
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
  let classes = 'button';
  classes += className ? ` ${className}` : '';
  classes += variant === 'secondary' ? ' button--secondary' : '';
  classes += fullWidth ? ' button--full' : '';

  return (
    <Component className={classes} type={type} {...props}>
      <span className="button__content">{children}</span>
    </Component>
  );
};
