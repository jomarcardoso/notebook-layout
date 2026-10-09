'use client';
// notebook-layout/components/reader-marks/reader-marks.tsx
import {
  type FC,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  useId,
} from 'react';
import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { MinusIcon } from '@phosphor-icons/react/dist/ssr/Minus';
import { withWeight } from '../atoms/icon';

const CheckBoldIcon = withWeight(CheckIcon, 'bold');
const MinusBoldIcon = withWeight(MinusIcon, 'bold');

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
