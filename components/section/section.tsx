import { SectionTitle } from '../section-title';
import { FC, HTMLProps } from 'react';

export interface SectionProps extends HTMLProps<HTMLDivElement> {
  title?: string;
  header?: string;
  onBgWhite?: boolean;
}

export const Section: FC<SectionProps> = ({
  onBgWhite = false,
  header,
  title,
  children,
  ...props
}) => {
  return (
    <div className="grid columns-1 g-3" {...props}>
      {(header || title) && (
        <div>
          {onBgWhite ? (
            <h2 className="h2" style={{ textAlign: 'center' }}>
              {header || title}
            </h2>
          ) : (
            <SectionTitle>{header || title}</SectionTitle>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
