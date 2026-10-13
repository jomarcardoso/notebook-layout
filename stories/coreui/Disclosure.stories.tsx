// notebook-layout/stories/coreui/Disclosure.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState } from 'react';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { Button, Icon, Tag } from '@components/atoms';
import { Group, Sheet } from '../atoms/specimen';

const meta = {
  title: 'CoreUI/Disclosure',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'In-place disclosure with CoreUI\'s classes: the accordion (.accordion) and the collapse (.collapse). Neither opens a sheet over the page.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface AccordionEntryProps {
  title: string;
  body: string;
  count: string;
  open: boolean;
  onToggle: () => void;
}

const AccordionEntry = ({
  title,
  body,
  count,
  open,
  onToggle,
}: AccordionEntryProps) => {
  const id = useId();

  return (
    <div className="accordion-item">
      <h3 className="accordion-header" id={`${id}-header`}>
        <button
          className={`accordion-button${open ? '' : ' collapsed'}`}
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
        >
          {title}
          {count && (
            <>
              &nbsp;<Tag count>{count}</Tag>
            </>
          )}
          <Icon icon={CaretDownIcon} className="accordion-indicator" />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-header`}
        className={`accordion-collapse collapse${open ? ' show' : ''}`}
      >
        <div className="accordion-body">
          <p className="body">{body}</p>
        </div>
      </div>
    </div>
  );
};

const PARTS = [
  {
    title: 'Massa',
    count: '',
    body:
      'Peneire a farinha com o fermento e junte as gemas batidas com o acucar, mexendo devagar ate a massa ficar lisa.',
  },
  {
    title: 'Recheio',
    count: '',
    body:
      'Leve o leite condensado ao fogo baixo com a manteiga e mexa sem parar ate desgrudar do fundo da panela.',
  },
  {
    title: 'Ja guardadas nas suas listas',
    count: '12',
    body:
      'The same item with a count tag before the indicator, like the notebook\'s group of saved recipes.',
  },
];

const AccordionDemo = () => {
  const [open, setOpen] = useState(PARTS[0].title);

  return (
    <Sheet>
      <Group
        title="Accordion"
        note="One rule per item and the rule belongs to the item: two neighbouring items do not make parallel rules. Title in label, Phosphor indicator at the end of the line, no box, no radius and no background when open."
      >
        <div className="accordion" style={{ maxInlineSize: '40rem' }}>
          {PARTS.map((part) => (
            <AccordionEntry
              key={part.title}
              {...part}
              open={open === part.title}
              onToggle={() =>
                setOpen(open === part.title ? '' : part.title)
              }
            />
          ))}
        </div>
      </Group>
    </Sheet>
  );
};

export const AccordionStory: Story = {
  render: () => <AccordionDemo />,
};

const CollapseDemo = () => {
  const [expanded, setExpanded] = useState(false);
  const id = useId();

  return (
    <Sheet>
      <Group
        title="Collapse"
        note="A text button controls a passage that already belongs to the page. The passage opens in place and pushes what comes after; the label says what will happen."
      >
        <div style={{ maxInlineSize: '40rem' }}>
          <p className="body">
            Tres ovos, duas xicaras de farinha, uma xicara de acucar e uma
            colher de fermento.
          </p>
          <Button
            weight="text"
            className="btn-flush"
            aria-expanded={expanded}
            aria-controls={`${id}-collapse`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Esconder os opcionais' : 'Ver os opcionais'}
          </Button>
          <div id={`${id}-collapse`} className={`collapse${expanded ? ' show' : ''}`}>
            <p className="body">
              Raspas de laranja, uma pitada de canela e cem gramas de nozes
              picadas.
            </p>
          </div>
        </div>
      </Group>
    </Sheet>
  );
};

export const Collapse: Story = {
  render: () => <CollapseDemo />,
};
