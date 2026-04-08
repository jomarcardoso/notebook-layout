import { shouldRevealFieldTarget } from './use-dialog-field-reveal';

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
});
