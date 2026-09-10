<!-- notebook-layout/DESIGN_LANGUAGE.md -->
---
# =============================================================================
# Decisoes legiveis por maquina. Um agente le ISTO; uma pessoa le a prosa
# abaixo. Os dois tem que concordar: um documento cujo YAML contradiz o proprio
# texto e pior do que um sem YAML nenhum.
#
# Este arquivo mora em `notebook-layout` porque o design system E este pacote.
# `www` e um consumidor e nao sera o ultimo.
# =============================================================================

toolVersion: 0.9.0

archetype: editorial-premium

# Governa a alma, nada estrutural: nao mexe no raio, no par tipografico, na
# escada, na densidade nem no orcamento de accent.
archetypeSecondary: playful-expressive
secondaryGoverns:
  - voice
  - illustration
  - warmth
  - marks

density: comfortable
platform: multiplatform
dwell: minutes
protagonist: user-content
colorCriticalWorkspace: false

# Papel nao tem canto arredondado. Arredondar e decisao ativa, limitada a
# controle e a folha sobreposta.
radius: none

# Elevacao nao existe neste sistema. Nada e mais claro que a pagina; o que
# parece estar acima esta apenas com mais tinta.
surfaceModel: inked
elevation: none
elevationCarrier: rule
surfaceSeparation: space-then-rule
surfaces: 3

iconStyle: outline
iconStroke: 1.25px
iconSize: 20px
iconPolicy: icon-leads

posture: quiet
frame: app-frame
imagery: supporting
imageRatio: 1
disclosure: progressive

typeScale: 1.25
bodyFamily: serif
uiFamily: serif
headingWeight: 400
readingSize: 1.125rem
uiSize: 1rem
measure: 68ch

accessibility: AA
colourStrategy: monochrome
statusColours: brand-adapted
accentContrast: high
neutralPigment: 0.6

# A segunda tinta e do autor; o realce e do leitor.
accentBudget: rubrication
selectedFamily: neutral
secondaryAction: outline

voice: action-oriented
ctaMood: imperative

deviations:
  - decision: anel de foco desenhado, nao o outline nativo
    because: acessibilidade de teclado num campo sem fundo e sem borda
    target: outline nativo quando o adapter parar de sobrescrever o foco

overrides:
  - decision: size-control em 44px
    because: multiplataforma; 40px erra o alvo num telefone apoiado na bancada
  - decision: corpo de leitura em 1.125rem e interface em 1rem
    because: se le de longe, com as maos ocupadas

guardrails:
  - rule: Nunca usar preenchimento em gradiente
    enforcement: stylelint
    signature: linear-gradient|radial-gradient
  - rule: Nunca compor rotulo em caixa alta
    enforcement: stylelint
    signature: text-transform:\s*uppercase
  - rule: Nunca tingir um titulo para destaca-lo
    enforcement: document
  - rule: Sombra so na folha sobreposta
    enforcement: document
  - rule: Nenhum literal de cor fora da camada 1
    enforcement: stylelint
    signature: color-no-hex
  - rule: Apagar uma receita salva exige modal de confirmacao
    enforcement: ledger
---

# Design language — Recepta

Um caderno de receitas pessoal. A promessa e o caderno que a sua mae guardava e
entregou quando voce precisou fazer aquilo do jeito dela — agora num telefone
apoiado no pote de mantimento e num laptop na mesa da cozinha. O que o produto
guarda nao e conteudo, e a heranca de alguem, e a interface e o papel em que ela
esta escrita.

## 1. Principios

**A pagina e papel. Todo o resto e tinta.** Nenhuma superficie e mais clara que
a pagina, sem excecao. Elevacao nao existe aqui. O que parece estar "acima" esta
apenas mais escuro, ou seja, tem mais tinta.

**Livro e caderno sao modos distintos.** Leitura e composicao, escrita e pauta.
A distincao e de MONTAGEM: quais componentes entram na tela e como se arranjam,
nunca o mesmo componente vestido diferente por atributo de pagina. A pauta e a
manuscrita pertencem ao campo de escrita da receita, que e um componente
proprio; qualquer outro campo usa a familia de corpo.

**A segunda tinta e do autor, o realce e do leitor.** O accent marca o que
pertence ao documento: acao, link, marca de margem. Estado efemero — hover,
selecionado, foco — usa neutro.

**A receita e a protagonista.** Entre dois layouts, ganha o que da mais tela a
receita, mesmo quando o outro esta melhor organizado.

**O que a impressao ja resolveu nao vira cor.** Hierarquia, enfase, aparte e
agrupamento se resolvem com tipografia, espaco e fio. Cor de token so para o que
e nativo de tela: estado, interacao, feedback.

## 2. A escada de separacao

Antes de separar dois elementos, percorra nesta ordem e pare no primeiro que
funcionar:

1. **espaco**
2. **tipografia**
3. **fio**
4. **superficie entintada**
5. **superficie com fio**
6. **sombra**

Chegar na sombra e quase sempre erro de projeto. A sombra tem um uso legitimo
neste sistema: a folha sobreposta.

### O fio

O fio divide o espaco. A borda contorna um objeto. Sao coisas diferentes e usam
tokens diferentes: `rule` e `border-default`.

Num livro ha muito fio e quase nenhuma borda. Um fio, uma espessura, uma cor.
Nunca dois fios paralelos — e sempre sinal de que um dos dois sobra. Fio nao tem
sombra, nao tem gradiente, nao tem raio. Na duvida sobre como separar,
provavelmente e fio.

## 3. As tres camadas

| Camada | Onde | O que e |
| --- | --- | --- |
| 1 | `styles/_base.scss` | as rampas, custom properties, sem papel |
| 2 | `styles/_semantic.scss` | os papeis, custom properties |
| 3 | `styles/_component.scss` | os knobs, variaveis Sass |

Nenhum passo da rampa e acessado direto por componente ou aplicacao. Todo valor
entra por token semantico. A disciplina de acesso e o que faz "usar poucos
passos" ser consequencia, e nao regra a lembrar.

## 4. Cor — o inventario da camada 2

Duas rampas e so duas, `neutral` (o papel, quente) e `accent`, mais status. Doze
passos cada, mais a rampa alfa correspondente. Os passos ociosos ficam: manter
custa zero e o dia do tema escuro chega.

**Tinta**, a familia mais rica, porque isto e um livro:

| token | passo | serve |
| --- | --- | --- |
| `--app-fg-emphasis` | 12 | titulo, enfase maxima |
| `--app-fg-default` | a12 | corpo |
| `--app-fg-muted` | a11 | apoio, metadado, legenda |
| `--app-fg-subtle` | a10 | terciario, placeholder, folio |
| `--app-fg-disabled` | a9 | tinta apagada |
| `--app-fg-accent` | accent a11 | a segunda tinta em texto |
| `--app-fg-on-solid` | contrast | tinta invertida sobre qualquer solido |

**Papel**, deliberadamente pequena. Superficie entintada significa *material de
outra natureza*, nunca altura:

| token | passo | serve |
| --- | --- | --- |
| `--app-bg-page` | 1 | a pagina, o valor mais claro do sistema |
| `--app-bg-subtle` | a2 | o lavado fraco: tag, transcricao, esqueleto |
| `--app-bg-muted` | a3 | o lavado forte: boxe, aparte |
| `--app-bg-backdrop` | a11 | o veu atras da folha, nunca preto puro |

Papel e tinta usam o mesmo eixo de proeminencia: `muted` e mais entintado que
`subtle` nas duas familias. A folha sobreposta nao tem token proprio — e o
mesmo papel da pagina, distinguida por sombra e fio.

**Fio e borda:** `--app-rule` (a6), `--app-border-default` (a7),
`--app-border-strong` (a8).

**Solido**, preenchimento raro: `--app-bg-accent-solid` (accent 9),
`--app-bg-neutral-solid` (neutral 9), `--app-bg-danger-solid` (danger 9), cada
um com seu `-hover` no degrau 10. A rampa tem dois degraus solidos: o
pressionado repete o hover e se diferencia por outra propriedade.

**Estado**, o territorio nativo de tela: `--app-bg-hover` (a3),
`--app-bg-active` (a4), `--app-bg-selected` (a5), `--app-border-selected`
(accent a8, a marca de margem), `--app-focus-ring` (accent a8).

**Status:** `--app-fg-danger`, `--app-bg-danger-subtle`, `--app-border-danger`,
`--app-fg-success`, `--app-bg-success-subtle`, `--app-fg-warning`,
`--app-bg-warning-subtle`. Danger e o unico com solido, para a confirmacao
destrutiva. `info` nao existe: colapsa em accent.

**Sombra:** `--app-shadow-overlay`, e so.

Superficie e estado compartilham niveis de tinta por construcao — `panel` e
`hover` sao ambos a3 — e isso e o que o alfa compra: um hover sobre um painel
compoe, escurece, e nao precisa de token novo por contexto.

## 5. Tipografia

Young Serif nos titulos, Lora no corpo e na interface. Nenhum titulo leva peso:
hierarquia e tamanho, familia e espaco. O sistema usa dois pesos, 400 e 500, o
500 so em interface. Peso maior fica para `<strong>` dentro do corpo.

Escala: `0.79 · 0.889 · 1 · 1.125 · 1.25 · 1.563 · 1.953 · 2.441` rem.

| papel | rem | familia | entrelinha | onde |
| --- | --- | --- | --- | --- |
| `display` | 2.441 | serif | 1.1 | titulo da receita |
| `title-lg` | 1.953 | serif | 1.15 | titulo de pagina |
| `title-md` | 1.563 | serif | 1.25 | "Ingredientes", "Modo de preparo" |
| `title-sm` | 1.25 | serif | 1.3 | titulo de card |
| `subtitle` | 1.25 | serif italico | 1.6 | o headnote |
| `body-lg` | 1.25 | serif | 1.7 | prosa destacada |
| `body` | 1.125 | serif | 1.7 | modo de preparo, prosa |
| `body-sm` | 1 | serif | 1.6 | texto secundario longo |
| `label` | 1 | serif | 1.4 | botao, rotulo de campo, nav |
| `label-sm` | 0.889 | serif | 1.4 | rotulo curto |
| `quantity` | 1.125 | serif tabular | 1.4 | coluna de quantidades |
| `caption` | 0.889 | serif | 1.4 | meta, categoria, credito, rodape |
| `script` | 1.25 | Caveat | 1.4 | so no campo de escrita do caderno |

Cada papel e um valor unico consumido pela propriedade `font`, nunca os
granulares. `font` reseta `letter-spacing` e `font-variant-numeric`, entao
tracking e tabular vao depois dele.

O salto entre `body` (18px) e `title-md` (25px) e grande de proposito. Contraste
de escala e o que separa livro de aplicativo.

## 6. Forma, ritmo e medida

Raio padrao e zero. Dois tokens existem: `--app-radius-control` para controle e
`--app-radius-overlay` para a folha sobreposta.

Espacamento vertical de fluxo — paragrafo, secao, titulo e corpo, item e item —
e multiplo da linha. Espacamento interno de componente nao e: padding de botao,
padding de tag e gap entre icone e rotulo se medem pelo proprio elemento. A
regua: se dois elementos empilhados fazem o olho descer a pagina, e fluxo; se o
espaco esta dentro de uma coisa so, e interno.

Todo bloco de texto corrido respeita a medida (`--app-measure-body`, 68ch). Grid
divide a medida, nao a janela. Numa listagem, lista vertical unica e o que um
indice de livro e.

## 7. Acao

O peso do botao comunica **o custo de desfazer**, nao a importancia da acao.

1. **Compromisso** — preenchido com accent. Um por tela, no maximo. So o ato que
   produz ou destroi algo: salvar, publicar, excluir.
2. **Estruturante** — contorno com fio, sem preenchimento. Adicionar
   ingrediente, cancelar, duplicar. E o botao do dia a dia.
3. **Navegacao e edicao leve** — texto com accent, sem borda e sem fundo.
   Editar, ver mais, trocar unidade, filtrar.
4. **Destrutiva secundaria** — texto em danger. Preenchido em danger apenas na
   confirmacao final dentro do modal.

**Sublinhado significa exatamente uma coisa: leva a outro lugar.** Sempre
presente em link dentro de texto corrido, porque em prosa ninguem distingue cor
de enfase de cor de link. Fora de prosa, so no hover. Sublinhado fino e
deslocado para baixo, respeitando o descendente. Enfase e italico ou peso,
jamais sublinhado.

## 8. Estado

Selecionado e neutro: `bg-selected` mais tinta em `fg-emphasis`. Se precisar de
mais forca, um fio accent na borda inicial — a marca de margem — e so.

Desabilitado e tinta palida, nunca caixa cinza.

Foco engrossa e escurece o fio existente, e o anel de `--app-focus-ring` vem
junto — um mecanismo so para o sistema inteiro. O anel e desvio declarado no
front matter: num campo sem fundo e sem borda, so o fio nao sustenta navegacao
por teclado.

Hover e alfa sobre o que estiver embaixo, nunca valor fixo.

## 9. Componentes

**Campo de texto.** Fio inferior apenas. Sem fundo, sem contorno, sem raio.
Rotulo acima em `fg-muted`. Foco engrossa o fio. Erro troca o fio para danger e
a mensagem vai abaixo em `fg-danger`. Altura de uma linha do ritmo.

**Textarea.** Mesma logica, e aqui vale a pauta: fios horizontais repetidos na
altura da linha. E o momento mais caderno do produto.

**Card de receita.** Sem fundo, sem borda, sem sombra, sem raio. Separado por
espaco; fio entre itens so em lista densa. O card inteiro e a area de clique,
hover em `bg-hover`.

**Barra superior.** Tom da pagina, fio inferior, altura em multiplo de linha.
Sombra so quando ha conteudo rolado por baixo.

**Barra lateral.** Margem, nao painel: fio vertical, itens sem fundo, ativo
marcado por fio accent na borda inicial mais `fg-emphasis`.

**Modal.** `bg-page`, a unica sombra do sistema, raio da folha. Titulo, fio
abaixo do titulo, conteudo, acoes no rodape a direita.

**Tag e marcador.** `bg-subtle`, tinta em `fg-muted`, raio zero, padding minimo.

**Lista de ingredientes.** Sem marcador de lista, quantidade e ingrediente
separados por espaco ou fio pontilhado de conducao, cada item numa linha do
ritmo. No modo caderno ganha caixa de marcar.

**Passos de preparo.** Numeracao em `fg-muted` deslocada para a margem, texto em
`fg-default` respeitando a medida.

**Tabela.** Fios horizontais apenas. Cabecalho em `fg-muted` com fio mais forte
abaixo.

## 10. A camada 3

Um knob so existe quando diverge, ou quando e a costura com um vocabulario que
nao e seu — `--cui-modal-bg` e de outra biblioteca, e o knob e o unico ponto
onde os dois nomes se encontram. `$x: var(--app-y)` sem consumidor nenhum nao e
contrato, e inventario morto.

Estado nunca usa token de superficie. `hover` e `--app-bg-hover`, nunca
`--app-bg-muted`, mesmo quando os dois resolvem no mesmo passo: coincidencia de
valor nao e parentesco.

Repouso, hover, active e selected sao monotonicamente mais entintados, nessa
ordem. Estado mais claro que o anterior esta errado, e knob de estado com valor
igual ao repouso e bug, nao decisao.

O orcamento de accent se conta por tela, nao por componente. Barra de navegacao,
rodape, cabecalho de tabela, progresso e indicador nao sao preenchidos em
accent. Controle marcado — caixa, radio, interruptor — usa `neutral-solid`,
porque marcacao e do leitor.

`radius-overlay` pertence ao que pousa sobre a pagina: modal, popover,
dropdown, toast, offcanvas. Card, lista, acordeao e abas usam zero.

`--app-size-control` e area de toque, nunca tamanho pintado. Caixa de marcar,
radio e interruptor desenham no tamanho do icone e recebem o alvo pela area
clicavel.

## 11. Proibicoes

Nao crie cor. Existem duas rampas mais status. Pedido de cor nova e pedido de
revisao do arquetipo, nao de token.

Nao acesse passo da rampa direto.

Nao crie superficie nova. Existem tres e cada uma tem significado. Se nenhuma
serve, o elemento provavelmente nao precisa de superficie.

Nao crie `-hover` por componente na camada 2. Hover e um token so.

Nao crie segunda cor de marca. Nao crie `info`.

Nao use token de cor para resolver hierarquia: a resposta esta na escada de
separacao, tres degraus antes.

### Antipadroes

Zebrado em tabela. Fio vertical em tabela. Card com fundo, sombra e borda ao
mesmo tempo. Faixa preenchida em cabecalho de card. Campo mais escuro que a
pagina. Branco puro em qualquer lugar que nao seja a pagina. Icone colorido para
transmitir estado. Mais de um preenchido por tela. Sombra em elemento que nao e
folha sobreposta. Eyebrow — rotulo curto acima do titulo. Caixa alta em rotulo.
Sublinhado como enfase. Rampa numerada dentro da camada 3. Hover resolvido com
token de superficie. Raio de folha em elemento que nao e folha. Manuscrita fora
do campo de escrita. Knob de estado identico ao repouso.

## 12. Como este arquivo e usado

O front matter e o contrato que a ferramenta le. A prosa decide a duvida que o
token nao responde. Quando os dois discordam, o front matter esta errado ate que
alguem prove o contrario — e a correcao e nos dois lugares.
