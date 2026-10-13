'use client';
// notebook-layout/components/file-button/file-button.tsx
import { type ChangeEvent, type ComponentProps, type FC, useRef } from 'react';
import { Button, type ButtonProps } from '../atoms/button';

export interface FileButtonProps extends Omit<ButtonProps, 'onChange'> {
  accept?: string;
  multiple?: boolean;
  inputProps?: ComponentProps<'input'>;
  onFiles: (files: File[]) => void | Promise<void>;
}

/**
 * A button in front of a hidden file input. On a phone, the input
 * opens the camera or the gallery.
 */
export const FileButton: FC<FileButtonProps> = ({
  accept = '',
  multiple = false,
  inputProps = {},
  onFiles,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    // React releases `currentTarget` when the handler returns; without clearing the
    // value before the await, picking the same file again fires nothing.
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);

    input.value = '';

    if (files.length) await onFiles(files);
  };

  return (
    <>
      <input
        {...inputProps}
        ref={inputRef}
        type="file"
        accept={accept || undefined}
        multiple={multiple}
        disabled={props.disabled}
        hidden
        onChange={(event) => void handleChange(event)}
      />
      <Button {...props} onClick={() => inputRef.current?.click()} />
    </>
  );
};
