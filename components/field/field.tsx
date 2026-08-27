'use client';

import {
  FC,
  HTMLProps,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type FocusEventHandler,
  ReactNode,
  useState,
  useEffect,
  ChangeEventHandler,
  useRef,
  useMemo,
  useCallback,
  useId,
} from 'react';
import { CiCircleRemove } from 'react-icons/ci';
import './field.scss';
import { generateClasses } from '../../utils/utils';
import { AutoResizeTextarea } from '../../utils/auto-resize-textarea';

/** One choice in a field that offers a closed set of them. */
export interface FieldOption {
  value: string;
  label: string;
}

interface Props {
  rootProps?: HTMLProps<HTMLDivElement>;
  /**
   * Turns the field into a select.
   *
   * A dropdown is a field like any other — it has the same label, the same box,
   * the same focused state — so it is the same component rather than a second
   * one that has to be kept looking like this one.
   */
  options?: FieldOption[];
  labelProps?: HTMLProps<HTMLLabelElement>;
  label?: HTMLProps<HTMLLabelElement>['children'];
  multiline?: boolean;
  breakline?: boolean;
  hint?: ReactNode;
  listStyle?: string;
  listStyleImage?: string | Array<string | null | undefined>;
  onErase?(): void;
  size?: 'large';
  bg?: ReactNode;
}

type FieldNativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onBlur' | 'onFocus'
> &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'onChange' | 'onBlur' | 'onFocus'
  >;

export type FieldProps = FieldNativeProps &
  Props & {
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    minRows?: number | string;
  };

const normalizeFieldValue = (
  value?: string | number | readonly string[] | null,
): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return value.filter(Boolean).join('');
  }
  return '';
};

export const Field: FC<FieldProps> = ({
  multiline = false,
  breakline = false,
  onErase,
  labelProps,
  rootProps,
  label,
  hint = '',
  listStyle,
  listStyleImage,
  className = '',
  size,
  bg,
  options,
  ...props
}) => {
  const toBeSelect = Boolean(options);
  const toBeTextarea = !toBeSelect && (breakline || multiline);
  const { onBlur, onFocus } = props;
  const generatedId = useId();
  // The label needs something to point at. A caller-supplied id wins so that
  // existing markup and `htmlFor` from outside keep working.
  const inputId = props.id || generatedId;
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(() =>
    Boolean(normalizeFieldValue(props.value ?? props.defaultValue)),
  );
  useEffect(() => {
    setHasValue(
      Boolean(normalizeFieldValue(props.value ?? props.defaultValue)),
    );
  }, [props.value, props.defaultValue]);
  const updateValueFlag = (
    value: string | number | readonly string[] | undefined | null,
  ) => {
    setHasValue(Boolean(normalizeFieldValue(value)));
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  const normalizeListStyleImage = useCallback((value?: string | null) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    const urlMatch = trimmed.match(/^url\((.*)\)$/i);
    if (!urlMatch) return trimmed;
    return urlMatch[1].trim().replace(/^['"]|['"]$/g, '');
  }, []);

  const toAlpha = useCallback((value: number) => {
    let n = value;
    let result = '';
    while (n > 0) {
      n -= 1;
      result = String.fromCharCode(97 + (n % 26)) + result;
      n = Math.floor(n / 26);
    }
    return result || 'a';
  }, []);

  const toRoman = useCallback((value: number) => {
    let n = value;
    if (n <= 0) return '';
    const map = [
      { value: 1000, symbol: 'M' },
      { value: 900, symbol: 'CM' },
      { value: 500, symbol: 'D' },
      { value: 400, symbol: 'CD' },
      { value: 100, symbol: 'C' },
      { value: 90, symbol: 'XC' },
      { value: 50, symbol: 'L' },
      { value: 40, symbol: 'XL' },
      { value: 10, symbol: 'X' },
      { value: 9, symbol: 'IX' },
      { value: 5, symbol: 'V' },
      { value: 4, symbol: 'IV' },
      { value: 1, symbol: 'I' },
    ];
    let result = '';
    for (const item of map) {
      while (n >= item.value) {
        result += item.symbol;
        n -= item.value;
      }
    }
    return result || 'I';
  }, []);

  const formatListMarker = useCallback(
    (style: string, index: number) => {
      const normalized = style.trim().toLowerCase();
      switch (normalized) {
        case 'disc':
          return '•';
        case 'circle':
          return '○';
        case 'square':
          return '■';
        case 'decimal':
          return `${index}.`;
        case 'decimal-leading-zero':
          return `${index < 10 ? `0${index}` : index}.`;
        case 'lower-alpha':
        case 'lower-latin':
          return `${toAlpha(index)}.`;
        case 'upper-alpha':
        case 'upper-latin':
          return `${toAlpha(index).toUpperCase()}.`;
        case 'lower-roman':
          return `${toRoman(index).toLowerCase()}.`;
        case 'upper-roman':
          return `${toRoman(index).toUpperCase()}.`;
        case 'none':
          return '';
        default:
          return '•';
      }
    },
    [toAlpha, toRoman],
  );

  const listStyleType = listStyle?.trim() || '';

  const listLineCount = useMemo(() => {
    if (!breakline && !multiline) return 1;
    const rawValue =
      (typeof props.value === 'string' && props.value) ||
      (typeof props.defaultValue === 'string' && props.defaultValue) ||
      '';
    const count = rawValue ? rawValue.split(/\r?\n/).length : 1;
    return Math.max(1, count);
  }, [breakline, multiline, props.defaultValue, props.value]);

  const listMarkers = useMemo(() => {
    if (Array.isArray(listStyleImage)) {
      return listStyleImage.map((value, index) => {
        const url = normalizeListStyleImage(value);
        const fallback =
          !url && listStyleType && listStyleType !== 'none'
            ? formatListMarker(listStyleType, index + 1)
            : '';
        return { image: url || null, text: fallback };
      });
    }

    if (typeof listStyleImage === 'string') {
      const url = normalizeListStyleImage(listStyleImage);
      if (!url) return [];
      return Array.from({ length: listLineCount }, () => ({
        image: url,
        text: '',
      }));
    }

    if (!listStyleType || listStyleType === 'none') return [];
    return Array.from({ length: listLineCount }, (_, index) => ({
      image: null,
      text: formatListMarker(listStyleType, index + 1),
    }));
  }, [
    formatListMarker,
    listLineCount,
    listStyleImage,
    listStyleType,
    normalizeListStyleImage,
  ]);

  const hasListMarkers = listMarkers.length > 0;

  const shouldShowBg = Boolean(bg) && !focused && !hasValue;
  const classes = generateClasses({
    field: true,
    'field--large': size === 'large',
    'field--multiline': multiline,
    'field--list': hasListMarkers,
    'field--focused': focused,
    'field--no-label': !label,
    'field--no-erasable': !onErase,
    'field--no-breakline': !breakline,
    'field--bg-visible': shouldShowBg,
    [className]: className,
  });

  const handleChange = useCallback<
    ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    (event) => {
      if (props.onChange) {
        props.onChange(event);
      }
      updateValueFlag(event.currentTarget.value);
    },
    [props.onChange],
  );

  const handleFocus = useCallback<
    FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(
    (event) => {
      onFocus?.(event);
      setFocused(true);
    },
    [onFocus],
  );

  const handleBlur = useCallback<
    FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >(
    (event) => {
      onBlur?.(event);
      setFocused(false);
    },
    [onBlur],
  );

  const memoizedInput = useMemo(
    () => (
      <input
        type="text"
        className="field__input"
        {...(props as InputHTMLAttributes<HTMLInputElement>)}
        id={inputId}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        ref={inputRef}
      />
    ),
    [handleChange, inputId, props],
  );

  const memoizedSelect = useMemo(
    () =>
      options ? (
        <select
          className="field__input"
          {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
          id={inputId}
          onFocus={handleFocus as unknown as FocusEventHandler<HTMLSelectElement>}
          onBlur={handleBlur as unknown as FocusEventHandler<HTMLSelectElement>}
          onChange={
            handleChange as unknown as ChangeEventHandler<HTMLSelectElement>
          }
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null,
    [handleChange, inputId, options, props],
  );

  const memoizedTextarea = useMemo(
    () => (
      <AutoResizeTextarea
        className="field__input"
        minRows={1}
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        id={inputId}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    ),
    [handleChange, inputId, props],
  );

  const memoizedRender = useMemo(
    () => (
      <div className={classes} {...rootProps}>
        <img
          src="/images/textures/linned-sheet-texture.svg"
          alt=""
          width="0"
          height="0"
        />
        {label && (
          <label className="field__label" htmlFor={inputId} {...labelProps}>
            {label}
          </label>
        )}
        <label htmlFor={inputId} className="field__box">
          {hasListMarkers && (
            <ul className="field__list" aria-hidden="true">
              {listMarkers.map((marker, index) => (
                <li
                  className="field__list-item"
                  key={`${index}-${marker.image ?? marker.text}`}
                >
                  {marker.image ? (
                    <img
                      className="field__list-image"
                      src={marker.image}
                      alt=""
                    />
                  ) : marker.text ? (
                    <span className="field__list-marker">{marker.text}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {bg ? (
            <div className="field__bg" aria-hidden="true">
              {bg}
            </div>
          ) : null}
          {toBeSelect
            ? memoizedSelect
            : toBeTextarea
              ? memoizedTextarea
              : memoizedInput}
          {onErase && (props.value || inputRef?.current?.value) && (
            <button
              className="field__action"
              type="button"
              onClick={() => onErase()}
            >
              <CiCircleRemove className="field__icon" />
            </button>
          )}
        </label>
        {hint && <div className="field__hint">{hint}</div>}
      </div>
    ),
    [
      toBeSelect,
      toBeTextarea,
      classes,
      hint,
      inputId,
      label,
      labelProps,
      listMarkers,
      hasListMarkers,
      memoizedInput,
      memoizedSelect,
      memoizedTextarea,
      onErase,
      props.value,
      rootProps,
    ],
  );

  return memoizedRender;
};
