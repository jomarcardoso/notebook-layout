import { type FC, type ButtonHTMLAttributes } from 'react';
import './button.scss';

interface Props {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export type ButtonProps = Props & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({
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
    <button className={classes} type={type} {...props}>
      <span className="button__content">{children}</span>
    </button>
  );
};
