'use client';
import { FC, HTMLProps, useId } from 'react';
import './section-card.scss';

interface Props {
  title?: string;
}

export type SectionCardProps = HTMLProps<HTMLDivElement> & Props;

export const SectionCard: FC<SectionCardProps> = ({
  title = '',
  children,
  ...props
}) => {
  // useId garante estabilidade entre SSR e cliente, evitando hydration mismatch
  const reactId = useId();
  const id = reactId;

  return (
    <section aria-labelledby={id} className="section-card" {...props}>
      {title && (
        <strong className="section-card__title h2" id={id}>
          {title}
        </strong>
      )}
      <div className="section-card__body">{children}</div>
    </section>
  );
};
