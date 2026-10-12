// notebook-layout/components/field/field.messages.tsx
import { type ComponentProps, type FC, type ReactNode } from 'react';

export interface FieldLabelProps extends ComponentProps<'label'> {
  htmlFor: string;
  optional?: boolean;
  children: ReactNode;
}

export const FieldLabel: FC<FieldLabelProps> = ({
  optional = false,
  children,
  ...props
}) => (
  <label {...props} className="form-label">
    {children}
    {optional && (
      <>
        {' '}
        <span className="form-label-optional">(opcional)</span>
      </>
    )}
  </label>
);

export interface FieldHintProps {
  id: string;
  children: ReactNode;
}

export const FieldHint: FC<FieldHintProps> = ({ id, children }) => (
  <div className="form-text" id={id}>
    {children}
  </div>
);

export const FieldError: FC<FieldHintProps> = ({ id, children }) => (
  <div className="invalid-feedback" id={id}>
    {children}
  </div>
);
