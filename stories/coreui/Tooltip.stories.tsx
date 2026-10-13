// notebook-layout/stories/coreui/Tooltip.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { type CSSProperties, type ReactNode, useEffect, useId, useState } from 'react';
import { DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Button, IconButton } from '@components/atoms';
import { Group, Row, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Tooltip',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'CoreUI\'s .tooltip as a sheet: page paper, rule, the radius and shadow of an overlaid sheet, text in caption, no arrow. The tooltip complements the accessible name and never carries the information alone: on touch there is no hover, so what it says must already be in the aria-label. Its place is the icon-only button with a universal drawing.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Side = 'top' | 'bottom' | 'start' | 'end';

const POSITION: Record<Side, CSSProperties> = {
  top: {
    insetBlockEnd: 'calc(100% + var(--app-space-2xs))',
    insetInlineStart: '50%',
    transform: 'translateX(-50%)',
  },
  bottom: {
    insetBlockStart: 'calc(100% + var(--app-space-2xs))',
    insetInlineStart: '50%',
    transform: 'translateX(-50%)',
  },
  start: {
    insetBlockStart: '50%',
    insetInlineEnd: 'calc(100% + var(--app-space-2xs))',
    transform: 'translateY(-50%)',
  },
  end: {
    insetBlockStart: '50%',
    insetInlineStart: 'calc(100% + var(--app-space-2xs))',
    transform: 'translateY(-50%)',
  },
};

interface TooltipProps {
  id: string;
  side: Side;
  visible: boolean;
  children: ReactNode;
}

const Tooltip = ({ id, side, visible, children }: TooltipProps) => (
  <div
    id={id}
    role="tooltip"
    className={`tooltip fade bs-tooltip-${side}${visible ? ' show' : ''}`}
    style={{ inlineSize: 'max-content', position: 'absolute', ...POSITION[side] }}
  >
    <div className="tooltip-arrow" />
    <div className="tooltip-inner">{children}</div>
  </div>
);

export const Positions: Story = {
  name: 'Positions',
  render: () => (
    <Sheet>
      <Group
        title="Positions"
        note="Above, below, at the start and at the end of the trigger. Without an arrow, the tooltip sits one inner-space step from the control."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-rhythm-2) 10rem',
            gridTemplateColumns: 'repeat(2, max-content)',
            justifyContent: 'center',
            paddingBlock: 'var(--app-rhythm-2)',
          }}
        >
          {(['top', 'bottom', 'start', 'end'] as Side[]).map((side) => (
            <div key={side} style={{ position: 'relative' }}>
              <Button weight="structural">{side}</Button>
              <Tooltip id={`tooltip-${side}`} side={side} visible>
                Duplicar a receita
              </Tooltip>
            </div>
          ))}
        </div>
      </Group>
    </Sheet>
  ),
};

const BUTTONS = [
  { icon: PlusIcon, label: 'Adicionar ingrediente' },
  { icon: DotsThreeIcon, label: 'Mais opcoes' },
  { icon: XIcon, label: 'Fechar' },
];

interface ButtonWithTooltipProps {
  icon: (typeof BUTTONS)[number]['icon'];
  label: string;
}

const ButtonWithTooltip = ({ icon, label }: ButtonWithTooltipProps) => {
  const id = useId();
  const [pointer, setPointer] = useState(false);
  const [focus, setFocus] = useState(false);
  const visible = pointer || focus;

  useEffect(() => {
    if (!visible) {
      return () => {};
    }

    const hideOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPointer(false);
        setFocus(false);
      }
    };

    window.addEventListener('keydown', hideOnEscape);

    return () => window.removeEventListener('keydown', hideOnEscape);
  }, [visible]);

  return (
    <div style={{ position: 'relative' }}>
      <IconButton
        icon={icon}
        label={label}
        aria-describedby={visible ? id : ''}
        onMouseEnter={() =>
          setPointer(window.matchMedia('(hover: hover)').matches)
        }
        onMouseLeave={() => setPointer(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
      <Tooltip id={id} side="top" visible={visible}>
        {label}
      </Tooltip>
    </div>
  );
};

export const InUse: Story = {
  name: 'In use',
  render: () => (
    <Sheet>
      <Group
        title="In use"
        note="It appears with the mouse pointer or with keyboard focus, and disappears with Escape. On touch it does not appear: the button's accessible name already says the same thing. The bar only has universal drawings (+, three dots, X), the only condition in which an icon-only button is allowed; a product-specific action is a word, and a word needs no tooltip."
      >
        <Row label="action bar">
          <div style={{ display: 'flex', gap: 'var(--app-space-xs)', paddingBlockStart: 'var(--app-rhythm-2)' }}>
            {BUTTONS.map((button) => (
              <ButtonWithTooltip key={button.label} {...button} />
            ))}
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const LongText: Story = {
  name: 'Long text',
  render: () => (
    <Sheet>
      <Group
        title="Long text"
        note="The maximum width is the apparatus measure. A tooltip that needs more than that is already a margin note or a field hint, not a tooltip."
      >
        <div style={{ minBlockSize: 'var(--app-rhythm-4)', position: 'relative' }}>
          <IconButton icon={DotsThreeIcon} label="Mais opcoes" />
          <div
            role="tooltip"
            className="tooltip bs-tooltip-bottom show"
            style={{
              inlineSize: 'max-content',
              insetBlockStart: 'calc(var(--app-size-control) + var(--app-space-2xs))',
              insetInlineStart: 0,
              position: 'absolute',
            }}
          >
            <div className="tooltip-arrow" />
            <div className="tooltip-inner">
              Duplicar cria uma copia desta receita na mesma lista, com o titulo
              e as partes, mas sem as suas notas.
            </div>
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};
