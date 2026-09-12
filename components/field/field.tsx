'use client';
// notebook-layout/components/field/field.tsx

import {
  type ChangeEventHandler,
  type FC,
  type FocusEventHandler,
  type HTMLProps,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useId,
} from 'react';
import { PiX } from 'react-icons/pi';
import { IconButton } from '../atoms/icon-button';
import {
  FieldInput,
  FieldSelect,
  FieldTextarea,
  type FieldOption,
} from './field.controls';
import {
  FieldMarkers,
  hasFieldMarkers,
  type FieldListStyleImage,
} from './field.markers';
import { FieldError, FieldHint, FieldLabel } from './field.messages';

export type { FieldOption };

interface OwnProps {
  rootProps?: HTMLProps<HTMLDivElement>;
  labelProps?: HTMLProps<HTMLLabelElement>;
  label?: ReactNode;
  options?: FieldOption[];
  multiline?: boolean;
  breakline?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  optional?: boolean;
  size?: 'large';
  listStyle?: string;
  listStyleImage?: FieldListStyleImage;
  onErase?(): void;
}

type FieldNativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onBlur' | 'onFocus' | 'size'
> &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'onChange' | 'onBlur' | 'onFocus'
  >;

export type FieldProps = FieldNativeProps &
  OwnProps & {
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    minRows?: number | string;
  };

function readText(
  value: FieldProps['value'],
  defaultValue: FieldProps['defaultValue'],
): string {
  return (
    (typeof value === 'string' && value) ||
    (typeof defaultValue === 'string' && defaultValue) ||
    ''
  );
}

export const Field: FC<FieldProps> = ({
  label = '',
  labelProps,
  rootProps,
  options,
  multiline = false,
  breakline = false,
  hint = '',
  error = '',
  optional = false,
  size,
  listStyle = '',
  listStyleImage,
  onErase,
  className = '',
  minRows,
  ...props
}) => {
  const generatedId = useId();
  const id = props.id || generatedId;
  const hintId = `${generatedId}-hint`;
  const errorId = `${generatedId}-error`;

  const isSelect = Boolean(options);
  const isTextarea = !isSelect && (multiline || breakline);
  const hasError = Boolean(error);

  const markers = {
    listStyle,
    listStyleImage,
    text: readText(props.value, props.defaultValue),
  };
  const marked = isTextarea && hasFieldMarkers(markers);

  const describedBy =
    [
      hasError ? errorId : '',
      hint ? hintId : '',
      props['aria-describedby'] ?? '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const shared = {
    ...props,
    id,
    'aria-describedby': describedBy,
    'aria-invalid': hasError || undefined,
  };

  const showErase = Boolean(onErase) && Boolean(props.value);

  return (
    <div
      {...rootProps}
      className={[
        'field',
        isTextarea && 'field--sheet',
        size === 'large' && 'field--large',
        marked && 'field--marked',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <FieldLabel {...labelProps} htmlFor={id} optional={optional}>
          {label}
        </FieldLabel>
      )}

      <div className="field-adorned">
        {marked && <FieldMarkers {...markers} />}

        {isSelect ? (
          <FieldSelect {...shared} options={options ?? []} />
        ) : isTextarea ? (
          <FieldTextarea {...shared} minRows={minRows} />
        ) : (
          <FieldInput {...shared} />
        )}

        {showErase && (
          <div className="field-adorned-trail">
            <IconButton icon={PiX} label="Limpar" onClick={() => onErase?.()} />
          </div>
        )}
      </div>

      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
};
