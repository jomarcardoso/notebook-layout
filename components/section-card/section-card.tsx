import { FC, HTMLProps } from 'react';
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
  const id = Math.random().toString(36).substring(2, 9);

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
