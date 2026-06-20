import { type FC, HTMLProps, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';

export interface CardProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  img?: ReactNode;
  imgDescription?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'slim';
}

export const Card: FC<CardProps> = ({
  title,
  variant = 'default',
  img,
  imgDescription,
  footer,
  children,
  className = '',
  ...props
}) => {
  const classes = generateClasses({
    card: true,
    'theme-small': true,
    'slim-card': variant === 'slim',
    [className]: className,
  });

  return (
    <article className={classes} {...props}>
      <div className="card__content">
        {title && (
          <div className="card__header">
            <div className="card__title">{title}</div>
          </div>
        )}
        {(img || imgDescription) && (
          <div className="card__img">
            {img}
            {imgDescription && (
              <div className="card__img-description">{imgDescription}</div>
            )}
          </div>
        )}
        <div className="card__body">{children}</div>
        {footer && <div className="card__footer">{footer}</div>}
      </div>
    </article>
  );
};
