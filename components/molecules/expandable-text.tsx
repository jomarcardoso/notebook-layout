// notebook-layout/components/molecules/expandable-text.tsx
'use client';
import {
  type FC,
  type HTMLAttributes,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { generateClasses } from '../../utils/utils';
import { Button } from '../atoms/button';

export interface ExpandableTextProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
  textClassName?: string;
  moreLabel?: string;
  lessLabel?: string;
}

/**
 * A text cut at four lines and revealed in place. It knows nothing about what
 * the text is: the typographic role comes in `textClassName`.
 *
 * The toggle exists only when the cut is real, and whether it is depends on the
 * width and on the reader's font size, so it is measured again whenever the
 * paragraph resizes. The whole text stays in the DOM: a screen reader reads it
 * in full either way.
 */
export const ExpandableText: FC<ExpandableTextProps> = ({
  text,
  textClassName = '',
  moreLabel = 'Continuar lendo',
  lessLabel = 'Mostrar menos',
  className = '',
  ...props
}) => {
  const textId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const collapsedByReaderRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);

  useEffect(() => {
    const element = textRef.current;

    if (!element || expanded) return;

    const measure = () =>
      setClamped(element.scrollHeight > element.clientHeight + 1);

    measure();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);

    observer.observe(element);

    return () => observer.disconnect();
  }, [expanded, text]);

  // Collapsing can leave the toggle above the viewport, and the reader loses
  // their place; bring it back only as far as needed.
  useEffect(() => {
    if (expanded || !collapsedByReaderRef.current) return;

    collapsedByReaderRef.current = false;
    rootRef.current?.scrollIntoView({ block: 'nearest' });
  }, [expanded]);

  // Collapsed is the state of the whole block, not of its text: the block
  // carries it, and the text is what it changes.
  const classes = generateClasses({
    'expandable-text': true,
    'expandable-text--collapsed': !expanded,
    [className]: className,
  });

  function toggle() {
    collapsedByReaderRef.current = expanded;
    setExpanded(!expanded);
  }

  return (
    <div ref={rootRef} className={classes} {...props}>
      <p
        id={textId}
        ref={textRef}
        className={`expandable-text__text ${textClassName}`.trim()}
      >
        {text}
      </p>

      {(clamped || expanded) && (
        <Button
          weight="texto"
          className="btn-flush"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={toggle}
        >
          {expanded ? lessLabel : moreLabel}
        </Button>
      )}
    </div>
  );
};
