import { type FC, HTMLProps, type ReactNode } from 'react';

export interface CardProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  title: ReactNode;
  img: ReactNode;
}

export const Card: FC<CardProps> = ({ title, img, children, ...props }) => {
  return (
    <div className="card" {...props}>
      {title && (
        <div className="card__header">
          <div className="card__title">{title}</div>
        </div>
      )}
      {img && <div className="card__img">{img}</div>}
      <div className="card__body">{children}</div>
    </div>
  );
};
