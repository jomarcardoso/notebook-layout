import { FC, HTMLProps, ReactNode } from 'node_modules/@types/react';

export interface HeadingProps extends Omit<HTMLProps<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  titleProps?: HTMLProps<HTMLHeadingElement>;
  subtitle?: ReactNode;
  subtitleProps?: HTMLProps<HTMLParagraphElement>;
}

export const Heading: FC<HeadingProps> = ({
  title = '',
  titleProps,
  subtitle = '',
  subtitleProps,
  children = '',
  ...props
}) => {
  return (
    <div {...props} className="modal__header">
      <h2 className="h2" id="alert-dialog-title" {...titleProps}>
        {title || children}
      </h2>

      {subtitle && <p {...subtitleProps}>{subtitle}</p>}
    </div>
  );
};
