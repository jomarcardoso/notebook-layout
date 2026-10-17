<!-- notebook-layout/docs/coreui.md -->

# CoreUI no design system

Este documento e o inventario do CoreUI dentro do `notebook-layout`: o que entra, onde cada decisao mora, o que fica de fora e por que. A regra geral de camadas esta em `AGENTS.md` (secao CSS) e a linguagem visual em `DESIGN_LANGUAGE.md`; aqui fica so o que e especifico da biblioteca.

A versao instalada e `@coreui/coreui` 5.9, com `@coreui/react` 5.13. O estilo vem sempre do CoreUI, pelo entry. A marcacao vem do componente React do CoreUI so quando ele ajuda mais do que atrapalha.

**Usa o componente React** quando ele carrega comportamento: estado de aberto e fechado, foco preso, posicionamento, teclado, transicao ou portal. Dobra, acordeao, menu suspenso, dica, folha lateral, aviso com fechar e barra lateral entram aqui. Esses componentes ja sao cliente pela natureza deles, e o `'use client'` nao custa nada a mais.

**Escreve a marcacao** quando o componente React so embrulha HTML com classes, como badge, spinner, barra de progresso, rotulo, texto de apoio, botao, aviso fixo, abas e trilha. Aqui o embrulho nao economiza codigo e traz custo: `@coreui/react` cria contextos ao ser carregado, entao o arquivo vira cliente e nao pode receber funcao de um Server Component. Alguns desses embrulhos tambem fixam o que este sistema precisa decidir: `CBreadcrumb` poe `aria-label="breadcrumb"` em ingles, `CNav` poe `role="navigation"` na lista, `CNavLink` marca o ativo com `aria-current="page"`, `CProgress` manda o `aria-label` para a barra interna e `CFormCheck` remonta o input a cada render.

Hoje so o `Sidebar` usa `@coreui/react`, sobre o `CSidebar`: estado recolhido, troca entre trilho e gaveta e veu no telefone nao tem equivalente nativo. O `www` nao importa `@coreui/react` e aliasa o pacote para a propria copia, para que app e biblioteca usem a mesma instancia.

**Nao troca nativo por JS.** Quando a plataforma ja resolve com um elemento semantico (`<dialog>`, `<details>`, `radio`, `scroll-snap`, `popover`), o componente usa o elemento e o CoreUI entra so com o estilo. Um componente React do CoreUI que refaz em JS o que o elemento ja faz e regressao, mesmo carregando comportamento. A integracao do produto, como o historico que fecha o dialogo, e escrita por cima do elemento nativo.

Por isso estes componentes tem comportamento e mesmo assim sao escritos aqui:

| componente | em vez de | por que |
| --- | --- | --- |
| `Dialog`, `ConfirmDialog` | `CModal` | o `<dialog>` nativo com `showModal()` da camada superior, fundo inerte inclusive para leitor de tela, foco preso e devolvido, Escape e `::backdrop`; `show()` abre sem bloquear o fundo. O componente soma a entrada no historico, para o voltar do telefone fechar o dialogo. O `CModal` e um `div` com `role="dialog"` num portal, prende o foco por listener de teclado no `document`, trava a rolagem escrevendo no `style` do `body` e nao torna o fundo inerte |
| `Toast`, `useToast` | `CToaster` | o aviso sai de qualquer lugar por um hook, e as regioes `status` e `alert` ficam montadas desde o inicio, que e o que faz o leitor de tela anunciar |
| `Carousel` | `CCarousel` | prateleira rolada com o dedo, por `scroll-snap`; o `CCarousel` troca slides por transicao em JS |
| `Tabs` | `CTabs` | cada aba e um `radio`, e o teclado entre elas e o do proprio grupo de radios |
| `AccordionItem` | `CAccordion` | `<details>` e `<summary>` abrem e fecham sem estado em JS |
| `ExpandableText` | — | corte em quatro linhas medido de novo quando a largura muda; o CoreUI nao tem equivalente |

## Onde cada decisao mora

| arquivo | o que guarda | exemplo |
| --- | --- | --- |
| `styles/coreui-entry.scss` | variaveis Sass que a biblioteca aceita e os parciais importados | `$input-bg: transparent` |
| `styles/_coreui-utilities.scss` | o mapa `$utilities`: familias desligadas (`null`) e os utilitarios de ritmo e de texto do sistema | `mt-rhythm-1`, `mb-text` |
| `styles/_coreui.scss` | a traducao entre os nomes `--cui-*` e os papeis da camada 2 | `--cui-callout-border-left-color` e `rule-strong` |
| `styles/_component.scss` | knobs de camada 3 que o adapter e os componentes proprios leem | `$accordion-rule-color` |
| `styles/atoms/*` | regra do sistema que nenhuma variavel expressa | o fio de base do campo, o pressionado de 1px |
| `styles/_metrics.scss` | camada 1 em valor Sass: as medidas que os tokens e o entry leem em tempo de compilacao | `$gutter`, `space('md')` |
| `styles/_srgb.scss` | camada 1 de cor em valor Sass: as rampas solidas, que `_base.scss` emite e o adapter le para os triplets `--cui-*-rgb` | `step(accent, 9)` |

Tres consequencias praticas:

- Uma variavel Sass do CoreUI que ainda nao tem consumidor fica no entry mesmo assim. Ela nao gera CSS por si so, serve ao dia em que o componente entrar e a outros projetos que usem esta fundacao. O mesmo vale para os knobs de `styles/_component.scss`: eles centralizam a customizacao de cada componente e sao a base de componentes e projetos novos, e um knob sem leitor neste projeto continua la. Variavel e knob mantidos assim levam um comentario dizendo por que ficam.
- O adapter emite na layer `vendor-config`, depois de `vendor`. Uma regra dele num seletor de componente vence qualquer variante da biblioteca, com qualquer especificidade. Por isso um padrao que a variante precisa trocar vai no `:root` do adapter, herdado, e nao no seletor do componente.
- `$enable-rounded` e `$enable-shadows` estao desligados. As variaveis de raio e sombra de um componente viram custom property, mas os mixins `border-radius()` e `box-shadow()` nao emitem a propriedade. Raio de controle e sombra de folha chegam por atom.

Uma variavel Sass que entra em conta dentro do proprio CoreUI (`$alert-padding-x * 3`, `$grid-gutter-width * .5`) nao aceita `var()`. Ela le o valor de `styles/_metrics.scss`, o mesmo arquivo de onde `_base.scss` e `_semantic.scss` emitem os tokens, e nenhum valor de medida e escrito duas vezes.

A regra para escolher entre os dois: `metrics.*` quando o CoreUI faz conta Sass com a variavel em qualquer parcial, importado ou nao (`$border-width`, `$grid-gutter-width`, `$alert-padding-*`, `$btn-padding-x`, `$nav-link-padding-*`, os `$spacers`), ou quando o valor e de camada 1, que o entry nao le em runtime (`$headings-line-height`). Em todo o resto, `var(--app-*)`, que acompanha o token em runtime.

## Importados

| parcial | configurado em | quem usa | Storybook |
| --- | --- | --- | --- |
| `root`, `containers`, `grid`, `utilities/api` | entry (`$spacers`, `$grid-gutter-width`, `$enable-cssgrid`) e `_coreui-utilities.scss` (`$utilities`) | `www` (`row`, `col-*`, `.grid`, `container`, utilitarios de mecanica) | CoreUI/Grid, CoreUI/Mechanics |
| `helpers/clearfix`, `position`, `ratio`, `text-truncation`, `visually-hidden` | entry, um a um | `www` (`visually-hidden`, `ratio`) | CoreUI/Mechanics |
| `breadcrumb` | entry (`$breadcrumb-margin-bottom`, `$breadcrumb-item-padding-x`), atom `_breadcrumb.scss` (tinta, papel, link e modo compacto por container query) | `Breadcrumbs` | CoreUI/Navigation |
| `nav` | entry (`$nav-*`, `$nav-tabs-*`) | `Tabs` | Navigation/Tabs |
| `buttons` | entry (`$btn-*`), atom `_button.scss` | `Button`, `IconButton` | Atoms/Action |
| `accordion` | knobs `$accordion-*` de `_component.scss`, lidos pelo entry, pelo adapter e pelo atom `_accordion.scss` (o aberto pelo `[open]` do `details`) | `Accordion` e `AccordionItem`, usados pelo `FiledRecipes` do `www` | CoreUI/Disclosure |
| `transitions` | entry (`$transition-*`) | `.collapse` do acordeao | CoreUI/Disclosure |
| `images` | — | `.app-image` e atom proprio | Molecules/Index and grid |
| `sidebar` | entry (`$sidebar-toggler-*`), adapter, atom `_sidebar.scss` | `Sidebar` sobre `CSidebar` | CoreUI/Navigation |
| `badge` | entry, atom `_tag.scss` | `Tag` | Atoms/Reading marks |
| `forms/*` (labels, form-text, form-control, form-select, form-check, validation) | entry (`$input-*`, `$form-*`), atoms `_field`, `_label`, `_field-message`, `_reader-marks` | `Select`, `Textarea`, `Field`, `LineListCheck` | Atoms/Fields, Atoms/Reader marks, Molecules/Complete field |
| `spinners`, `progress` | entry (`$spinner-*`, `$progress-*`), atom `_progress.scss` (cor herdada do spinner, linha de rotulo da barra) | `Waiting`, `Progress`, `ProgressIndicator`, `Button` carregando | Atoms/Feedback |
| `dropdown` | entry (`$dropdown-*`), adapter | — | CoreUI/Navigation |
| `pagination` | entry (`$pagination-*`), adapter | — | CoreUI/Navigation |
| `callout` | entry (`$callout-*`), adapter | — | CoreUI/Notices |
| `alert` | entry (`$alert-*`), cores pelo adapter | `www` `.alert` na revisao de alimento do admin | CoreUI/Notices |
| `offcanvas` | entry (`$offcanvas-*`) | — | CoreUI/Side sheet |
| `tables` | knobs `$table-*` de `_component.scss`, lidos pelo entry (`$table-*`) e pelo atom `_table.scss` (fonte da celula, cabecalho, legenda e grupo de linhas, que o CoreUI nao configura), e `resets.scss` | `www` `AminoAcidsTable` e a revisao de alimento do admin | CoreUI/Table |
| `tooltip` | entry (`$tooltip-*`), atom `_tooltip.scss` | — | CoreUI/Tooltip |

### Como cada um e usado

**Botao.** Pela prop `weight` do `Button`, nunca por `btn-*` escrito a mao no `www`: `commitment` e `btn-primary`, `structural` e `btn-outline-secondary`, `text` e `btn-ghost-primary`, `destructive` e `btn-ghost-danger`, `destructive-confirm` e `btn-danger`. O pressionado de 1px e o 0.45 do solido desabilitado ja estao no atom. A linha de apoio sob o rotulo e a prop `description`, que vira o `small` irmao do `.btn-label`; `.btn-secondary` nao tem estilo neste sistema. Link com cara de botao usa `btn btn-primary` ou `btn btn-outline-secondary`.

**Campo, select, caixa de marcar e interruptor.** O fio de base, a pauta da textarea, a seta Phosphor do select (`.select-field-caret`) e o interruptor quadrado ja estao nos atoms. `$form-select-indicator`, `$form-check-input-checked-bg-image` e `$form-switch-*-bg-image` estao em `none` no entry, entao nenhum SVG com cor literal da biblioteca chega ao CSS. O rotulo flutuante e os tamanhos `sm` e `lg` nao sao usados.

**Tag.** `Tag` sobre `.badge`, com `status` para as tres cores de status. As classes `text-bg-*` nao sao usadas.

**Acordeao.** `AccordionItem` e um `<details class="accordion-item">` com `<summary class="accordion-button">`: abrir, fechar e o teclado sao do elemento, e o titulo pode ser um heading (`titleAs`). As medidas, as cores e o movimento vem dos knobs `$accordion-*` de `_component.scss`: o `.accordion` do CoreUI e o `AccordionItem` leem os mesmos, e outro projeto que use so o do CoreUI ja recebe a configuracao. O atom `_accordion.scss` le o aberto pelo `[open]`, e nao pela ausencia de `.collapsed`, e anima a altura por `::details-content`, que some com `prefers-reduced-motion`. Um fio por item, desenhado pelo adapter em `.accordion-item`. O indicador e um `Icon` Phosphor com a classe `accordion-indicator`; a seta SVG da biblioteca esta desligada. A variante `accordion-flush` nao muda nada aqui: o adapter ja tira as bordas laterais, e a regra dele vence o `last-child` sem borda da variante.

**Dobra.** `.collapse` com `.show`, controlada por um botao de peso `text` com `aria-expanded`. A altura anima com `--app-duration-base` quando o `CCollapse` usa `.collapsing`, e o movimento some com `prefers-reduced-motion`. A dobra esconde o bloco inteiro; quando o que se protege sao as linhas que sobram de um texto, o componente e `ExpandableText`, que corta em quatro linhas com reticencias — `.collapse` nao corta nada e `text-truncate` so vale para uma linha.

**Menu suspenso.** `.dropdown-menu` em `bg-page` com fio `rule`, raio e sombra de folha pelo atom `_overlay.scss`; item no hover em `bg-hover`, escolhido em `bg-selected` com `fg-emphasis`. O gatilho e um `IconButton` com `aria-haspopup`; a classe `dropdown-toggle` nao e usada, porque o triangulo dela e desenhado por borda.

**Paginacao.** Itens sem borda, em `fg-muted`; hover em `bg-hover`, pagina atual em `bg-selected` com `fg-emphasis`.

**Callout.** `.callout` sem modificador: o fio de sempre (`--app-border-width`) na borda inicial, em `rule-strong`, sem fundo e sem margem propria — o espaco de fluxo vem de `l-stack`. `$callout-variants` esta vazio, entao `callout-primary`, `callout-info` e as demais nao existem.

**Alerta.** So `alert-success`, `alert-warning` e `alert-danger`: lavado de status com a tinta de status, sem borda, sem raio. O CSS de `alert-primary`, `alert-info`, `alert-light` e `alert-dark` e gerado pelo mapa de cores do tema, mas elas nao fazem parte do sistema. O botao de fechar e um `IconButton` com `PiX`.

**Folha lateral.** `.offcanvas` so para o que `overlayPolicy: irreversible-or-context-break` permite: ato irreversivel ou contexto que precisa ser esquecido. Escolher, filtrar e editar um campo continuam no lugar. O veu e `--app-bg-backdrop` com opacidade 1, porque o token ja e alfa. A sombra de folha e o raio nos cantos que nao encostam na borda da tela vem do atom `_overlay.scss`.

**Dica.** `.tooltip` e folha: `bg-page`, fio `rule`, `--app-radius-overlay`, `--app-shadow-overlay` e texto em `caption`, alinhado ao inicio. Raio, sombra, fio e fonte estao no atom, porque `.tooltip-inner` nao tem variavel de borda e os mixins de raio e sombra estao desligados. A largura maxima e `--app-measure-apparatus`. A seta fica escondida: na cor da pagina ela nao se distingue do fundo. A dica aparece com o ponteiro do mouse e com o foco, some com Escape e complementa o nome acessivel do controle, nunca o substitui. O lugar dela e o botao so de icone com desenho universal.

**Tabela.** A marcacao e `.table`, e `.table-responsive` em volta quando a tabela e larga: a largura rola sem mexer na pagina. Nenhuma variante nossa entra na marcacao; o resto se ajusta pela estrutura e pela configuracao do entry. `.table` e a pagina de dados: fios horizontais em `rule`, nenhuma superficie, celula no papel `numeric` (1.125rem com entrelinha 1.4) com algarismos tabulares na tabela inteira. A legenda (`<caption>`) e `caption` em `fg-muted`. O cabecalho e `label-sm` em `fg-muted`, com o fio de baixo em `--app-rule-strong`: um degrau mais escuro, na mesma espessura. O nome da linha e `<th scope="row">`. Grupo de linhas e um `<tbody>` por grupo, aberto por `<th scope="rowgroup">` em `label`, separado por espaco acima e nunca por faixa. Das classes do CoreUI entram so as que dizem algo que a estrutura nao diz: `text-end` na coluna de numero, `table-active` na celula ou linha marcada (`bg-selected`) e `table-hover` quando a linha leva a algum lugar, pintado so em aparelho com hover. O zebrado nao pinta nada (`$table-striped-bg: transparent`), `$table-variants` esta vazio, e `table-sm`, `table-bordered`, `table-borderless`, `table-dark` e `table-group-divider` nao sao usados; o `$table-*-sm` continua configurado no entry. O reset zera a borda de cada celula; `resets.scss` devolve so o estilo e a cor herdada que o reboot do CoreUI daria, com `:where` para a largura da biblioteca vencer.

**Grade.** Usada direto, e mecanica: `row` e `col-*` em flex, `.grid` e `g-col-*` em CSS grid. A calha e a de `--app-gutter` (32px): `$grid-gutter-width` le o mesmo valor de `_metrics.scss`, porque o CoreUI faz conta com ela; o padding do `container` e a metade dela. A secao Utilitarios e helpers diz o que mais se usa assim. Os pontos de quebra da grade (`col-md-*`, `row-cols-md-*`, `text-md-*`) medem a janela, e as regioes mudam com a orientacao, entao dentro de uma regiao eles nao dizem quanto espaco sobrou: ali as colunas sao `l-columns` ou `l-split`.

**Barra lateral.** `Sidebar` sobre `CSidebar`, em `bg-page`, com os links do nav pelo adapter. Recebe os itens, o cabecalho e o `linkComponent`; recolhe para os icones, e a escolha do leitor vale para todas as paginas, porque o estado fica fora delas (`sidebar-fold.ts`). Comeca recolhido abaixo de 1024px. Cabecalho e rodape ficam a duas unidades de ritmo dos links.

## Utilitarios e helpers

O CoreUI entrega mecanica pronta, e ela se usa direto. Ela nao se embrulha num primitivo `l-*`: o que se escreve na gramatica da biblioteca morre com ela, e um embrulho so adia isso. O que carrega valor nao e compilado, entao nao ha como usar por engano.

### Usar

| classe | para que | observacao |
| --- | --- | --- |
| `row`, `col-*`, `offset-*` | grade de 12 colunas em flex | calha de 32px; abaixo do breakpoint as colunas viram sequencia |
| `.grid`, `g-col-*`, `g-start-*` | grade em CSS grid | colecao sem prosa; item com prosa e lista vertical unica |
| `container`, `container-{bp}` | largura maxima da moldura | padding lateral de metade da calha |
| `d-*`, `d-{bp}-*`, `order-*`, `order-{bp}-*` | display e ordem por largura | e remontagem, nunca restyle |
| `flex-*`, `justify-content-*`, `align-items-*`, `align-self-*` | mecanica de flex | |
| `gap-*`, `row-gap-*`, `column-gap-*`, `m*-*`, `p*-*` | espaco interno na escala interna (4, 8, 16, 24, 48) | espaco de fluxo e `l-stack`; `mt-3` entre blocos que o olho desce mistura os dois eixos; `p-3` e a calha do modal, e o conteudo do corpo dele pede esse mesmo helper |
| `mt-rhythm-*`, `mb-rhythm-*`, `my-rhythm-*`, `pt-rhythm-*`, `pb-rhythm-*`, `gy-rhythm-*` (`half`, `1`, `2`) | espaco de fluxo em unidade de ritmo num ponto so | declarados no `$utilities` de `_coreui-utilities.scss` pela API de utilitarios do CoreUI; `gy-rhythm-*` e o espaco entre colunas de `row` que viram sequencia; varios irmaos descendo a pagina continuam sendo `l-stack` |
| `mt-text`, `mb-text`, `pt-text`, `pb-text` | a folga que prende um texto ao fio ou ao corpo que vem logo depois | `--app-gap-text`, `0.2em` na fonte de quem usa; nao e fracao do ritmo, que e uma linha inteira e nao se subdivide abaixo de `half` |
| `border-top`, `border-bottom`, `border-top-0`, `border-bottom-0` | fio horizontal | pintam `--app-rule` na espessura e estilo do sistema, e nao a borda do CoreUI; cor e espessura nao tem variante |
| `position-*`, `top-*`, `bottom-*`, `start-*`, `end-*`, `translate-middle` | posicionamento | |
| `sticky-top` | indice ancorado, cabecalho que acompanha a rolagem | z-index 1020, o mesmo de `--app-z-sticky` |
| `visually-hidden`, `visually-hidden-focusable` | texto so para leitor de tela, link de pular para o conteudo | |
| `ratio`, `ratio-1x1` | video e embed na proporcao da imagem | foto e `.app-image` |
| `text-truncate` | rotulo curto em lugar estreito | nunca prosa, que respeita a medida e quebra |
| `text-start`, `text-center`, `text-end`, `text-nowrap`, `text-break` | alinhamento e quebra | |
| `w-*`, `h-*`, `mw-100`, `mh-100`, `overflow-*`, `object-fit-*`, `align-*`, `float-*`, `clearfix`, `user-select-*`, `pe-none`, `pe-auto`, `visible`, `invisible`, `z-*` | mecanica | |

### Primitivo ou utilitario

| precisa de | use |
| --- | --- |
| fluxo vertical em unidade de ritmo | `l-stack` |
| um espaco de ritmo num elemento so, ou entre colunas empilhadas | `mt-rhythm-*`, `mb-rhythm-*`, `my-rhythm-*`, `pt-rhythm-*`, `pb-rhythm-*`, `gy-rhythm-*` |
| titulo colado ao seu fio ou ao seu corpo | `pb-text`, `mb-text` |
| fio horizontal acima ou abaixo de um bloco | `border-top`, `border-bottom` (e `-0` para tirar) |
| grupo lado a lado que quebra | `l-cluster` |
| margem, conteudo e aparato | `l-regions` |
| medida de texto | `l-measure` |
| colunas que cabem pelo espaco que a peca tem | `l-columns` |
| partes lado a lado que empilham quando falta espaco | `l-split`; `flex-grow-0` na parte que fica com a largura do conteudo, `--l-grow` para a proporcao |
| colunas fixas, que nao mudam com o espaco | `row` e `col-*` sem ponto de quebra, ou `.grid` e `g-col-*` |
| alvo de toque de 44px | `l-target` |
| alvo inteiro de um item | o link e o item: `IndexItem`, `ThumbItem`, `LineListItem` com `href` |

### Nao compilados

Os utilitarios abaixo estao em `null` no `$utilities` de `_coreui-utilities.scss` e nao existem no CSS:

| familia | por que |
| --- | --- |
| `color`, `text-color`, `text-opacity`, `background-color`, `bg-opacity`, `subtle-background-color`, `gradient` | cor e fundo resolvem num token por configuracao; gradiente e guardrail |
| `link-opacity`, `link-offset`, `link-underline`, `link-underline-opacity` | o link e o atom `_link.scss` |
| `border`, `border-start`, `border-end`, `border-color`, `border-{lado}-color`, `border-width`, `border-{lado}-width`, `subtle-border-color`, `border-opacity` | fio e borda sao tokens diferentes e cada componente escolhe o seu |
| `rounded`, `rounded-{lado}` | raio e zero, exceto controle e folha sobreposta |
| `shadow`, `opacity` | sombra so na folha sobreposta; opacidade e estado |
| `focus-ring` | o foco e o anel nativo, nunca sombra |
| `font-family`, `font-size`, `font-style`, `font-weight`, `line-height` | tipografia sao os papeis de `typography.scss`, consumidos pela propriedade `font` |
| `text-decoration`, `text-transform` | sublinhado significa leva a outro lugar; caixa alta em rotulo e antipadrao |

E os helpers que ficam fora do entry:

| helper | classes | por que |
| --- | --- | --- |
| `color-bg` | `text-bg-*` | cor de marca por classe |
| `colored-links` | `link-*` | idem |
| `focus-ring` | `focus-ring`, `focus-ring-*` | foco com sombra |
| `icon-link` | `icon-link`, `icon-link-hover` | link nao leva icone |
| `vr` | `vr` | fio vertical so depois de esgotar a calha, e entre regioes |
| `stacks` | `vstack`, `hstack` | repetem `l-stack` e `l-cluster` e, com `gap-*`, misturam os dois eixos de espaco |
| `stretched-link` | `stretched-link` | o clique vale o item inteiro, mas o anel de foco fica no texto do link; o §11 pede que a caixa focavel seja o alvo |

## Nao importados

| parcial | motivo |
| --- | --- |
| `modal` | o bloco `.modal` e o `Modal` desta biblioteca, dentro de `.dialog`. O `.modal` do CoreUI e `position: fixed` com `display: none` e quebraria o dialog. A calha dele e `--modal-gutter`, do mesmo passo que `p-3` |
| `chip`, `chip-set`, `forms/chip-input` | o bloco `.chip` e o atom `_chip.scss` |
| `avatar` | o bloco `.avatar` e o `Avatar` desta biblioteca e aparece no `user-box` do `www` |
| `footer`, `carousel` | os blocos `.footer` e `.carousel` sao componentes desta biblioteca |
| `header` | o bloco `.header` e o cabecalho do `www` |
| `list-group` | toda lista de leitura e `line-list`, e colecao e `index-list` ou `thumb-grid` |
| `placeholders` | o esqueleto e o atom `.skeleton`, que espera 300ms antes de aparecer; nenhuma variavel do CoreUI expressa esse atraso |
| `close` | `.btn-close` e um SVG em data-URI com cor literal; o X e `IconButton` com `PiX` |
| `navbar` | o `.navbar` do CoreUI e a barra de cabecalho com marca, toggler e menu que recolhe. A barra de destinos do telefone e outro padrao e e o `Dock` (`.dock`); o nome `.navbar` fica livre para o parcial, se ele entrar |
| `card` | nao ha card neste sistema: item de colecao nao tem superficie, e o aparte e `.box`. A tela de icones do admin escreve o proprio bloco. O `$card-*` fica configurado no entry, com o import comentado, para outros projetos |
| `reboot`, `type` | o reset e `the-new-css-reset`, e a tipografia sao os papeis de `typography.scss` |
| `forms/floating-labels` | o rotulo fica sempre acima do campo |
| `forms/input-group` | o campo com icone ou botao e `.field-adorned` |
| `popover`, `toast`, `button-group`, `forms/form-range`, `icon` | nenhum consumidor; os icones sao Phosphor via `@phosphor-icons/react`, um modulo por icone |

`CSmartTable` e os demais componentes PRO nao estao instalados.

## Z-index

Os z-index do CoreUI continuam os da biblioteca e nao leem `--app-z-*`. Os dois coincidem em dropdown (1000) e sticky (1020). Divergem em tooltip e toast, que no CoreUI sao 1080 e 1090 e na camada 2 sao `--app-z-tooltip` 1090 e `--app-z-toast` 1080, e no offcanvas, que e 1045 e nao tem token.

## Pendencias

Decisoes que dependem de aprovacao. Nenhuma delas esta aplicada.

1. **Z-index.** Decidir se `$zindex-*` segue os tokens, inclusive a troca de tooltip e toast.
2. **Colisoes.** Para usar `CModal` ou `CChip` o bloco proprio precisa de outro nome. Sem isso, os proprios continuam e os do CoreUI ficam fora.
3. **Adapter sem componente importado.** Os blocos `.modal` (que alcanca o `.modal` proprio) e `.navbar-toggler-icon`, e `_important-overrides`, que pinta `.text-bg-*` enquanto o helper `color-bg` nao e mais compilado.
4. **Estilos existentes que divergem do `DESIGN_LANGUAGE.md`.**
   - A barra lateral pinta hover e ativo com fundo e raio (`$nav-bg-hover`, `$nav-bg-active`, `$nav-radius`); o §10 pede itens sem fundo e ativo em `fg-emphasis`.
   - `dialog.scss` pinta o veu com `rgba(0, 0, 0, 0.75)` em vez de `--app-bg-backdrop`.
   - `$footer-bg` e `bg-accent-solid`; o §11 diz que rodape nao e preenchido em accent.
5. **Lint.** O bloco de `overrides` para `components/**` e `styles/**` redefine `declaration-property-value-disallowed-list` e substitui a lista que proibe `#`, `rgb`, `hsl` e `oklch` em propriedades de cor. E por isso que o literal do `dialog.scss` passa.
6. **Storybook.** `stories/Configure.mdx` e `stories/assets/` sao o onboarding padrao do Storybook.
