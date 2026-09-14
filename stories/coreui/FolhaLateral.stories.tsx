// notebook-layout/stories/coreui/FolhaLateral.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useId, useState } from 'react';
import { PiX } from 'react-icons/pi';
import { Button, IconButton } from '@components/atoms';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Folha lateral',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O .offcanvas do CoreUI com a configuracao do entry. Folha sobreposta so para ato irreversivel ou para contexto que precisa ser esquecido enquanto se decide; escolher, filtrar e editar um campo continuam no lugar.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const FolhaDemo = () => {
  const [aberta, setAberta] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!aberta) {
      return () => {};
    }

    const fecharNoEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAberta(false);
      }
    };

    window.addEventListener('keydown', fecharNoEscape);

    return () => window.removeEventListener('keydown', fecharNoEscape);
  }, [aberta]);

  return (
    <Sheet>
      <Group
        title="Folha lateral"
        note="Papel da pagina com fio na borda que encosta no conteudo, sobre o veu bg-backdrop. O X e o IconButton com Phosphor, e nao o .btn-close da biblioteca. A sombra da folha ainda nao e emitida: ver as pendencias do inventario."
      >
        <div>
          <Button weight="estruturante" onClick={() => setAberta(true)}>
            Ver o historico de edicoes
          </Button>
        </div>
      </Group>

      <div
        className={`offcanvas offcanvas-end${aberta ? ' show' : ''}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title title-sm" id={`${id}-titulo`}>
            Historico de edicoes
          </h2>
          <IconButton
            icon={PiX}
            label="Fechar"
            style={{ marginInlineStart: 'auto' }}
            onClick={() => setAberta(false)}
          />
        </div>
        <div className="offcanvas-body">
          <p className="p">
            A versao anterior desta receita sera descartada quando a nova for
            publicada, e nao ha como recupera-la depois.
          </p>
        </div>
      </div>
      {aberta && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setAberta(false)}
        />
      )}
    </Sheet>
  );
};

export const Playground: Story = {
  render: () => <FolhaDemo />,
};
