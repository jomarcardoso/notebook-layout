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

# O preenchido e um ESTADO, nao um estilo: `iconStyle` continua outline.
iconSet: phosphor
iconStyle: outline
iconStroke: 1.25px
iconSize: 20px
iconPolicy: words-first
iconFill: marked-state
iconColour: current
iconTrailing: action-only

# Ornamento e figura de conteudo sao familias proprias, e nao icone. As tres
# moram numa coluna so, no inicio da linha.
ornament: lozenge
listMarker: lozenge
markerColumn: 40px
contentFigure: printed-colour
contentFigureSize: 2rem

focus: native
radiusControl: 2px
radiusOverlay: 4px
buttonPressed: translate-1px
buttonDisabledSolid: opacity-0.45
linkVisited: none
linkInProse: ink-text-accent-underline
fieldLine: border-single-line
fieldSheet: background-multiline
textareaGrowth: content
checkMark: phosphor-check-bold-14
radioShape: circle
switchShape: square
chipPainted: 2rem
script: readers-prose-fields
tabsPainted: junta
loadingDelay: 300ms
skeleton: typographic-pulse
progress: rule-filled-with-ink
motionException: waiting

posture: quiet
frame: app-frame
imagery: supporting
imageRatio: 1
disclosure: progressive

# Montagem. A escada de separacao resolve dois elementos vizinhos; estas chaves
# resolvem a tela antes de qualquer componente entrar nela.
pageTypes: [reading, index, showcase, data, composition]
measureScope: prose-only
measureApparatus: 34ch
regionsMax: 3
regionSeparation: gutter-then-rule
apparatusTreatment: margin-note
disclosurePlacement: in-place
overlayPolicy: irreversible-or-context-break
sectionSeparation: space-then-offset-heading
tabsModel: folder-tab
tabsPolicy: exclusive-sets-only
collapseModel: reflow-not-restyle

# Ritmo. A unidade e infraestrutura, a entrelinha se ajusta a ela: uma linha de
# corpo mede exatamente uma unidade. Espaco de fluxo consome a unidade; espaco
# interno de componente tem escala propria.
#
# `rhythmUnit` e a unica medida em rem, porque ela E uma linha. Padding, gap,
# calha, largura de regiao e area de toque ficam em px: nao sao medidas de
# texto, e cresce-las com a fonte espreme o conteudo.
rhythmUnit: 2rem
lengthUnit: px
spacingAxes: [flow, inner]

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

deviations: []

overrides:
  - decision: size-control em 44px
    because: multiplataforma; 40px erra o alvo num telefone apoiado na bancada
  - decision: corpo de leitura em 1.125rem e interface em 1rem
    because: se le de longe, com as maos ocupadas

guardrails:
  - rule: Nunca usar preenchimento em gradiente
    enforcement: stylelint
    signature: linear-gradient|radial-gradient
    # A pauta e a unica excecao, e ela mora num mixin so, `field-sheet`. Ali o
    # gradiente desenha FIO, nao preenchimento: e a diferenca entre uma guia de
    # escrita e uma superficie pintada.
    except: styles/atoms/_field.scss
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
  - rule: Apagar conteudo do usuario exige modal de confirmacao
    enforcement: ledger
  - rule: Nunca remover o outline de foco sem devolver um indicador
    enforcement: stylelint
    signature: outline:\s*(0|none)
  - rule: Tinta cheia e da acao; nenhuma decoracao usa fg-default ou fg-emphasis
    enforcement: document
  - rule: Icone preenchido so no estado marcado pelo leitor
    enforcement: document
  - rule: Titulo leva no maximo uma marca, e nunca icone de sistema
    enforcement: document
  - rule: Onde ha figura de conteudo, as acoes daquela area sao palavra
    enforcement: document
  - rule: Hover so em media (hover - hover)
    enforcement: document
  - rule: Placeholder nunca substitui o rotulo
    enforcement: document
  - rule: Chip de filtro so para escolha multipla; escolha unica e radio ou abas
    enforcement: document
  - rule: Nenhum retorno de espera aparece antes de 300ms, exceto o botao carregando
    enforcement: document
  - rule: Controle nunca vira esqueleto; so o conteudo espera
    enforcement: document
  - rule: Barra de progresso sempre com o valor escrito
    enforcement: document
  - rule: Nenhuma regiao de tela com fundo proprio
    enforcement: document
  - rule: Aparato nunca com a largura do conteudo
    enforcement: document
  - rule: Fio vertical so depois de esgotar a calha
    enforcement: document
  - rule: Nenhum componente chamado card
    enforcement: document
  - rule: Nenhum componente muda de aparencia por largura de tela
    enforcement: document
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
nunca o mesmo componente vestido diferente por atributo de pagina. Nao ha um
"modo caderno" que se liga: ha telas em que os componentes escolhidos — campo,
caixa de marcar, pauta — compoem uma coisa com cara de caderno.

A pauta pertence a TODO campo multilinha: e ela que mostra onde se escreve num
campo sem fundo e sem contorno.

**Manuscrita e o que o LEITOR escreve; impressa e o que o PRODUTO escreve.** A
Caveat e a letra de quem usa o caderno, entao ela e de todo campo de frase —
`text`, `search` e a textarea — e e ela que faz o caderno ser o caderno de
alguem. Tudo o que o produto escreve fica na familia de corpo: rotulo, ajuda,
opcao de select, valor calculado.

A borda da regra e o que o campo GUARDA. Uma frase e do leitor: o titulo da
receita, o modo de preparo, uma nota. Um dado nao e: e-mail, senha, data e
quantidade tem forma definida por fora, e a manuscrita ali atrapalha em vez de
dar voz — numa quantidade ela quebra o papel `numeric`, que e tabular justamente
para os algarismos alinharem numa coluna.

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

### Utilitario, primitivo, componente

Classe tambem tem tres niveis, e o criterio que os separa e um so:

> **Um primitivo e nosso quando carrega uma regra do sistema. E da biblioteca
> quando e so mecanica.**

| nivel | o que e | de quem |
| --- | --- | --- |
| utilitario | uma propriedade, um valor, em qualquer elemento | da biblioteca |
| primitivo | uma *relacao* entre elementos, sem semantica de produto | nosso, prefixo `l-` |
| componente | uma parte nomeada do produto | nosso, nome proprio |

O teste de validade de um primitivo: ele sobrevive a troca de biblioteca sem uma
linha alterada. Isso implica CSS nativo com custom properties, nunca a API de
utilitarios da biblioteca — o que se escreve na gramatica dela morre com ela.

Utilitario que expressa **mecanica** — `d-flex`, `order-*`, `d-md-none`,
`position-*`, `overflow-*`, o grid de 12 colunas — se usa direto, sem embrulhar.
Utilitario que carrega **valor** — cor, raio, sombra, tipografia — nao se usa:
ou resolve num token nosso por configuracao, ou e vazamento.

O grid da biblioteca fica. Nossa parte e apontar a calha dele para o token e
lembrar que grid dentro de prosa divide a medida, nao a janela.

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
| `--app-fg-on-solid` | 1 | tinta invertida sobre qualquer solido: o papel, nunca branco puro |

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

**Fio e borda:** `--app-rule` (a6), `--app-border-default` (a9),
`--app-border-strong` (a10).

A distancia entre o fio e as bordas nao e estetica. A borda identifica um
controle, entao ela responde ao criterio 1.4.11 e precisa de 3:1 contra a
pagina; medidos no navegador, a9 da 3.35:1 e a10 da 3.86:1. O fio divide espaco
e nao identifica nada — pauta, separador de lista, trilho de progresso — entao
ele fica em a6, e subi-lo transformaria a folha pautada numa grade.

**Solido**, preenchimento raro: `--app-bg-accent-solid` (accent 9),
`--app-bg-neutral-solid` (neutral 9), `--app-bg-danger-solid` (danger 9), cada
um com seu `-hover` no degrau 10. A rampa tem dois degraus solidos: o
pressionado repete o hover e se diferencia por outra propriedade.

**Estado**, o territorio nativo de tela: `--app-bg-hover` (a3),
`--app-bg-active` (a4), `--app-bg-selected` (a5), `--app-border-selected`
(accent a8, a marca de margem). O foco nao tem token: ele e o anel do navegador.

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

O peso faz parte do papel: o 500 e dos papeis de INTERFACE, e so deles.

| papel | rem | peso | familia | entrelinha | onde |
| --- | --- | --- | --- | --- | --- |
| `display` | 2.441 | 400 | serif | 1.1 | titulo do documento |
| `title-lg` | 1.953 | 400 | serif | 1.1 | titulo de pagina |
| `title-md` | 1.563 | 400 | serif | 1.25 | titulo de secao |
| `title-sm` | 1.25 | 400 | serif | 1.25 | titulo de item |
| `subtitle` | 1.25 | 400 | serif italico | 1.6 | o headnote |
| `body-lg` | 1.25 | 400 | serif | 1.6 | prosa destacada |
| `body` | 1.125 | 400 | serif | 1.778 | prosa, e o que se digita num campo |
| `body-sm` | 1 | 400 | serif | 1.6 | texto secundario longo, frase de escolha |
| `label` | 1 | **500** | serif | 1.4 | botao, rotulo de campo, aba, nav, chip |
| `label-sm` | 0.889 | **500** | serif | 1.4 | rotulo curto, titulo de aparato |
| `numeric` | 1.125 | 400 | serif tabular | 1.4 | qualquer coluna de numero |
| `caption` | 0.889 | 400 | serif | 1.4 | meta, legenda, tag, credito, rodape |
| `script` | 1.25 | 400 | Caveat | 1.4 | o que o leitor escreve: campo de frase |

`numeric` nao fala do dominio de proposito: ele serve a quantidade de um
ingrediente, a um valor nutricional e a uma celula de tabela, e o design system e
um pacote em que a receita nao mora.

As entrelinhas de prosa nao sao gosto: elas sao o que faz uma linha medir uma
unidade de ritmo. `body` e 1.125rem × 1.778 = 2rem; `body-lg` e 1.25rem × 1.6 =
2rem. Os dois papeis da coluna de conteudo pousam na mesma pauta, com razoes
diferentes porque os corpos sao diferentes.

`body-sm` fica de fora dessa conta de proposito. Ele e nota de margem e texto de
apoio, nao flui com a pagina; a unidade pediria 2.0 de entrelinha num corpo de
1rem, que e frouxo demais para ler. Aparato nao precisa fechar com a pauta do
conteudo.

Cada papel e um valor unico consumido pela propriedade `font`, nunca os
granulares. `font` reseta `letter-spacing` e `font-variant-numeric`, entao
tracking e tabular vao depois dele.

O salto entre `body` (18px) e `title-md` (25px) e grande de proposito. Contraste
de escala e o que separa livro de aplicativo.

## 6. Forma, ritmo e medida

Raio padrao e zero. Dois tokens existem: `--app-radius-control` para controle e
`--app-radius-overlay` para a folha sobreposta.

Espaco tem dois eixos e escalas diferentes, e confundi-los e o que quebra o
ritmo. **Fluxo** — paragrafo, secao, titulo e corpo, item e item — e multiplo da
unidade de ritmo. **Interno** — padding de botao, padding de tag, gap entre
icone e rotulo — se mede pelo proprio elemento e tem escala propria. A regua: se
dois elementos empilhados fazem o olho descer a pagina, e fluxo; se o espaco
esta dentro de uma coisa so, e interno.

A unidade de ritmo e 32px, e uma linha de corpo mede exatamente isso. A ordem da
derivacao importa: a unidade vem primeiro e a entrelinha do corpo se ajusta para
bater com ela. Entrelinha e preferencia; unidade de ritmo e infraestrutura, e o
que todo empilhamento consome.

### px ou rem

**A unidade de ritmo e a unica medida do sistema em `rem`. Todo o resto e px.**

A unidade E uma linha de texto, e quem aumenta a fonte ganha linha maior. Um
ritmo parado em px enquanto o texto cresce desfaz o alinhamento que justifica a
unidade — e desfaz justamente para quem mais precisa dele.

A razao para ali nao se estende para o lado. Padding, gap, calha, largura de
regiao e area de toque nao sao medidas de texto: em `rem` eles cresceriam junto
com a fonte e espremeriam o conteudo, e o layout estoura exatamente quando o
leitor pediu mais espaco para ler. Area de toque tem um motivo proprio: e medida
do dedo, e o dedo nao muda de tamanho com a preferencia de fonte.

A regra de decisao: **se o valor responde a pergunta "qual o tamanho deste
texto?", e `rem`; se responde "quanto espaco esta coisa ocupa na tela", e px.**

Largura de regiao tambem nao e `ch`. `ch` resolve na fonte do elemento onde esta
escrito, e numa faixa de grade quem calcula e o container — a coluna sai com a
largura da fonte errada. A medida continua sendo do texto e e declarada no
elemento que carrega o papel; a faixa da regiao e outra coisa e tem token
proprio.

Todo bloco de texto corrido respeita uma medida: `--app-measure-body` (68ch) no
conteudo, `--app-measure-apparatus` (34ch) no aparato. A medida e do texto, nao
da regiao — grid dentro de prosa divide a medida, nao a janela. O que governa a
largura fora da prosa esta no capitulo de montagem.

## 7. Montagem

A escada de separacao resolve dois elementos vizinhos. A montagem resolve a
tela: como o espaco se divide antes de qualquer componente entrar nele.

**Densidade se compra com medida, escala e tinta, nunca com embalagem.** A tela
cheia se sustenta por largura desigual, ancora tipografica e nivel de tinta.
Quando uma tela pesa, o diagnostico e quase sempre o mesmo: blocos de largura
parecida e peso parecido disputando o olho.

### Os cinco tipos de pagina

Editorial nao quer dizer texto corrido. Um livro tem indice remissivo, apendice
e tabela de equivalencia — paginas densas, sem prosa nenhuma, e nenhuma delas
usa caixa. Cada tipo de pagina herda os mesmos principios e tem seu proprio
mecanismo de densidade.

| tipo | o que governa a largura | separacao dominante |
| --- | --- | --- |
| leitura | a medida | espaco e fio |
| indice | a linha do item | fio entre linhas |
| vitrine | a secao | cabecalho e fio |
| dados | a coluna | fios horizontais |
| composicao | o campo | pauta e fio inferior |

**A medida governa o bloco de texto corrido, nunca a regiao.** Fora da prosa,
quem governa a largura e o item, o campo ou a coluna de dados.

Uma pagina tem um tipo dominante. Uma pagina de leitura pode conter um bloco de
dados; ela continua sendo leitura, e o bloco de dados nao reorganiza a pagina em
volta dele.

### As regioes

Tres regioes por tela e o teto. A margem esta em todas as paginas; conteudo e
aparato se organizam conforme o tipo.

| regiao | o que e | largura | tinta e escala |
| --- | --- | --- | --- |
| margem | navegacao, indice do caderno | fixa, estreita | `fg-muted`, ativo em `fg-emphasis` |
| conteudo | o assunto da pagina | conforme o tipo | `fg-default`, `body` |
| aparato | nutricional, meta, notas, relacionadas | `--app-measure-apparatus` | `fg-muted`, `body-sm` |

Nenhuma regiao tem fundo proprio. As tres sao a mesma pagina. O que as separa e
largura, escala e nivel de tinta — a escada de sempre, aplicada a blocos grandes
em vez de elementos vizinhos.

O aparato e nota de margem, nao segundo conteudo. Desce um degrau na escala e um
na tinta, e e por isso que ele cabe na tela sem competir. Aparato que precisa da
largura e do peso do conteudo nao e aparato: e outra pagina, e a decisao passou
a ser de navegacao.

### A calha

Entre regioes, percorra nesta ordem e pare no primeiro que funcionar:

1. **calha**
2. **calha mais larga**
3. **fio vertical**

Duas regioes que so se separam com fio estao largas demais. O fio vertical tem
um uso legitimo: a margem, que e fio e nao painel.

### Colecao

Colecao de itens com prosa — titulo mais headnote — e lista vertical unica: e o
que um indice de livro e. Item com prosa em duas colunas produz duas medidas
curtas concorrentes, que e o oposto do que a medida existe para evitar.

Colecao de itens sem prosa — miniatura e titulo, nada mais — aceita multiplas
colunas.

### A secao de vitrine

Vitrine e primeira pagina de jornal: secoes empilhadas e, dentro de cada secao,
itens de tamanhos diferentes. Um item principal, com imagem maior e titulo em
`title-md`, e tres ou quatro secundarios em `label` e `caption`. A hierarquia e
de tamanho, jamais de embalagem. Densidade vem do numero de secoes, nao do
numero de caixas.

### A escada de secao

Para marcar o comeco de uma secao dentro da pagina, percorra nesta ordem:

1. **espaco assimetrico** — mais espaco acima do titulo que abaixo; o titulo
   pertence ao que vem depois dele, e o olho tem que ver isso
2. **titulo deslocado para a margem** — o titulo sai da medida e ocupa a calha,
   o corpo continua alinhado
3. **fio acima do titulo**
4. **marca** — ornamento, capitular, numeral desenhado; e o unico ponto onde o
   arquetipo secundario toca a estrutura

Faixa preenchida nao esta na escada. Cabecalho de secao nunca troca superficie.

**Uma secao dentro de outra para um degrau antes.** A secao de dentro desce na
escala e nao repete o fio: dois fios a uma linha de distancia sao sempre dois
fios paralelos, e um dos dois sobra. Dois niveis e o teto — um terceiro nivel
nao tem degrau sobrando e e sinal de que aquilo era outra pagina.

Isto e do NIVEL, nao da largura da tela nem da regiao: a mesma secao aninhada
tem a mesma aparencia em qualquer lugar onde esteja aninhada. Hierarquia por
profundidade e o que um sumario impresso faz; aparencia por contexto e o que
este sistema proibe, e a diferenca entre as duas e que a primeira e uma regra
que da para escrever.

### Revelacao

`disclosure: progressive` decide que nem tudo aparece de uma vez. Onde o
revelado aparece:

1. **no lugar** — acordeao, expansao inline, secao que cresce. E o padrao.
2. **folha sobreposta** — modal, popover, folha lateral. So quando o ato e
   irreversivel, ou quando o que esta atras precisa ser esquecido enquanto se
   decide.
3. **outra pagina** — quando o revelado tem a densidade de um conteudo.

Folha para escolher, filtrar, editar um campo ou ler detalhe e erro de montagem,
nao escolha de componente: os quatro sao revelacao no lugar.

### Aba e indice ancorado

**Aba** quando as secoes sao conjuntos mutuamente exclusivos e ninguem le duas
ao mesmo tempo: configuracao, cadastro, listas do caderno. Atravessar um cadastro
inteiro para alcancar o proximo assunto e hostil.

**Indice ancorado** quando o leitor percorre ou compara. A pagina de receita e
esse caso: nutricional e relacionadas acompanham o preparo, nao competem com
ele.

Aba aqui e a LINGUETA DE UM FICHARIO: puxa e cai na pagina. O que a faz lingueta
nao e a caixa — uma caixa que nao toca a pagina e um chip —, e a JUNTA. Um fio
corre sob a fila inteira e separa o cabecalho da pagina; a aba escolhida APAGA
esse fio no pedaco dela, e o contorno dela passa a ser o contorno da pagina. As
outras ficam fechadas embaixo, folhas atras.

Nao ha preenchimento em lugar nenhum, e nem precisa: a pagina e papel e nada e
mais claro que ela. O que separa a escolhida das outras e mais tinta — contorno
`border-strong`, rotulo em `fg-emphasis` — mais a junta. E o §11 sem inventar
superficie.

Tres degraus de tinta dizem a profundidade, do fundo para a frente: a folha atras
tem o contorno da hairline, o fio da pagina e um degrau acima, e a lingueta
escolhida e o mais escuro dos tres.

A fila e de uma linha so. Uma lingueta que desce para a linha de baixo nao e
lingueta de coisa nenhuma, porque so a ultima fila encosta na pagina — quando nao
couber, a fila rola, e nao quebra.

O custo e de linha, e vale saber qual e: o indice gastava dois fios fixos, e aqui
se gasta um fio sob a fila mais um contorno por aba. Com poucas abas empata, com
muitas piora — e ai a saida e apagar o contorno de REPOUSO, porque a escolhida
continua marcada pela tinta e pela junta.

O painel nao leva borda. Um contorno em volta do conteudo seria uma SEGUNDA
junta, desenhando outra vez o limite que a lingueta ja desenha, e duas linhas
dizendo a mesma coisa e o sinal de que uma sobra.

### Colapso

O estreitamento da tela e remontagem, nunca restyle. As regioes viram sequencia
na ordem margem, conteudo, aparato — o aparato depois daquilo que ele acompanha.

Nenhum componente muda de aparencia por largura de tela. O que muda e quais
componentes entram na tela e como se arranjam. E a mesma regra que separa livro
de caderno.

## 8. Acao

O peso do botao comunica **o custo de desfazer**, nao a importancia da acao.

1. **Compromisso** — preenchido com accent. Um por tela, no maximo. So o ato que
   produz ou destroi algo: salvar, publicar, excluir.
2. **Estruturante** — contorno com BORDA (`border-default`), sem preenchimento.
   Adicionar, cancelar, duplicar. E o botao do dia a dia. Borda e nao fio porque,
   pela definicao do §2, o que contorna um objeto e borda.
3. **Navegacao e edicao leve** — texto com accent, sem borda e sem fundo.
   Editar, ver mais, trocar unidade, filtrar.
4. **Destrutiva secundaria** — texto em danger. Preenchido em danger apenas na
   confirmacao final dentro do modal.

Icone no botao so no estruturante, e so com desenho universal; o compromisso e
sempre um verbo, e ele ja e o unico preenchido da tela.

**PALAVRA PRIMEIRO.** O icone e a lingua da sinalizacao e existe para ser
entendido sem leitura; o livro supoe um leitor e fala com palavras. O icone de
sistema entra em tres casos: quando nao ha espaco para a palavra, quando a acao e
universal (+, lupa, X, tres pontos) ou quando o icone E o proprio controle (a
seta do select, o tique da caixa). Fora deles, a palavra basta.

Quatro regras impedem que os icones se somem a tela que ja tem figuras: onde ha
figura de conteudo, as acoes daquela area sao palavra; acao repetida em cada
linha vira modo ou menu; num grupo, todos tem icone ou nenhum tem; e nenhum
controle leva dois icones decorativos.

**A tinta cheia e da acao.** Nenhuma decoracao usa `fg-default` ou `fg-emphasis`.
E o que faz o olho separar sem esforco o que se toca do que se olha, junto com o
lugar (a linha de acao, nao a coluna de margem) e a resposta ao ponteiro.

**Sublinhado significa exatamente uma coisa: leva a outro lugar.** Sempre
presente em link dentro de texto corrido: ali o texto fica na tinta do corpo e so
o sublinhado leva accent, porque em prosa ninguem distingue cor de enfase de cor
de link, e com o sublinhado presente pintar tambem o texto e redundante. Fora de
prosa, o texto e accent e o sublinhado so aparece no hover — todo link tem accent
em algum lugar, ou no texto ou na linha. No hover o sublinhado engrossa, o mesmo
gesto do fio do campo no foco. Sublinhado fino e deslocado para baixo,
respeitando o descendente. Enfase e italico ou peso, jamais sublinhado. Link
visitado nao tem aparencia propria, e link nunca leva icone.

## 9. Estado

Selecionado e neutro: `bg-selected` mais tinta em `fg-emphasis`. Se precisar de
mais forca, um fio accent na borda inicial — a marca de margem — e so.

Desabilitado e tinta palida, nunca caixa cinza. Nos pesos preenchidos, o
controle inteiro vai a 0.45, para o accent continuar reconhecivel mas apagado.

Carregando NAO e desabilitado. O botao mantem forma, cor e largura; o rotulo
some por opacidade e o spinner aparece na tinta do proprio botao. Ele nao esta
indisponivel, esta trabalhando.

Foco e o do navegador: outline nativo em `:focus-visible`, nunca sobrescrito por
sombra, e o navegador decide quando ele aparece. A caixa focavel e o alvo
inteiro, para que o anel contorne a area de interacao e nao so o desenho. O
campo, alem disso, engrossa e escurece o fio de base.

Pressionado desce 1px, em todos os pesos e em todo controle que se aperta.

Hover so em `@media (hover: hover)`. No telefone o navegador mantem o hover
depois do toque, e o lavado ficaria preso no controle; ali o retorno e o
pressionado.

Hover e alfa sobre o que estiver embaixo, nunca valor fixo.

## 10. Componentes

**Campo de texto.** Fio de base apenas, e ele e BORDA, porque identifica o
controle e precisa de 3:1. Sem fundo, sem contorno, sem raio. Rotulo acima em
`fg-muted`. O texto pousa perto do fio, e a sobra da caixa de 44px fica acima
dele. Placeholder so mostra exemplo, nunca substitui o rotulo. Foco engrossa e
escurece o fio. Erro troca o fio para danger e a mensagem vai abaixo em
`fg-danger`. Somente leitura nao tem fio: e texto impresso.

**Textarea.** O campo de texto com pauta. A ULTIMA linha da pauta e o fio de
base: e ela que identifica o campo e recebe o foco; as outras sao guia, em
`rule`. Ela cresce com o texto e nunca rola por dentro. Uma textarea de uma
linha fica identica a um input.

**Campo manuscrito.** Textarea com tinta `script`. E o unico lugar do sistema
onde a manuscrita aparece.

**Select.** A caixa fechada e a do campo de texto, com a seta no fim. A lista de
opcoes e a do sistema.

**Caixa de marcar, radio e interruptor.** Desenham em 20px, marcados em
`neutral-solid`, e a linha inteira e o alvo. O radio e redondo porque ali a forma
E o significado; o interruptor e quadrado.

**Chip.** Contornado e clicavel: 32px pintados dentro de um alvo de 44px, raio de
controle, tique quando selecionado, X quando removivel. O chip de filtro serve so
para escolha multipla.

**Esqueleto.** A forma tipografica do que vem: barras finas centradas na linha,
em `bg-subtle`, raio zero, pulso lento de opacidade.

**Progresso.** Um fio que se enche de tinta: trilho em `rule`, avanco em
`neutral-solid`, sempre com o valor escrito ao lado.

**Imagem.** Quadrada, recortada, sem raio, sem borda. A foto aparece como e; o
tratamento impresso e so das figuras de conteudo.

**Item de receita.** Sem fundo, sem borda, sem sombra, sem raio. Separado por
espaco; fio entre itens so em lista densa. O item inteiro e a area de clique,
hover em `bg-hover`. O componente nao se chama card: o nome carrega a caixa
junto.

**Barra superior.** Tom da pagina, fio inferior, altura em multiplo de linha.
Sombra so quando ha conteudo rolado por baixo.

**Barra lateral.** Margem, nao painel: fio vertical, itens sem fundo, ativo
marcado por fio accent na borda inicial mais `fg-emphasis`.

**Modal.** `bg-page`, a unica sombra do sistema, raio da folha. Titulo, fio
abaixo do titulo, conteudo, acoes no rodape a direita.

**Tag e marcador.** `bg-subtle`, tinta em `fg-muted`, raio zero, padding minimo.
Estatica: se o lavado fosse clicavel, o componente seria um chip — e por isso o
chip e contornado, para os dois se distinguirem pela aparencia.

**Icone.** Contorno, na tinta do elemento que o contem, num tamanho so.
Preenchido so no estado marcado pelo leitor. Nunca ao lado de titulo, de rotulo
de campo, em tag, em legenda ou como marcador de lista.

**Ornamento.** O losango e a unica forma de ornamento. Antes do titulo de secao,
em accent, na coluna de margem: ou todas as secoes do documento tem, ou nenhuma.
Titulo de pagina e titulo de item nao levam marca.

**Figura de conteudo.** Vinheta de secao e figura de item: uma linha do ritmo,
decorativas, na coluna de margem, em cor impressa. A cor do conteudo nunca
aparece na interface.

**A coluna de margem.** Losango, numero de passo, vinheta, figura de item e caixa
de marcar moram todos na mesma coluna, no inicio da linha, com uma largura so.
Uma marca por linha: nunca marcador junto com figura, nunca losango junto com
vinheta.

**Lista com quantidade.** Sem marcador de lista; quando ha figura, ela ocupa a
coluna de margem no lugar dele. Quantidade em `numeric`, cada item numa linha do
ritmo. Numa lista de marcar, a caixa ocupa a coluna, e o item marcado recua para
`fg-muted` — sem risco sobre o texto, que atrapalha quem ainda confere a lista.

**Lista de passos.** Numeracao em `fg-muted` na coluna de margem, texto em
`fg-default` respeitando a medida.

**Tabela.** Fios horizontais apenas. Cabecalho em `fg-muted` com fio mais forte
abaixo.

**Acordeao.** Um fio por item, titulo na linha com o indicador ao fim, corpo
revelado respeitando a medida. Sem caixa, sem raio, sem fundo. Dois itens
vizinhos nao produzem fios paralelos: o fio pertence ao item, nao ao grupo.

**Abas.** A junta: um fio sob a fila, contorno de tres lados em cada lingueta, e
a escolhida apagando o fio no pedaco dela. Sem preenchimento; a escolhida se
marca com contorno forte e `fg-emphasis`. O painel nao tem superficie nem borda —
e a pagina continuando abaixo da fila.

**Lingueta de caderno.** A tira vertical presa na borda da folha, que e outro
componente e nao uma aba: ela tem forma propria, sai do limite do conteudo e abre
pelo lado que continua nele. Aqui a junta nao cabe — nao ha fio sob a fila para
apagar, porque o que ela encosta e a borda da folha —, entao a escolha se marca
como no chip: lavado de selecionado, contorno mais forte e a tinta de enfase.

**Aparato.** Coluna de nota de margem: `body-sm` e `caption` em `fg-muted`,
medida propria, sem fundo. Titulos internos em `label-sm`. Separado do conteudo
por calha, e por fio so quando a calha nao resolve.

**Secao.** Cabecalho conforme a escada de secao, corpo abaixo. Nunca troca
superficie e nunca leva faixa.

## 11. A camada 3

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

A regra governa o FUNDO de um componente ao longo dos estados dele. Ela nao
governa contorno contra preenchimento, que sao quantidades de tinta diferentes
na mesma cor — e sao a mesma cor por construcao da rampa, onde o passo alfa N
sobre o passo 1 da o passo solido N. A caixa de marcar desmarcada e um contorno
em `border-strong`; marcada, e uma area em `neutral-solid`, um degrau mais
clara. Nao e violacao: o que separa marcado de desmarcado e forma —
preenchimento mais tique —, como no resto do sistema.

O orcamento de accent se conta por tela, nao por componente. Barra de navegacao,
rodape, cabecalho de tabela, progresso e indicador nao sao preenchidos em
accent. Controle marcado — caixa, radio, interruptor — usa `neutral-solid`,
porque marcacao e do leitor.

Nenhum retorno de espera usa accent: esperar e tinta neutra. E nada aparece antes
de 300ms, porque um esqueleto que pisca por 100ms e pior que nenhum — so o botao
carregando responde na hora, porque o leitor acabou de aperta-lo.

`radius-overlay` pertence ao que pousa sobre a pagina: modal, popover,
dropdown, toast, offcanvas, tooltip. Item, lista, acordeao, abas, campo e tag
usam zero.

`--app-size-control` e area de toque, nunca tamanho pintado. Caixa de marcar,
radio e interruptor desenham no tamanho do icone e recebem o alvo pela area
clicavel.

**A caixa focavel E o alvo.** O que e pintado fica dentro dela, transparente em
volta, porque o anel nativo contorna a caixa do elemento e nao um pseudo-elemento
sobreposto: um alvo desenhado por fora poe o anel em volta do desenho, e nao em
volta da area que responde ao toque. Dois alvos vizinhos nao podem se cruzar, e
nenhum sobrevive dentro de um pai com `overflow: hidden`.

## 12. Proibicoes

Nao crie cor. Existem duas rampas mais status. Pedido de cor nova e pedido de
revisao do arquetipo, nao de token.

Nao acesse passo da rampa direto.

Nao crie superficie nova. Existem tres e cada uma tem significado. Se nenhuma
serve, o elemento provavelmente nao precisa de superficie.

Nao crie `-hover` por componente na camada 2. Hover e um token so.

Nao crie segunda cor de marca. Nao crie `info`.

Nao use token de cor para resolver hierarquia: a resposta esta na escada de
separacao, tres degraus antes.

Nao de superficie a uma regiao. Margem, conteudo e aparato sao a mesma pagina.

Nao resolva largura de tela com aparencia. Estreitar remonta, nao repinta.

Nao misture os dois eixos de espaco. Espaco de fluxo consome a unidade de ritmo;
padding e gap interno consomem a escala interna. Um `gap` de fluxo escrito na
escala interna e um ritmo quebrado que ninguem consegue apontar.

### Antipadroes

Zebrado em tabela. Fio vertical em tabela. Card com fundo, sombra e borda ao
mesmo tempo. Faixa preenchida em cabecalho de card. Campo mais escuro que a
pagina. Branco puro em qualquer lugar que nao seja a pagina. Icone colorido para
transmitir estado. Mais de um preenchido por tela. Sombra em elemento que nao e
folha sobreposta. Eyebrow — rotulo curto acima do titulo. Caixa alta em rotulo.
Sublinhado como enfase. Rampa numerada dentro da camada 3. Hover resolvido com
token de superficie. Raio de folha em elemento que nao e folha. Manuscrita em
campo de dado — e-mail, senha, data, quantidade. Knob de estado identico ao repouso. Regiao de tela com
fundo proprio. Aparato com a largura do conteudo. Folha sobreposta para revelar
o que cabe no lugar. Colecao em multiplas colunas
quando o item tem prosa. Hierarquia de vitrine resolvida por embalagem em vez de
tamanho. Componente chamado card. Anel de foco desenhado com sombra. Asterisco
vermelho marcando o campo obrigatorio — o sistema marca o OPCIONAL. Campo verde
a cada acerto. Ponto de notificacao sobreposto ao canto de um icone. Icone so,
sem palavra, para uma acao especifica do produto. Dois tamanhos de icone na mesma
tela. Icone preenchido como decoracao.

## 13. Como este arquivo e usado

O front matter e o contrato que a ferramenta le. A prosa decide a duvida que o
token nao responde. Quando os dois discordam, o front matter esta errado ate que
alguem prove o contrario — e a correcao e nos dois lugares.
