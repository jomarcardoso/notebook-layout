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
          // The dialog's content area is the sheet, and it is at the RAISED
          // rung: it has no fill of its own and inherits `.modal`'s
          // `$modal-bg`, which is `bg-raised`. The attribute names the plane
          // the element is painted on, so everything inside is calibrated
          // against the ground it is actually sitting on.
          data-surface="raised"
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
