import './choice.scss';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';

export interface ChoiceProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'title'
> {
  img?: ReactNode;
  title: ReactNode;
}

export const Choice: FC<ChoiceProps> = ({
  type = 'button',
  className = '',
  img = '',
  title = '',
  children = '',
  ...props
}) => {
  const classes = generateClasses({
    choice: true,
    [className]: !!className,
  });

  return (
    <button type={type} className={classes} {...props}>
      {title && <strong className="choice__title">{title}</strong>}
      {img && <span className="choice__img">{img}</span>}
      {children && <span className="choice__desc">{children}</span>}
    </button>
  );
};
