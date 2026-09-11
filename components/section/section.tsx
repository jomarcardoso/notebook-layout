// notebook-layout/components/section/section.tsx
import './section.scss';
import { FC, HTMLProps, ReactNode } from 'react';
import { SectionTitle } from '../section-title';

export interface SectionProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  header?: ReactNode;
}

export const Section: FC<SectionProps> = ({
  className = '',
  header = '',
  title = '',
  children,
  ...props
}) => {
  const heading: ReactNode = header || title;

  return (
    <section className={`section ${className}`.trim()} {...props}>
      {heading && <SectionTitle>{heading}</SectionTitle>}

      <div className="section__body l-stack">{children}</div>
    </section>
  );
};
