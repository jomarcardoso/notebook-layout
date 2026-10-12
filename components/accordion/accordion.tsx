// notebook-layout/components/accordion/accordion.tsx
import {
  type ComponentProps,
  type ElementType,
  type FC,
  type ReactNode,
} from 'react';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { generateClasses } from '../../utils/utils';
import { Icon, type IconGlyph } from '../atoms/icon';

export type AccordionProps = ComponentProps<'div'>;

export const Accordion: FC<AccordionProps> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    {...props}
    className={generateClasses({
      accordion: true,
      [className]: Boolean(className),
    })}
  >
    {children}
  </div>
);

export interface AccordionItemProps extends Omit<
  ComponentProps<'details'>,
  'title'
> {
  title: ReactNode;
  titleAs?: ElementType;
  icon?: IconGlyph;
  trailing?: ReactNode;
}

export const AccordionItem: FC<AccordionItemProps> = ({
  title,
  titleAs: Title = 'span',
  icon,
  trailing = '',
  className = '',
  children,
  ...props
}) => (
  <details
    {...props}
    className={generateClasses({
      'accordion-item': true,
      [className]: Boolean(className),
    })}
  >
    <summary className="accordion-button">
      {icon && <Icon icon={icon} />}
      <Title className="accordion-title">{title}</Title>
      {trailing}
      <Icon icon={CaretDownIcon} className="accordion-indicator" />
    </summary>
    <div className="accordion-body">{children}</div>
  </details>
);
