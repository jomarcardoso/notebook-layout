'use client';
import { FC, HTMLProps, ReactNode, useId } from 'react';
import './section-card.scss';
import { generateClasses } from '../../utils/utils';

interface Props {
  title?: string;
  header?: ReactNode;
}

export type SectionCardProps = HTMLProps<HTMLDivElement> & Props;

export const SectionCard: FC<SectionCardProps> = ({
  header,
  title = '',
  children,
  className = '',
  ...props
}) => {
  const classes = generateClasses({
    'section-card': true,
    [className]: className,
  });
  // useId garante estabilidade entre SSR e cliente, evitando hydration mismatch
  const reactId = useId();
  const id = reactId;

  return (
    <section
      aria-labelledby={id}
      className={classes}
      {...props}
    >
      {(header || title) && (
        // `h3` carries the heading face AND a reading measure, so putting it on
        // the element that also paints the brand band capped the band at the
        // measure — the band stopped short of the card's own width. The band is
        // the outer element and the text keeps its measure inside it.
        <strong className="section-card__title" id={id}>
          <div className="title-sm">{header || title}</div>
        </strong>
      )}
      <div className="section-card__body">{children}</div>
    </section>
  );
};
