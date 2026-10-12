// notebook-layout/components/section/section.tsx
import './section.scss';
import {
  type ComponentProps,
  type ElementType,
  type FC,
  type ReactNode,
} from 'react';
import { generateClasses } from '../../utils/utils';

export interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  title?: ReactNode;
  titleAs?: ElementType;
}

export const Section: FC<SectionProps> = ({
  title = '',
  titleAs: Title = 'h3',
  className = '',
  children,
  ...props
}) => (
  <section
    {...props}
    className={generateClasses({
      'section l-stack': true,
      [className]: Boolean(className),
    })}
  >
    {title && <Title className="section-title">{title}</Title>}

    <div className="section__body l-stack">{children}</div>
  </section>
);
