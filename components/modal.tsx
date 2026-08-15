import { FC, HTMLProps, ReactNode } from 'react';
import { Heading, HeadingProps } from './heading';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'header' | 'title'> {
  header?: ReactNode;
  headerProps?: HTMLProps<HTMLDivElement>;
  children?: ReactNode;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footer?: ReactNode;
  footerProps?: HTMLProps<HTMLDivElement>;
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
        <div
          className="modal__body"
          // The dialog's content area IS the paper sheet. The token layer used
          // to assert that by naming `.modal__body` in its own selector, which
          // put a component's class name in a file that should not know one;
          // the element asks for the surface itself instead.
          data-surface="paper"
          id="alert-dialog-description"
          {...bodyProps}
        >
          {children}
        </div>
      )}
      <div className="modal__footer" {...footerProps}>
        {footer}
      </div>
    </div>
  );
};
