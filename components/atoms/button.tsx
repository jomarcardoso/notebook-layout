// notebook-layout/components/atoms/button.tsx
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';
import { Icon, type IconGlyph } from './icon';

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
  ComponentProps<'button'>,
  'className'
> {
  weight?: ButtonWeight;
  icon?: IconGlyph;
  loading?: boolean;
  block?: boolean;
  description?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  weight = 'estruturante',
  icon,
  loading = false,
  block = false,
  description = '',
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  const classes = generateClasses({
    btn: true,
    [CLASS_BY_WEIGHT[weight]]: true,
    'btn-block': block,
    [className]: Boolean(className),
  });

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
      {description && <small>{description}</small>}
      {loading && <span className="spinner-border" aria-hidden="true" />}
    </button>
  );
};
