// notebook-layout/components/molecules/storyboard.tsx
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';

export type StoryboardProps = Omit<ComponentProps<'ol'>, 'ref'>;

export const Storyboard: FC<StoryboardProps> = ({
  className = '',
  children,
  ...props
}) => (
  <ol
    {...props}
    className={generateClasses({
      storyboard: true,
      [className]: Boolean(className),
    })}
  >
    {children}
  </ol>
);

export interface StoryboardFrameProps extends Omit<
  ComponentProps<'li'>,
  'title'
> {
  figure: ReactNode;
  title: ReactNode;
}

export const StoryboardFrame: FC<StoryboardFrameProps> = ({
  figure,
  title,
  className = '',
  children,
  ...props
}) => (
  <li
    {...props}
    className={generateClasses({
      storyboard__frame: true,
      [className]: Boolean(className),
    })}
  >
    <span className="storyboard__figure" aria-hidden="true">
      {figure}
    </span>

    <strong className="storyboard__title">{title}</strong>

    <span className="storyboard__description">{children}</span>
  </li>
);
