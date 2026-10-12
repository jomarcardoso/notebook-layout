// notebook-layout/components/modal.tsx
import { type ComponentProps, type FC, type ReactNode } from 'react';
import { Heading, HeadingProps } from './heading';

interface Props extends Omit<ComponentProps<'div'>, 'header' | 'title'> {
  header?: ReactNode;
  headerProps?: ComponentProps<'div'>;
  children?: ReactNode;
  bodyProps?: ComponentProps<'div'>;
  footer?: ReactNode;
  footerProps?: ComponentProps<'div'>;
}

export type ModalProps = Props & HeadingProps;

export const Modal: FC<ModalProps> = ({
  title = '',
  titleProps,
  subtitle = '',
  subtitleProps,
  indicator = '',
  indicatorProps,
  header = '',
  headerProps,
  children = '',
  bodyProps,
  footer = '',
  footerProps,
}) => {
  const headingProps: HeadingProps = {
    titleProps,
    subtitle,
    subtitleProps,
    indicator,
    indicatorProps,
    ...headerProps,
  };

  return (
    <div className="modal">
      {(title || header) && (
        <Heading {...headingProps}>{title || header}</Heading>
      )}
      {children && (
        <div className="modal__body" {...bodyProps}>
          {children}
        </div>
      )}
      <div className="modal__footer" {...footerProps}>
        {footer}
      </div>
    </div>
  );
};
