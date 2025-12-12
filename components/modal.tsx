import { FC, HTMLProps, ReactNode } from 'node_modules/@types/react';
import { Heading, HeadingProps } from './heading';

interface Props extends Omit<HTMLProps<HTMLDivElement>, 'header'> {
  header?: ReactNode;
  headerProps?: HTMLProps<HTMLDivElement>;
  children?: ReactNode;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footer: ReactNode;
  footerProps?: HTMLProps<HTMLDivElement>;
}

export type ModalProps = Props & HeadingProps;

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
  const headingProps: HeadingProps = {
    title,
    titleProps,
    subtitle,
    subtitleProps,
    children: header,
    ...headerProps,
  };

  return (
    <div className="modal">
      {(title || header) && <Heading {...headingProps} />}
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
