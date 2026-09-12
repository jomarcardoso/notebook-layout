'use client';
// notebook-layout/components/reader-marks/reader-marks.tsx
import {
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  useId,
} from 'react';
import { PiCheckBold, PiMinusBold } from 'react-icons/pi';

type Kind = 'checkbox' | 'radio' | 'switch';

export interface ReaderMarkProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label?: ReactNode;
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

const glyphs: Record<Kind, ReactNode> = {
  checkbox: (
    <>
      <PiCheckBold className="check-glyph check-glyph-on" />
      <PiMinusBold className="check-glyph check-glyph-mixed" />
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

const readerMark =
  (kind: Kind): FC<ReaderMarkProps> =>
  ({ label, id, className = '', ref, ...props }) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const classes = [
      'form-check',
      kind === 'switch' && 'form-switch',
      !label && '-bare',
      className,
    ]
      .filter(Boolean)
      .join(' ');

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
        </label>
      </span>
    );
  };

export const Checkbox = readerMark('checkbox');
export const Radio = readerMark('radio');
export const Switch = readerMark('switch');
export const RadioButton = Radio;
export type CheckboxProps = ReaderMarkProps;
export type RadioButtonProps = ReaderMarkProps;
