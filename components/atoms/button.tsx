// notebook-layout/components/atoms/button.tsx
import { type ButtonHTMLAttributes, type FC, type ReactNode } from 'react';
import { type IconType } from 'react-icons';
import { Icon } from './icon';

/**
 * O peso comunica O CUSTO DE DESFAZER, nao a importancia da acao.
 */
export type ButtonWeight =
  | 'compromisso'
  | 'estruturante'
  | 'texto'
  | 'destrutiva'
  | 'confirmacao-destrutiva';

const CLASS_BY_WEIGHT: Record<ButtonWeight, string> = {
  compromisso: 'btn-primary',
  estruturante: 'btn-outline-secondary',
  texto: 'btn-ghost-primary',
  destrutiva: 'btn-ghost-danger',
  'confirmacao-destrutiva': 'btn-danger',
};

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  weight?: ButtonWeight;
  icon?: IconType;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  weight = 'estruturante',
  icon,
  loading = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  const classes = ['btn', CLASS_BY_WEIGHT[weight], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      {...props}
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={loading || props['aria-disabled']}
      onClick={loading ? undefined : onClick}
    >
      <span className="btn-label">
        {icon && <Icon icon={icon} />}
        {children}
      </span>
      {loading && <span className="spinner-border" aria-hidden="true" />}
    </button>
  );
};
