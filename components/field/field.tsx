'use client';
// notebook-layout/components/field/field.tsx

import {
  type ChangeEventHandler,
  type ComponentProps,
  type FC,
  type FocusEventHandler,
  type ReactNode,
  useId,
} from 'react';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Icon, type IconGlyph } from '../atoms/icon';
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
import { generateClasses } from '../../utils/utils';
import { FieldError, FieldHint, FieldLabel } from './field.messages';

export type { FieldOption };

interface OwnProps {
  rootProps?: ComponentProps<'div'>;
  labelProps?: ComponentProps<'label'>;
  label?: ReactNode;
  icon?: IconGlyph;
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
  ComponentProps<'input'>,
  'onChange' | 'onBlur' | 'onFocus' | 'size'
> &
  Omit<
    ComponentProps<'textarea'>,
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
  icon,
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
      className={generateClasses({
        field: true,
        'field--sheet': isTextarea,
        'field--large': size === 'large',
        'field--marked': marked,
        [className]: Boolean(className),
      })}
    >
      {label && (
        <FieldLabel {...labelProps} htmlFor={id} optional={optional}>
          {label}
        </FieldLabel>
      )}

      <div className="field-adorned">
        {icon && <Icon icon={icon} className="field-adorned-lead" />}
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
            <IconButton icon={XIcon} label="Limpar" onClick={() => onErase?.()} />
          </div>
        )}
      </div>

      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
};
