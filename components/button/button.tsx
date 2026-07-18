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

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary: 'btn-primary',
  secondary: 'btn-outline-secondary',
  tertiary: 'btn-link',
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
