"use client";
import {
  FC,
  ImgHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { generateClasses } from '../../utils/utils';
import './avatar.scss';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = 'data:image/png;base64,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';

export const Avatar: FC<AvatarProps> = ({
  alt = ' ',
  className = '',
  src,
  fallbackSrc,
  onError,
  ...props
}) => {
  const [hideImage, setHideImage] = useState(!src);
  const classes = generateClasses({
    avatar: true,
    [className]: Boolean(className),
  });

  const resolvedFallback = useMemo(
    () => fallbackSrc ?? DEFAULT_FALLBACK,
    [fallbackSrc],
  );

  useEffect(() => {
    setHideImage(!src);
  }, [src]);

  return (
    <div className={classes}>
      {!hideImage && src ? (
        <img
          alt={alt}
          className="avatar__img"
          src={src}
          onError={(event) => {
            setHideImage(true);
            onError?.(event);
          }}
          {...props}
        />
      ) : (
        <img
          alt=""
          aria-hidden="true"
          className="avatar__fallback"
          src={resolvedFallback}
          {...props}
        />
      )}
    </div>
  );
};
