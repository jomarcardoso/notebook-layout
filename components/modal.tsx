import { FC, HTMLProps, ReactNode } from 'node_modules/@types/react';

export interface ModalProps extends Omit<HTMLProps<HTMLDivElement>, 'header'> {
  title?: ReactNode;
  titleProps?: HTMLProps<HTMLHeadingElement>;
  subtitle?: ReactNode;
  subtitleProps?: HTMLProps<HTMLParagraphElement>;
  header?: ReactNode;
  headerProps?: HTMLProps<HTMLDivElement>;
  children?: ReactNode;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footer: ReactNode;
  footerProps?: HTMLProps<HTMLDivElement>;
}

export const Modal: FC<ModalProps> = ({
  title = '',
  titleProps,
  subtitle = '',
  subtitleProps,
  header = '',
  headerProps,
  children = '',
  bodyProps,
  footer = '',
  footerProps,
}) => {
  return (
    <div className="modal">
      {(title || header) && (
        <div {...headerProps} className="modal__header">
          <h2 className="h2" id="alert-dialog-title" {...titleProps}>
            {title || header}
          </h2>

          {subtitle && <p {...subtitleProps}>{subtitle}</p>}
        </div>
      )}
      {children && (
        <div
          className="modal__body theme-light"
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
