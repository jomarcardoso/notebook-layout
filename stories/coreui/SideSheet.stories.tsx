// notebook-layout/stories/coreui/SideSheet.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useId, useState } from 'react';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Button, IconButton } from '@components/atoms';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Side sheet',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "CoreUI's .offcanvas with the entry configuration. An overlaid sheet only for an irreversible act or for context that must be set aside while deciding; choosing, filtering and editing a field stay in place.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SideSheetDemo = () => {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) {
      return () => {};
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', closeOnEscape);

    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <Sheet>
      <Group
        title="Side sheet"
        note="Page paper with a rule on the edge that touches the content, over the bg-backdrop veil. The X is the IconButton with Phosphor, not the library's .btn-close. The sheet shadow is not emitted yet: see the inventory's open items."
      >
        <div>
          <Button weight="structural" onClick={() => setOpen(true)}>
            Ver o historico de edicoes
          </Button>
        </div>
      </Group>

      <div
        className={`offcanvas offcanvas-end${open ? ' show' : ''}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title title-sm" id={`${id}-title`}>
            Historico de edicoes
          </h2>
          <IconButton
            icon={XIcon}
            label="Fechar"
            style={{ marginInlineStart: 'auto' }}
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="offcanvas-body">
          <p className="body">
            A versao anterior desta receita sera descartada quando a nova for
            publicada, e nao ha como recupera-la depois.
          </p>
        </div>
      </div>
      {open && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setOpen(false)}
        />
      )}
    </Sheet>
  );
};

export const Playground: Story = {
  render: () => <SideSheetDemo />,
};
