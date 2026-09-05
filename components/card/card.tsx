import { type FC, HTMLProps, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';

export interface CardProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  /**
   * The one line under the title: which list, how many portions, how long.
   * It is the information a reader scanning a grid is actually choosing
   * between, and it had nowhere to live before.
   */
  meta?: ReactNode;
  img?: ReactNode;
  imgDescription?: ReactNode;
  footer?: ReactNode;
}

/**
 * A sheet laid on the page.
 *
 * THE TITLE IS NOT A HEADER. It used to be wrapped in a `card__header` band —
 * a filled strip one rung down from the body — which is the Enterprise
 * vocabulary and reads, on an Editorial page, as a serif title sitting inside
 * somebody else's component. The title is a line of type in the body now, and
 * the room above it is what ranks it.
 *
 * THE IMAGE ELEMENT IS NOT RENDERED WHEN THERE IS NO IMAGE. An empty slot came
 * out as a large tan rectangle, which a reader takes for a picture that failed
 * to load rather than for a card that has none.
 */
export const Card: FC<CardProps> = ({
  title,
  meta,
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
    [className]: className,
  });

  return (
    <article className={classes} {...props}>
      <div className="card__content">
        {img && <div className="card__img">{img}</div>}
        {imgDescription && (
          <div className="card__img-description">{imgDescription}</div>
        )}
        <div className="card__body">
          {title && <div className="card__title">{title}</div>}
          {meta && <p className="card__meta">{meta}</p>}
          {children}
        </div>
        {footer && <div className="card__footer">{footer}</div>}
      </div>
    </article>
  );
};
