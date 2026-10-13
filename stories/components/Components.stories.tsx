// notebook-layout/stories/components/Components.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { CompassIcon } from '@phosphor-icons/react/dist/ssr/Compass';
import { FolderSimpleIcon } from '@phosphor-icons/react/dist/ssr/FolderSimple';
import { ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';
import { Accordion, AccordionItem } from '@components/accordion';
import { withWeight } from '@components/atoms/icon';
import { Dock } from '@components/dock';
import { Alert } from '@components/alert';
import { IconButton, Tag } from '@components/atoms';
import { Field } from '@components/field';
import { FileButton } from '@components/file-button';
import { MediaTile } from '@components/media-tile';
import { Sidebar } from '@components/sidebar';
import { Group, Row, Sheet } from '../atoms/specimen';
import { photos } from '../molecules/figures';

const meta = {
  title: 'Components/Notices, disclosure and media',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Notice: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Alert"
        note="Status wash and ink, no border and no radius. success announces as status; warning and danger, as alert."
      >
        <Alert status="success">Receita guardada na lista Doces.</Alert>
        <Alert status="warning">Tres ingredientes ainda nao foram reconhecidos.</Alert>
        <Alert status="danger">Nao foi possivel salvar. Tente de novo.</Alert>
      </Group>
    </Sheet>
  ),
};

export const AccordionStory: Story = {
name: 'Accordion',
  render: () => (
    <Sheet>
      <Group
        title="Accordion"
        note="Each item is a native details: it opens and closes without JS state, with the element's own keyboard. One rule per item; the title may be a heading (titleAs)."
      >
        <Accordion>
          <AccordionItem
            title="Ja guardadas nas suas listas"
            titleAs="h3"
            icon={FolderSimpleIcon}
            trailing={<Tag count>4</Tag>}
          >
            <p className="body">Bolo de cenoura, torta de frango, pao caseiro e pudim.</p>
          </AccordionItem>
          <AccordionItem title="Notas da receita">
            <p className="body">Asse em forma untada e enfarinhada.</p>
          </AccordionItem>
        </Accordion>
      </Group>
    </Sheet>
  ),
};

export const MediaTileStory: Story = {
  name: 'Media tile',
  render: () => (
    <Sheet>
      <Group
        title="MediaTile"
        note="Square image, no radius and no border. The word on top only appears while the state is transient; the error comes below, in caption."
      >
        <Row label="ready">
          <div style={{ inlineSize: '7rem' }}>
            <MediaTile
              compact
              media={<img src={photos.cake} alt="Bolo de cenoura" />}
              actions={<IconButton icon={TrashIcon} label="Remover" />}
            />
          </div>
        </Row>
        <Row label="uploading">
          <div style={{ inlineSize: '7rem' }}>
            <MediaTile
              media={<img src={photos.pie} alt="Torta" />}
              status="Enviando..."
            />
          </div>
        </Row>
        <Row label="failed">
          <div style={{ inlineSize: '7rem' }}>
            <MediaTile
              tone="danger"
              placeholder="sopa.jpg"
              status="Falhou"
              error="A imagem passa de 10 MB."
            />
          </div>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const FileButtonStory: Story = {
  name: 'File button',
  render: () => (
    <Sheet>
      <Group
        title="FileButton"
        note="A Button in front of a hidden file input. On a phone, it opens the camera or the gallery."
      >
        <Row label="structural">
          <FileButton icon={UploadSimpleIcon} accept="image/*" onFiles={() => {}}>
            Do aparelho
          </FileButton>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const FieldWithIcon: Story = {
  name: 'Field with icon',
  render: () => (
    <Sheet>
      <Group
        title="Field with icon"
        note="The icon sits at the start of the field, in fg-muted, and the text starts after it."
      >
        <Field
          label="Buscar receitas"
          icon={MagnifyingGlassIcon}
          type="search"
          placeholder="Receitas, ingredientes, ideias..."
        />
      </Group>
    </Sheet>
  ),
};

export const SidebarStory: Story = {
  name: 'Sidebar',
  render: () => (
    <div style={{ blockSize: '24rem', display: 'flex' }}>
      <Sidebar
        aria-label="Navegacao primaria"
        header={<strong className="label">Caderninho</strong>}
        items={[
          { href: '#', label: 'Meu caderninho', icon: ListBulletsIcon, current: true },
          { href: '#', label: 'Explorar mais', icon: CompassIcon, iconMarked: withWeight(CompassIcon, 'fill'), current: false },
        ]}
      />
    </div>
  ),
};

export const DockStory: Story = {
  name: 'Dock',
  render: () => (
    <Sheet>
      <Group
        title="Dock"
        note="The main destinations in a row pinned to the screen edge, on the phone. Page tone and a rule on top; the current one in fg-emphasis with the filled icon, the others in fg-muted, no background and no accent."
      >
        <div style={{ inlineSize: '23rem' }}>
          <Dock
            aria-label="Navegacao primaria"
            items={[
              { href: '#', label: 'Caderninho', icon: ListBulletsIcon, current: true },
              { href: '#', label: 'Explorar', icon: CompassIcon, iconMarked: withWeight(CompassIcon, 'fill'), current: false },
              { href: '#', label: 'Buscar', icon: MagnifyingGlassIcon, current: false },
            ]}
          />
        </div>
      </Group>
    </Sheet>
  ),
};
