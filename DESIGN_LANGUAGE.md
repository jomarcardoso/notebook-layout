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
tabsModel: index
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
| `title-lg` | 1.953 | serif | 1.1 | titulo de pagina |
| `title-md` | 1.563 | serif | 1.25 | "Ingredientes", "Modo de preparo" |
| `title-sm` | 1.25 | serif | 1.25 | titulo de item |
| `subtitle` | 1.25 | serif italico | 1.6 | o headnote |
| `body-lg` | 1.25 | serif | 1.6 | prosa destacada |
| `body` | 1.125 | serif | 1.778 | modo de preparo, prosa |
| `body-sm` | 1 | serif | 1.6 | texto secundario longo |
| `label` | 1 | serif | 1.4 | botao, rotulo de campo, nav |
| `label-sm` | 0.889 | serif | 1.4 | rotulo curto |
| `quantity` | 1.125 | serif tabular | 1.4 | coluna de quantidades |
| `caption` | 0.889 | serif | 1.4 | meta, categoria, credito, rodape |
| `script` | 1.25 | Caveat | 1.4 | so no campo de escrita do caderno |

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

Aba aqui e indice, nao pasta. Rotulos em `label` numa linha, fio inferior
continuo atravessando a linha inteira, ativo com fio accent sob o rotulo mais
`fg-emphasis`. Sem fundo, sem raio, sem borda contornando o rotulo. E a marca de
margem da barra lateral, girada.

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

## 9. Estado

Selecionado e neutro: `bg-selected` mais tinta em `fg-emphasis`. Se precisar de
mais forca, um fio accent na borda inicial — a marca de margem — e so.

Desabilitado e tinta palida, nunca caixa cinza.

Foco engrossa e escurece o fio existente, e o anel de `--app-focus-ring` vem
junto — um mecanismo so para o sistema inteiro. O anel e desvio declarado no
front matter: num campo sem fundo e sem borda, so o fio nao sustenta navegacao
por teclado.

Hover e alfa sobre o que estiver embaixo, nunca valor fixo.

## 10. Componentes

**Campo de texto.** Fio inferior apenas. Sem fundo, sem contorno, sem raio.
Rotulo acima em `fg-muted`. Foco engrossa o fio. Erro troca o fio para danger e
a mensagem vai abaixo em `fg-danger`. Altura de uma linha do ritmo.

**Textarea.** Mesma logica, e aqui vale a pauta: fios horizontais repetidos na
altura da linha. E o momento mais caderno do produto.

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

**Lista de ingredientes.** Sem marcador de lista, quantidade e ingrediente
separados por espaco ou fio pontilhado de conducao, cada item numa linha do
ritmo. No modo caderno ganha caixa de marcar.

**Passos de preparo.** Numeracao em `fg-muted` deslocada para a margem, texto em
`fg-default` respeitando a medida.

**Tabela.** Fios horizontais apenas. Cabecalho em `fg-muted` com fio mais forte
abaixo.

**Acordeao.** Um fio por item, titulo na linha com o indicador ao fim, corpo
revelado respeitando a medida. Sem caixa, sem raio, sem fundo. Dois itens
vizinhos nao produzem fios paralelos: o fio pertence ao item, nao ao grupo.

**Abas.** Fio inferior continuo, ativo com fio accent sob o rotulo. O painel nao
tem superficie nem borda — e a pagina continuando abaixo do fio.

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

O orcamento de accent se conta por tela, nao por componente. Barra de navegacao,
rodape, cabecalho de tabela, progresso e indicador nao sao preenchidos em
accent. Controle marcado — caixa, radio, interruptor — usa `neutral-solid`,
porque marcacao e do leitor.

`radius-overlay` pertence ao que pousa sobre a pagina: modal, popover,
dropdown, toast, offcanvas. Item, lista, acordeao e abas usam zero.

`--app-size-control` e area de toque, nunca tamanho pintado. Caixa de marcar,
radio e interruptor desenham no tamanho do icone e recebem o alvo pela area
clicavel.

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
token de superficie. Raio de folha em elemento que nao e folha. Manuscrita fora
do campo de escrita. Knob de estado identico ao repouso. Regiao de tela com
fundo proprio. Aparato com a largura do conteudo. Folha sobreposta para revelar
o que cabe no lugar. Aba com fundo, raio ou borda. Colecao em multiplas colunas
quando o item tem prosa. Hierarquia de vitrine resolvida por embalagem em vez de
tamanho. Componente chamado card.

## 13. Como este arquivo e usado

O front matter e o contrato que a ferramenta le. A prosa decide a duvida que o
token nao responde. Quando os dois discordam, o front matter esta errado ate que
alguem prove o contrario — e a correcao e nos dois lugares.
