'use client';
import {
  type FC,
  type HTMLProps,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { generateClasses } from '../../utils/utils';
import { Modal, type ModalProps } from '../modal';

export interface DialogProps extends ModalProps {
  title?: ReactNode;
  header?: ReactNode;
  headerProps?: HTMLProps<HTMLHeadingElement>;

  children?: ReactNode;
  bodyProps?: HTMLProps<HTMLDivElement>;

  footer?: ReactNode;
  footerProps?: HTMLProps<HTMLDivElement>;

  noPadding?: boolean;
  dense?: boolean;

  blank?: boolean;
}

export const Dialog: FC<DialogProps> = ({
  title = '',
  header = '',
  headerProps,
  children = '',
  bodyProps,
  footer = '',
  footerProps,
  noPadding,
  dense,
  className = '',
  open: openProp,
  blank = false,
  ...props
}) => {
  const modalProps = {
    title,
    header,
    headerProps,
    children,
    bodyProps,
    footer,
    footerProps,
  };

  const { onClose } = props as any;
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (openProp) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [openProp]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = (ev: Event) => {
      if (typeof onClose === 'function') onClose(ev);
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const classes = generateClasses({
    dialog: true,
    'theme-small': true,
    '-no-padding': noPadding,
    '-dense': dense,
    [className]: className,
  });
  return (
    <dialog
      ref={ref}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes}
      role="dialog"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      {...props}
    >
      {!blank ? <Modal {...modalProps} /> : children}
    </dialog>
  );
};
