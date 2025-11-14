'use client';
import {
  type FC,
  type HTMLProps,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { generateClasses } from '../../utils/utils';

export interface DialogProps extends HTMLProps<HTMLDialogElement> {
  titleProps?: HTMLProps<HTMLHeadingElement>;
  contentProps?: HTMLProps<HTMLDivElement>;
  actions: ReactNode;
  actionsProps?: HTMLProps<HTMLDivElement>;
  children?: ReactNode;
  noPadding?: boolean;
  dense?: boolean;
}

const Dialog: FC<DialogProps> = ({
  title = '',
  titleProps,
  children = '',
  contentProps,
  actions = '',
  actionsProps,
  noPadding,
  dense,
  className = '',
  ...props
}) => {
  const { open: openProp, onClose } = props as any;
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
      <div className="dialog__panel">
        {title && (
          <h2 className="dialog__title" id="alert-dialog-title" {...titleProps}>
            {title}
          </h2>
        )}
        {children && (
          <div
            className="dialog__content"
            id="alert-dialog-description"
            {...contentProps}
          >
            {children}
          </div>
        )}
        <div className="dialog__footer" {...actionsProps}>
          {actions}
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
