import { SectionTitle } from 'components/section-title';
import { FC, HTMLProps } from 'react';

export interface SectionProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  onBgWhite?: boolean;
}

export const Section: FC<SectionProps> = ({
  onBgWhite = false,
  title = '',
  children,
  ...props
}) => {
  return (
    <div className="grid columns-1 g-3" {...props}>
      {title && (
        <div>
          {onBgWhite ? (
            <h2 className="h2" style={{ textAlign: 'center' }}>
              {title}
            </h2>
          ) : (
            <SectionTitle>{title}</SectionTitle>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
