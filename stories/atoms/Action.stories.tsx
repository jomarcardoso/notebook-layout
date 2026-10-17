// notebook-layout/stories/atoms/Action.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BookmarkSimpleIcon } from '@phosphor-icons/react/dist/ssr/BookmarkSimple';
import { DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { withWeight } from '@components/atoms';
import { Button, IconButton } from '@components/atoms';
import { Group, Row, Sheet } from './specimen';

const BookmarkSimpleFillIcon = withWeight(BookmarkSimpleIcon, 'fill');

const meta = {
  title: 'Atoms/Action',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The five button weights, the icon-only button and the link. Hover only exists on devices with real hover, so move the pointer over to see it; on touch, the feedback is the pressed state, which moves down 1px in every weight.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonWeights: Story = {
  name: 'Button',
  render: () => (
    <Sheet>
      <Group
        title="The five weights"
        note="The weight communicates the cost of undoing. Commitment never carries an icon: the verb is enough, and it is already the only filled one on the screen."
      >
        <Row label="commitment">
          <Button weight="commitment">Guardar receita</Button>
        </Row>
        <Row label="structural">
          <Button weight="structural">Cancelar</Button>
          <Button weight="structural" icon={PlusIcon}>
            Adicionar parte
          </Button>
        </Row>
        <Row label="text">
          <Button weight="text">Editar</Button>
        </Row>
        <Row label="destructive">
          <Button weight="destructive">Excluir</Button>
        </Row>
        <Row label="destructive-confirm">
          <Button weight="destructive-confirm">Excluir mesmo assim</Button>
        </Row>
      </Group>

      <Group
        title="Disabled"
        note="The shape does not change. On filled ones the whole button goes to 0.45, so the accent stays recognisable but faded; on the others, the ink goes to fg-disabled. No button becomes a grey box."
      >
        <Row label="commitment">
          <Button weight="commitment" disabled>
            Guardar receita
          </Button>
        </Row>
        <Row label="structural">
          <Button weight="structural" disabled>
            Cancelar
          </Button>
        </Row>
        <Row label="text">
          <Button weight="text" disabled>
            Editar
          </Button>
        </Row>
        <Row label="destructive-confirm">
          <Button weight="destructive-confirm" disabled>
            Excluir mesmo assim
          </Button>
        </Row>
      </Group>

      <Group
        title="Loading"
        note="Loading is not disabled: the button is not unavailable, it is working. It keeps shape, colour and WIDTH — the label fades out by opacity and stays in place, so the accessible name stays too. Further clicks are ignored."
      >
        <Row label="in progress">
          <Button weight="commitment" loading>
            Guardar receita
          </Button>
          <Button weight="structural" loading>
            Adicionar parte
          </Button>
        </Row>
      </Group>

      <Group
        title="Side by side"
        note="The commitment one is always last in the row."
      >
        <Row label="dialog footer">
          <Button weight="structural">Cancelar</Button>
          <Button weight="commitment">Guardar</Button>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const IconOnlyButton: Story = {
  name: 'Icon-only button',
  render: () => (
    <Sheet>
      <Group
        title="Icon-only button"
        note="The only place where the icon appears without a word, so it only exists with a universal drawing and a mandatory accessible name. The ink is full, not accent: a bar with four accent icons would spend the whole screen's budget."
      >
        <Row label="resting">
          <IconButton icon={DotsThreeIcon} label="Mais opcoes" />
          <IconButton icon={XIcon} label="Fechar" />
          <IconButton icon={PlusIcon} label="Adicionar" />
        </Row>
        <Row label="toggle, off">
          <IconButton
            icon={BookmarkSimpleIcon}
            iconMarked={BookmarkSimpleFillIcon}
            label="Salvar"
            pressed={false}
          />
        </Row>
        <Row label="toggle, on">
          <IconButton
            icon={BookmarkSimpleIcon}
            iconMarked={BookmarkSimpleFillIcon}
            label="Salvar"
            pressed
          />
        </Row>
        <Row label="disabled">
          <IconButton icon={DotsThreeIcon} label="Mais opcoes" disabled />
        </Row>
      </Group>
      <p className="caption">
        On, the icon FILLS and the ink rises to emphasis. It gets no selected
        background, because the fill is already the mark — and so the state is
        visible by shape, not only by colour.
      </p>
    </Sheet>
  ),
};

export const Link: Story = {
  render: () => (
    <Sheet>
      <Group
        title="In prose"
        note="The text stays in body ink and only the underline carries accent. In running text nobody tells a link's colour from an emphasis colour, so the underline must always be present — and with it present, painting the text too is redundant."
      >
        <p className="body">
          Bata as claras em neve antes de misturar, como está escrito na{' '}
          <a href="#nowhere">receita original da sua avó</a>, e reserve. O
          sublinhado engrossa no hover: é o mesmo gesto do fio do campo no foco,
          a linha que já existe ganhando tinta.
        </p>
      </Group>

      <Group
        title="Outside prose"
        note="The text is accent and the underline only appears on hover. Every link has accent somewhere: in prose it is the line, outside it is the text."
      >
        <Row label="metadata">
          <a className="link" href="#nowhere">Ver todas as receitas</a>
        </Row>
      </Group>

      <Group
        title="Discreet"
        note="link -discreet keeps the text in the ink around it and only the hover draws the accent underline: for a list of links that is already read as navigation, such as the lists in the apparatus."
      >
        <Row label="navigation">
          <a className="link -discreet" href="#nowhere">
            Bolos de domingo
          </a>
        </Row>
      </Group>

      <p className="caption">
        A visited link has no look of its own — this is a notebook, not a
        research document. And a link never carries an icon: the sign of
        &ldquo;leads somewhere else&rdquo; is already the underline.
      </p>
    </Sheet>
  ),
};
