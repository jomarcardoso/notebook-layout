// notebook-layout/stories/components/Componentes.stories.tsx
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
  title: 'Componentes/Avisos, revelacao e midia',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Aviso: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Alert"
        note="Lavado e tinta de status, sem borda e sem raio. success anuncia como status; warning e danger, como alert."
      >
        <Alert status="success">Receita guardada na lista Doces.</Alert>
        <Alert status="warning">Tres ingredientes ainda nao foram reconhecidos.</Alert>
        <Alert status="danger">Nao foi possivel salvar. Tente de novo.</Alert>
      </Group>
    </Sheet>
  ),
};

export const Acordeao: Story = {
  render: () => (
    <Sheet>
      <Group
        title="Accordion"
        note="Cada item e um details nativo: abre e fecha sem estado em JS, com teclado do proprio elemento. Um fio por item; o titulo pode ser heading (titleAs)."
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

export const LadrilhoDeMidia: Story = {
  name: 'Ladrilho de midia',
  render: () => (
    <Sheet>
      <Group
        title="MediaTile"
        note="Imagem quadrada, sem raio e sem borda. A palavra por cima aparece so enquanto o estado e passageiro; o erro vem embaixo, em caption."
      >
        <Row label="pronta">
          <div style={{ inlineSize: '7rem' }}>
            <MediaTile
              compact
              media={<img src={photos.bolo} alt="Bolo de cenoura" />}
              actions={<IconButton icon={TrashIcon} label="Remover" />}
            />
          </div>
        </Row>
        <Row label="enviando">
          <div style={{ inlineSize: '7rem' }}>
            <MediaTile
              media={<img src={photos.torta} alt="Torta" />}
              status="Enviando..."
            />
          </div>
        </Row>
        <Row label="falhou">
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

export const BotaoDeArquivo: Story = {
  name: 'Botao de arquivo',
  render: () => (
    <Sheet>
      <Group
        title="FileButton"
        note="Um Button na frente de um input de arquivo escondido. No telefone, abre a camera ou a galeria."
      >
        <Row label="estruturante">
          <FileButton icon={UploadSimpleIcon} accept="image/*" onFiles={() => {}}>
            Do aparelho
          </FileButton>
        </Row>
      </Group>
    </Sheet>
  ),
};

export const CampoComIcone: Story = {
  name: 'Campo com icone',
  render: () => (
    <Sheet>
      <Group
        title="Field com icon"
        note="O icone fica no inicio do campo, em fg-muted, e o texto comeca depois dele."
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

export const BarraLateral: Story = {
  name: 'Barra lateral',
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

export const Doca: Story = {
  name: 'Dock',
  render: () => (
    <Sheet>
      <Group
        title="Dock"
        note="Os destinos principais numa fileira presa a borda da tela, no telefone. Tom da pagina e fio em cima; o atual em fg-emphasis com o icone preenchido, os outros em fg-muted, sem fundo e sem accent."
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
