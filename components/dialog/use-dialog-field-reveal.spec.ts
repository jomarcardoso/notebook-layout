import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import {
  shouldRevealFieldTarget,
  useDialogFieldReveal,
} from './use-dialog-field-reveal';

describe('useDialogFieldReveal helpers', () => {
  it('reveals native text fields', () => {
    expect(shouldRevealFieldTarget(document.createElement('textarea'))).toBe(true);
    expect(shouldRevealFieldTarget(document.createElement('input'))).toBe(true);
  });

  it('ignores contenteditable editors on focus and live updates', () => {
    const editor = document.createElement('div');
    editor.setAttribute('contenteditable', 'true');
    const paragraph = document.createElement('p');
    editor.appendChild(paragraph);

    expect(shouldRevealFieldTarget(editor)).toBe(false);
    expect(shouldRevealFieldTarget(paragraph)).toBe(false);
  });

  it('anchors the dialog to the top of the visible part of the screen', () => {
    const dialog = document.createElement('dialog');
    const body = document.createElement('div');

    body.className = 'modal__body';
    dialog.appendChild(body);
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: {
        height: 400,
        offsetTop: 180,
        addEventListener: () => {},
        removeEventListener: () => {},
      },
    });

    const Probe = () => {
      useDialogFieldReveal({ dialogRef: { current: dialog }, open: true });

      return null;
    };

    act(() => {
      createRoot(document.createElement('div')).render(createElement(Probe));
    });

    expect(dialog.style.getPropertyValue('--dialog-visual-viewport-top')).toBe(
      '180px',
    );
  });
});
