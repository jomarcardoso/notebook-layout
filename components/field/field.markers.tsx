// notebook-layout/components/field/field.markers.tsx
import { type FC } from 'react';
import { formatListMarker } from '../../services/list-marker.service';
import { unwrapUrl } from '../../services/url.service';

interface Marker {
  image: string;
  text: string;
}

export type FieldListStyleImage = string | Array<string | null | undefined>;

function buildMarkers(
  listStyle: string,
  listStyleImage: FieldListStyleImage | undefined,
  lineCount: number,
): Marker[] {
  if (Array.isArray(listStyleImage)) {
    return Array.from(
      { length: Math.max(lineCount, listStyleImage.length) },
      (_, index) => {
        const image = unwrapUrl(listStyleImage[index] ?? '');
        const text =
          !image && listStyle && listStyle !== 'none'
            ? formatListMarker(listStyle, index + 1)
            : '';

        return { image, text };
      },
    );
  }

  if (typeof listStyleImage === 'string') {
    const image = unwrapUrl(listStyleImage);

    if (!image) return [];

    return Array.from({ length: lineCount }, () => ({ image, text: '' }));
  }

  if (!listStyle || listStyle === 'none') return [];

  return Array.from({ length: lineCount }, (_, index) => ({
    image: '',
    text: formatListMarker(listStyle, index + 1),
  }));
}

function splitLines(text: string): string[] {
  return text ? text.split(/\r?\n/) : [''];
}

export interface FieldMarkersProps {
  listStyle: string;
  listStyleImage?: FieldListStyleImage;
  text: string;
}

export function hasFieldMarkers({
  listStyle,
  listStyleImage,
  text,
}: FieldMarkersProps): boolean {
  return (
    buildMarkers(listStyle, listStyleImage, splitLines(text).length).length > 0
  );
}

export const FieldMarkers: FC<FieldMarkersProps> = ({
  listStyle,
  listStyleImage,
  text,
}) => {
  const lines = splitLines(text);
  const markers = buildMarkers(listStyle, listStyleImage, lines.length);

  if (!markers.length) return null;

  return (
    <ul className="field-markers" aria-hidden="true">
      {markers.map((marker, index) => (
        <li className="field-markers__item" key={index}>
          <span className="field-markers__mark">
            {marker.image ? (
              <img className="content-figure" src={marker.image} alt="" />
            ) : (
              marker.text && (
                <span className="field-markers__glyph">{marker.text}</span>
              )
            )}
          </span>

          <span className="field-markers__line">{lines[index] ?? ''}</span>
        </li>
      ))}
    </ul>
  );
};
