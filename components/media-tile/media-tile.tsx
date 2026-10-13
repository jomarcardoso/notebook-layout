// notebook-layout/components/media-tile/media-tile.tsx
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { generateClasses } from '../../utils/utils';

export interface MediaTileProps extends ComponentProps<'div'> {
  media?: ReactNode;
  placeholder?: ReactNode;
  status?: ReactNode;
  tone?: 'default' | 'danger';
  busy?: boolean;
  actions?: ReactNode;
  error?: ReactNode;
  compact?: boolean;
}

/**
 * A square image with what is happening to it: a word on top when the
 * state is transient, the actions below and the error, when there is one.
 */
export const MediaTile: FC<MediaTileProps> = ({
  media = '',
  placeholder = '',
  status = '',
  tone = 'default',
  busy = false,
  actions = '',
  error = '',
  compact = false,
  className = '',
  ...props
}) => (
  <div
    {...props}
    className={generateClasses({
      'media-tile': true,
      'media-tile--compact': compact,
      'media-tile--danger': tone === 'danger',
      [className]: Boolean(className),
    })}
  >
    <div className="media-tile__media" aria-busy={(busy && !media) || undefined}>
      {media}
      {!media && !busy && placeholder && (
        <span className="media-tile__placeholder">{placeholder}</span>
      )}
      {status && <span className="media-tile__status">{status}</span>}
    </div>

    {actions && <div className="media-tile__actions">{actions}</div>}

    {error && (
      <p className="media-tile__error" role="alert">
        {error}
      </p>
    )}
  </div>
);
