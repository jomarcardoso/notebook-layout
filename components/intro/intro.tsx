// notebook-layout/components/intro/intro.tsx
import {
  type ComponentProps,
  type ElementType,
  type FC,
  type ReactNode,
} from 'react';
import { generateClasses } from '../../utils/utils';
import './intro.scss';

export interface IntroProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode;
  intro?: ReactNode;
  titleAs?: ElementType;
}

export const Intro: FC<IntroProps> = ({
  title,
  intro,
  titleAs: TitleTag = 'h1',
  className = '',
  children,
  ...props
}) => {
  const classes = generateClasses({
    intro: true,
    [className]: Boolean(className),
  });

  return (
    <div className={classes} {...props}>
      {(title || intro) && (
        <div className="grid">
          <div className="g-col-12">
            {title && <TitleTag className="title-lg">{title}</TitleTag>}
            {intro && <p className="body">{intro}</p>}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};
