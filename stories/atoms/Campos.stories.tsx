// notebook-layout/stories/atoms/Campos.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PiEye, PiMagnifyingGlass, PiX } from 'react-icons/pi';
import { Icon, IconButton, Select, Textarea } from '@components/atoms';
import { Field } from '@components/field';
import { Group, Row, Sheet } from './specimen';

const meta = {
  title: 'Atomos/Campos',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Clique num campo para ver o foco: o fio de base engrossa e escurece, o texto NAO se mexe, e o anel do navegador contorna a caixa inteira.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Bloco = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'grid', gap: 'var(--app-rhythm-1)' }}>{children}</div>
);

export const LinhaUnica: Story = {
  name: 'Linha unica',
  render: () => (
    <Sheet>
      <Group
        title="Estados"
        note="A tinta do fio cresce do repouso ao foco. O texto pousa perto do fio e a sobra da caixa de 44px fica acima dele — se o texto flutuasse no meio da caixa, input e textarea deixariam de ser a mesma familia."
      >
        <Bloco>
          <Field label="Repouso" placeholder="Bolo de cenoura" />
          <Field label="Com texto" defaultValue="Bolo de cenoura" />
          <Field label="Com ajuda" hint="O nome que voce daria em casa." />
          <Field label="Com erro" error="Escreva um titulo." />
          <Field label="Opcional" optional placeholder="Um subtitulo curto" />
          <Field label="Desabilitado" disabled defaultValue="Bolo de cenoura" />
          <Field
            label="Somente leitura"
            readOnly
            defaultValue="Bolo de cenoura"
          />
        </Bloco>
      </Group>
    </Sheet>
  ),
};

export const Folha: Story = {
  name: 'Folha pautada',
  render: () => (
    <Sheet>
      <Group
        title="Textarea"
        note="A ULTIMA linha da pauta e o fio de base, desenhada mais forte: o rotulo marca o inicio, o fio marca o fim, e a pauta fraca preenche o meio. Nao ha fio duplo porque nao ha duas linhas no mesmo lugar."
      >
        <Bloco>
          <Field
            label="Modo de preparo"
            multiline
            minRows={4}
            placeholder="Um passo por linha, na ordem em que acontecem."
          />
          <Field
            label="Com texto"
            multiline
            minRows={4}
            defaultValue={
              'Bata as claras em neve.\nMisture a farinha.\nLeve ao forno.'
            }
          />
        </Bloco>
      </Group>

      <Group
        title="A manuscrita e de todo campo de texto"
        note="A manuscrita nao e um modificador: ela e a letra de todo campo de texto, e e o que faz o caderno ser o caderno de alguem. O select fica de fora, porque ali se mostra um valor escolhido de uma lista que o produto escreveu — nao uma frase que a pessoa digitou."
      >
        <div>
          <label className="form-label" htmlFor="ms">
            Uma nota sua
          </label>
          <Textarea
            id="ms"
            rows={3}
            defaultValue={
              'A do jeito da vovo leva\numa colher a mais de acucar.'
            }
          />
        </div>
      </Group>

      <Group
        title="Uma linha so"
        note="Uma textarea de uma linha fica identica a um input. E o que faz dos dois uma familia de verdade, em vez de dois componentes parecidos."
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--app-rhythm-1)',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Field label="Input" defaultValue="Bolo de cenoura" />
          <div>
            <label className="form-label" htmlFor="one">
              Textarea
            </label>
            <Textarea id="one" rows={1} defaultValue="Bolo de cenoura" />
          </div>
        </div>
      </Group>
    </Sheet>
  ),
};

export const ComMarcadores: Story = {
  name: 'Com coluna de margem',
  render: () => (
    <Sheet>
      <Group
        title="Folha com marcadores"
        note="Uma marca por linha, na coluna de margem, cada uma com a altura de uma linha do ritmo. A pauta e a coluna batem porque as duas leem a mesma unidade."
      >
        <Field
          label="Ingredientes desta parte"
          multiline
          minRows={4}
          listStyle="disc"
          defaultValue={'2 xicaras de farinha\n1 ovo\n200 g de queijo ralado'}
          hint="Um ingrediente por linha, com a quantidade junto."
        />
      </Group>
    </Sheet>
  ),
};

const SelectEAdornos = () => {
  const [termo, setTermo] = useState('cenoura');
  const [visivel, setVisivel] = useState(false);

  return (
    <Sheet>
      <Group
        title="Select"
        note="A lista de opcoes continua sendo a do sistema: no telefone, o seletor nativo e melhor que qualquer lista recriada, e ele ja e acessivel. O que muda e a caixa fechada, que e a do campo de texto com a seta no fim."
      >
        <Bloco>
          <Field
            label="Unidade"
            options={[
              { value: 'g', label: 'Gramas' },
              { value: 'ml', label: 'Mililitros' },
              { value: 'xic', label: 'Xicaras' },
            ]}
          />
          <Field
            label="Desabilitado"
            disabled
            options={[{ value: 'g', label: 'Gramas' }]}
          />
        </Bloco>
      </Group>

      <Group
        title="Adornos"
        note="So tres existem. A lupa e decorativa — diz que tipo de campo e aquele, mas nao e clicavel, e por isso fica em tinta de apoio. Limpar e mostrar senha sao botoes de verdade, com nome acessivel e tinta cheia."
      >
        <div>
          <label className="form-label" htmlFor="busca">
            Buscar
          </label>
          <div className="field-adorned">
            <Icon icon={PiMagnifyingGlass} className="field-adorned-lead" />
            <input
              id="busca"
              className="form-control"
              type="search"
              value={termo}
              onChange={(event) => setTermo(event.currentTarget.value)}
            />
            {termo && (
              <div className="field-adorned-trail">
                <IconButton
                  icon={PiX}
                  label="Limpar busca"
                  onClick={() => setTermo('')}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="senha">
            Senha
          </label>
          <div className="field-adorned">
            <input
              id="senha"
              className="form-control"
              type={visivel ? 'text' : 'password'}
              defaultValue="segredo"
              autoComplete="current-password"
            />
            <div className="field-adorned-trail">
              <IconButton
                icon={PiEye}
                label="Mostrar senha"
                pressed={visivel}
                onClick={() => setVisivel((v) => !v)}
              />
            </div>
          </div>
        </div>
      </Group>

      <Group
        title="Campo com acao ao lado"
        note="Um campo tem no maximo um adorno no inicio e um botao no fim. Quando a acao e um verbo, ela sai do campo e vira botao na linha."
      >
        <Row label="busca com botao">
          <Select
            aria-label="Onde buscar"
            options={[
              { value: 'minhas', label: 'Minhas receitas' },
              { value: 'todas', label: 'Todas' },
            ]}
          />
        </Row>
      </Group>
    </Sheet>
  );
};

export const SelectEAdornosStory: Story = {
  name: 'Select e adornos',
  render: () => <SelectEAdornos />,
};
