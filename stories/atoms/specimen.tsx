// notebook-layout/stories/atoms/specimen.tsx
import { type FC, type ReactNode } from 'react';

export const Sheet: FC<{ children: ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'grid',
      gap: 'var(--app-rhythm-1)',
      maxInlineSize: '44rem',
    }}
  >
    {children}
  </div>
);

export const Row: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div
    style={{
      alignItems: 'center',
      display: 'grid',
      gap: 'var(--app-space-md)',
      gridTemplateColumns: 'minmax(0, 11rem) minmax(0, 1fr)',
    }}
  >
    <span className="caption">{label}</span>
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--app-space-sm)',
      }}
    >
      {children}
    </div>
  </div>
);

export const Group: FC<{
  title: string;
  note?: string;
  children: ReactNode;
}> = ({ title, note = '', children }) => (
  <section>
    <h2 className="section-title -sub">{title}</h2>
    {note && <p className="caption">{note}</p>}
    <div
      style={{
        display: 'grid',
        gap: 'var(--app-space-md)',
        marginBlockStart: 'var(--app-space-md)',
      }}
    >
      {children}
    </div>
  </section>
);
