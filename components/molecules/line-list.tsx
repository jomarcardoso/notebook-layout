// notebook-layout/components/molecules/line-list.tsx
import {
  type ElementType,
  type FC,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { generateClasses } from '../../utils/utils';
import { Checkbox, type CheckboxProps } from '../reader-marks';

export type LineListFamily = 'plain' | 'prose' | 'steps' | 'data';

export interface LineListProps extends HTMLAttributes<HTMLElement> {
  family?: LineListFamily;
  ruled?: boolean;
  children: ReactNode;
}

export const LineList: FC<LineListProps> = ({
  family = 'plain',
  ruled = false,
  className = '',
  children,
  ...props
}) => {
  const Tag = family === 'steps' ? 'ol' : 'ul';
  const classes = generateClasses({
    'line-list': true,
    [`line-list--${family}`]: family !== 'plain',
    'line-list--ruled': ruled,
    [className]: Boolean(className),
  });

  return (
    <Tag role="list" className={classes} {...props}>
      {children}
    </Tag>
  );
};

interface LineContentProps {
  children: ReactNode;
  figure?: string;
  description?: ReactNode;
  trailing?: ReactNode;
}

const LineContent: FC<LineContentProps> = ({
  children,
  figure = '',
  description = '',
  trailing = '',
}) => (
  <>
    {figure ? (
      <span className="line-list__mark">
        <img className="content-figure" src={figure} alt="" />
      </span>
    ) : null}
    <span className="line-list__text">{children}</span>
    {description ? (
      <span className="line-list__description">{description}</span>
    ) : null}
    {trailing ? <span className="line-list__trailing">{trailing}</span> : null}
  </>
);

export interface LineListItemProps extends LineContentProps {
  href?: string;
  linkComponent?: ElementType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  disabled?: boolean;
}

export const LineListItem: FC<LineListItemProps> = ({
  href = '',
  linkComponent = 'a',
  onClick,
  selected = false,
  disabled = false,
  ...content
}) => {
  const current = selected || undefined;

  if (href) {
    const Link = linkComponent;

    return (
      <li>
        <Link className="line-list__item" href={href} aria-current={current}>
          <LineContent {...content} />
        </Link>
      </li>
    );
  }

  if (onClick) {
    return (
      <li>
        <button
          type="button"
          className="line-list__item"
          onClick={onClick}
          disabled={disabled}
          aria-current={current}
        >
          <LineContent {...content} />
        </button>
      </li>
    );
  }

  return (
    <li className="line-list__item">
      <LineContent {...content} />
    </li>
  );
};

export interface LineListCheckProps extends Omit<CheckboxProps, 'label'> {
  children: ReactNode;
  trailing?: ReactNode;
}

export const LineListCheck: FC<LineListCheckProps> = ({
  children,
  trailing = '',
  ...props
}) => (
  <li>
    <Checkbox
      {...props}
      label={<LineContent trailing={trailing}>{children}</LineContent>}
    />
  </li>
);
