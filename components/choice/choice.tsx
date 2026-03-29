import './choice.scss';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ElementType,
  FC,
  ReactNode,
} from 'react';
import { generateClasses } from '../../utils/utils';

interface Props {
  as?: ElementType;
  img?: ReactNode;
  title: ReactNode;
  href?: string;
}

export type ChoiceProps = Props &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'title'>;

export const Choice: FC<ChoiceProps> = ({
  as: Component = 'button',
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

  const componentProps =
    Component === 'button' ? { type, ...props } : props;

  return (
    <Component className={classes} {...componentProps}>
      {title && <strong className="choice__title">{title}</strong>}
      {img && <span className="choice__img">{img}</span>}
      {children && <span className="choice__desc">{children}</span>}
    </Component>
  );
};
