// notebook-layout/components/molecules/collections.tsx
import {
  type ElementType,
  type FC,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  useId,
} from 'react';
import { generateClasses } from '../../utils/utils';

export interface CollectionProps extends HTMLAttributes<HTMLUListElement> {
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

export interface ThumbItemProps {
  href: string;
  children: ReactNode;
  image?: ImgHTMLAttributes<HTMLImageElement>;
  description?: string[];
  linkComponent?: ElementType;
}

export interface IndexItemProps extends ThumbItemProps {
  excerpt?: ReactNode;
}

interface LinkedItemProps extends IndexItemProps {
  block: 'index-item' | 'thumb-item';
  listClassName: string;
}

const LinkedItem: FC<LinkedItemProps> = ({
  block,
  listClassName,
  href,
  children,
  image = {},
  excerpt = '',
  description = [],
  linkComponent = 'a',
}) => {
  const textId = useId();
  const Link = linkComponent;

  return (
    <li className={listClassName}>
      <Link className={block} href={href} aria-labelledby={textId}>
        {image.src ? (
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
      </Link>
    </li>
  );
};

export const IndexItem: FC<IndexItemProps> = (props) => (
  <LinkedItem {...props} block="index-item" listClassName="index-list__item" />
);

export const ThumbItem: FC<ThumbItemProps> = (props) => (
  <LinkedItem {...props} block="thumb-item" listClassName="thumb-grid__item" />
);
