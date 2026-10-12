// notebook-layout/components/molecules/collections.tsx
import {
  type ComponentProps,
  type ElementType,
  type FC,
  type MouseEventHandler,
  type ReactNode,
  useId,
} from 'react';
import { generateClasses } from '../../utils/utils';

export interface CollectionProps extends ComponentProps<'ul'> {
  children: ReactNode;
}

const collection =
  (block: string): FC<CollectionProps> =>
  ({ className = '', children, ...props }) => (
    <ul
      role="list"
      className={generateClasses({ [block]: true, [className]: !!className })}
      {...props}
    >
      {children}
    </ul>
  );

export const IndexList = collection('index-list');

export const ThumbGrid = collection('thumb-grid');

export type ThumbItemVariant = 'default' | 'featured' | 'brief';

export interface ThumbItemProps {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
  image?: ComponentProps<'img'>;
  description?: string[];
  linkComponent?: ElementType;
  variant?: ThumbItemVariant;
}

export interface IndexItemProps extends Omit<ThumbItemProps, 'variant'> {
  excerpt?: ReactNode;
}

interface LinkedItemProps extends IndexItemProps {
  block: 'index-item' | 'thumb-item';
  listClassName: string;
  variant?: ThumbItemVariant;
}

const LinkedItem: FC<LinkedItemProps> = ({
  block,
  listClassName,
  href = '',
  onClick,
  children,
  image = {},
  excerpt = '',
  description = [],
  linkComponent = 'a',
  variant = 'default',
}) => {
  const textId = useId();
  const Link = linkComponent;
  const classes = generateClasses({
    [block]: true,
    [`${block}--${variant}`]: variant !== 'default',
  });

  const content = (
    <>
        {variant === 'brief' ? null : image.src ? (
          <img
            loading="lazy"
            {...image}
            className={`app-image ${block}__image`}
            alt=""
          />
        ) : (
          <span className={`app-image ${block}__image`} aria-hidden="true" />
        )}
        <span className={`${block}__text`} id={textId}>
          {children}
        </span>
        {excerpt ? <p className={`${block}__excerpt`}>{excerpt}</p> : null}
        {description.length ? (
          <p className={`${block}__description`}>{description.join(' · ')}</p>
        ) : null}
    </>
  );

  return (
    <li className={listClassName}>
      {onClick ? (
        <button
          type="button"
          className={classes}
          aria-labelledby={textId}
          onClick={onClick}
        >
          {content}
        </button>
      ) : (
        <Link className={classes} href={href} aria-labelledby={textId}>
          {content}
        </Link>
      )}
    </li>
  );
};

export const IndexItem: FC<IndexItemProps> = (props) => (
  <LinkedItem {...props} block="index-item" listClassName="index-list__item" />
);

export const ThumbItem: FC<ThumbItemProps> = (props) => (
  <LinkedItem {...props} block="thumb-item" listClassName="thumb-grid__item" />
);
