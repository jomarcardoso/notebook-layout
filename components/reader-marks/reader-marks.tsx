'use client';
// notebook-layout/components/reader-marks/reader-marks.tsx
import {
  type ComponentProps,
  type FC,
  type ReactNode,
  type Ref,
  useId,
} from 'react';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { generateClasses } from '../../utils/utils';
import { withWeight } from '../atoms/icon';

const CheckBoldIcon = withWeight(CheckIcon, 'bold');
const MinusBoldIcon = withWeight(MinusIcon, 'bold');

type Kind = 'checkbox' | 'radio' | 'switch';

export interface ReaderMarkProps extends Omit<
  ComponentProps<'input'>,
  'type' | 'className'
> {
  /** The text the reader clicks. Without it the mark stands alone, centred in a 44px target, and needs an `aria-label`. */
  label?: ReactNode;
  /** A second line under the label, in `caption`, for what the choice implies. */
  description?: ReactNode;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

const glyphs: Record<Kind, ReactNode> = {
  checkbox: (
    <>
      <CheckBoldIcon className="check-glyph check-glyph-on" />
      <MinusBoldIcon className="check-glyph check-glyph-mixed" />
    </>
  ),
  radio: null,
  switch: null,
};

const inputType: Record<Kind, string> = {
  checkbox: 'checkbox',
  radio: 'radio',
  switch: 'checkbox',
};

/**
 * A reader's mark: the box, the circle or the switch a person ticks while
 * reading or filling in a form.
 *
 * The input is native and covers the whole row, so the click target, the hover
 * and the browser's own focus ring are the same box: the line with the mark and
 * its label. The mark is drawn in a `span` beside the text, and a ticked box
 * uses Phosphor's bold check at 14px, which gives the same stroke as the 20px
 * icons. Any attribute an `input` accepts goes to the input itself; `label` and
 * `description` are tied to it by `id`.
 */
const readerMark =
  (kind: Kind): FC<ReaderMarkProps> =>
  ({ label, description = '', id, className = '', ref, ...props }) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const classes = generateClasses({
      'form-check': true,
      'form-switch': kind === 'switch',
      '-bare': !label,
      [className]: Boolean(className),
    });

    return (
      <span className={classes}>
        <input
          {...props}
          ref={ref}
          type={inputType[kind]}
          role={kind === 'switch' ? 'switch' : undefined}
          id={inputId}
          className="form-check-input"
        />
        <label htmlFor={inputId} className="form-check-label">
          <span className="check-box" aria-hidden="true">
            {glyphs[kind]}
          </span>
          {label}
          {description && (
            <span className="form-check-description">{description}</span>
          )}
        </label>
      </span>
    );
  };

/** A box for an independent yes or no, or for one of many in a group. */
export const Checkbox = readerMark('checkbox');
/** A circle for one choice among a few, all visible at once. */
export const Radio = readerMark('radio');
/** A square switch for a setting that takes effect immediately. */
export const Switch = readerMark('switch');
export const RadioButton = Radio;
export type CheckboxProps = ReaderMarkProps;
export type RadioButtonProps = ReaderMarkProps;
