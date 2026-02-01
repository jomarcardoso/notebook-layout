'use client';

import {
  FC,
  HTMLProps,
  ReactNode,
  useState,
  ChangeEventHandler,
  ChangeEvent,
  FormEvent,
  useRef,
  MutableRefObject,
  useMemo,
  useCallback,
} from 'react';
import {
  TextareaAutosize,
  TextareaAutosizeProps,
} from '@mui/base/TextareaAutosize';
import { CiCircleRemove } from 'react-icons/ci';
import './field.scss';
import { generateClasses } from '../../utils/utils';
import { AutoResizeTextarea } from '../../utils/auto-resize-textarea';

interface Props {
  rootProps?: HTMLProps<HTMLDivElement>;
  labelProps?: HTMLProps<HTMLLabelElement>;
  label?: HTMLProps<HTMLLabelElement>['children'];
  multiline?: boolean;
  breakline?: boolean;
  hint?: ReactNode;
  listStyle?: string;
  listStyleImage?: string | Array<string | null | undefined>;
  onErase?(): void;
  size?: 'large';
}

export type FieldProps = (TextareaAutosizeProps | HTMLProps<HTMLInputElement>) &
  Props;

export const Field: FC<FieldProps> = ({
  multiline = false,
  breakline = true,
  onErase,
  labelProps,
  rootProps,
  label,
  hint = '',
  listStyle,
  listStyleImage,
  className = '',
  size,
  ...props
}) => {
  const { id: inputId, onBlur, onFocus } = props;
  const [focused, setFocused] = useState(false);
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

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

  const classes = generateClasses({
    field: true,
    'field--large': size === 'large',
    'field--multiline': multiline,
    'field--list': hasListMarkers,
    'field--focused': focused,
    'field--no-label': !label,
    'field--no-erasable': !onErase,
    'field--no-breakline': !breakline,
    [className]: className,
  });

  const handleChange = useCallback<
    ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  >(
    (event) => {
      if (props.onChange) {
        props.onChange(
          event as ChangeEvent<HTMLTextAreaElement> &
            FormEvent<HTMLInputElement>,
        );
      }
    },
    [props],
  );

  const handleFocus = useCallback((event: Event) => {
    onFocus?.(event as any);
    setFocused(true);
  }, []);

  const handleBlur = useCallback((event: Event) => {
    onBlur?.(event as any);
    setFocused(false);
  }, []);

  const memoizedInput = useMemo(
    () => (
      <input
        type="text"
        className="field__input"
        {...(props as HTMLProps<HTMLInputElement>)}
        onFocus={handleFocus as any}
        onBlur={handleBlur as any}
        onChange={handleChange}
        ref={inputRef}
      />
    ),
    [handleChange, props],
  );

  const memoizedTextarea = useMemo(
    () => (
      <AutoResizeTextarea
        className="field__input"
        minRows={1}
        {...(props as TextareaAutosizeProps)}
        onFocus={handleFocus as any}
        onBlur={handleBlur as any}
        onChange={handleChange}
      />
    ),
    [handleChange, props],
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
          {breakline ? memoizedTextarea : memoizedInput}
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
      breakline,
      classes,
      hint,
      inputId,
      label,
      labelProps,
      listMarkers,
      hasListMarkers,
      memoizedInput,
      memoizedTextarea,
      onErase,
      props.value,
      rootProps,
    ],
  );

  return memoizedRender;
};
