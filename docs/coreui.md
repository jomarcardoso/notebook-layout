<!-- notebook-layout/docs/coreui.md -->

# CoreUI no design system

Este documento e o inventario do CoreUI dentro do `notebook-layout`: o que entra, onde cada decisao mora, o que fica de fora e por que. A regra geral de camadas esta em `AGENTS.md` (secao CSS) e a linguagem visual em `DESIGN_LANGUAGE.md`; aqui fica so o que e especifico da biblioteca.

A versao instalada e `@coreui/coreui` 5.9. O pacote declara so o CSS como dependencia: os componentes desta biblioteca escrevem a marcacao com as classes do CoreUI e nao importam `@coreui/react`. O `www` usa `@coreui/react` diretamente.

## Onde cada decisao mora

| arquivo | o que guarda | exemplo |
| --- | --- | --- |
| `styles/coreui-entry.scss` | variaveis Sass que a biblioteca aceita e os parciais importados | `$input-bg: transparent` |
| `styles/_coreui.scss` | a traducao entre os nomes `--cui-*` e os papeis da camada 2 | `--cui-callout-border-left-color` e `border-selected` |
| `styles/_component.scss` | knobs de camada 3 que o adapter e os componentes proprios leem | `$accordion-rule-color` |
| `styles/atoms/*` | regra do sistema que nenhuma variavel expressa | o fio de base do campo, o pressionado de 1px |
| `styles/_metrics.scss` | camada 1 em valor Sass: as medidas que os tokens e o entry leem em tempo de compilacao | `$gutter`, `space('md')` |

Tres consequencias praticas:

- Uma variavel Sass do CoreUI que ainda nao tem consumidor fica no entry mesmo assim. Ela nao gera CSS por si so, serve ao dia em que o componente entrar e a outros projetos que usem esta fundacao.
- O adapter emite na layer `vendor-config`, depois de `vendor`. Uma regra dele num seletor de componente vence qualquer variante da biblioteca, com qualquer especificidade. Por isso um padrao que a variante precisa trocar vai no `:root` do adapter, herdado, e nao no seletor do componente.
- `$enable-rounded` e `$enable-shadows` estao desligados. As variaveis de raio e sombra de um componente viram custom property, mas os mixins `border-radius()` e `box-shadow()` nao emitem a propriedade. Raio de controle e sombra de folha chegam por atom.

Uma variavel Sass que entra em conta dentro do proprio CoreUI (`$alert-padding-x * 3`, `$grid-gutter-width * .5`) nao aceita `var()`. Ela le o valor de `styles/_metrics.scss`, o mesmo arquivo de onde `_base.scss` e `_semantic.scss` emitem os tokens, e nenhum valor de medida e escrito duas vezes.

A regra para escolher entre os dois: `metrics.*` quando o CoreUI faz conta Sass com a variavel em qualquer parcial, importado ou nao (`$border-width`, `$grid-gutter-width`, `$alert-padding-*`, `$btn-padding-x`, `$nav-link-padding-*`, os `$spacers`), ou quando o valor e de camada 1, que o entry nao le em runtime (`$headings-line-height`). Em todo o resto, `var(--app-*)`, que acompanha o token em runtime.

## Importados

| parcial | configurado em | quem usa | Storybook |
| --- | --- | --- | --- |
| `root`, `containers`, `grid`, `utilities/api` | entry (`$spacers`, `$grid-gutter-width`, `$enable-cssgrid`, `$utilities`) | `www` (`row`, `col-*`, `.grid`, `container`, utilitarios de mecanica) | CoreUI/Grade, CoreUI/Mecanica |
| `helpers/clearfix`, `position`, `ratio`, `text-truncation`, `visually-hidden` | entry, um a um | `www` (`visually-hidden`, `ratio`) | CoreUI/Mecanica |
| `breadcrumb` | adapter | `Breadcrumbs` | CoreUI/Navegacao |
| `nav` | entry (`$nav-*`, `$nav-tabs-*`) | `Tabs` | Navegacao/Abas |
| `buttons` | entry (`$btn-*`), atom `_button.scss` | `Button`, `IconButton` | Atomos/Acao |
| `accordion` | entry (`$accordion-*`), adapter | `www` `filed-recipes` (marcacao) | CoreUI/Revelacao |
| `transitions` | entry (`$transition-*`) | `.collapse` do acordeao | CoreUI/Revelacao |
| `images` | — | `.app-image` e atom proprio | Moleculas/Indice e grade |
| `sidebar` | entry (`$sidebar-toggler-*`), adapter | `www` `CSidebar` | CoreUI/Navegacao |
| `badge` | entry, adapter, atom `_tag.scss` | `Tag` | Atomos/Marcas de leitura |
| `card` | entry (`$card-border-color`) | `www` `CCard` em `food-icons` | — |
| `forms/*` (labels, form-text, form-control, form-select, form-check, validation) | entry (`$input-*`, `$form-*`), atoms `_field`, `_label`, `_field-message`, `_reader-marks` | `Select`, `Textarea`, `Field`, `LineListCheck` | Atomos/Campos, Atomos/Marcas do leitor, Moleculas/Campo completo |
| `spinners`, `progress` | entry (`$spinner-*`, `$progress-*`), atom `_progress.scss` | `Waiting`, `Progress`, `Button` carregando | Atomos/Retorno |
| `dropdown` | entry (`$dropdown-*`), adapter | — | CoreUI/Navegacao |
| `pagination` | entry (`$pagination-*`), adapter | — | CoreUI/Navegacao |
| `callout` | entry (`$callout-*`), adapter | — | CoreUI/Avisos |
| `alert` | entry (`$alert-*`), cores pelo adapter | — | CoreUI/Avisos |
| `offcanvas` | entry (`$offcanvas-*`) | — | CoreUI/Folha lateral |
| `tables` | entry (`$table-*`), atom `_table.scss`, `resets.scss` | `www` `AminoAcidsTable` e a revisao de alimento do admin | CoreUI/Tabela |
| `tooltip` | entry (`$tooltip-*`), atom `_tooltip.scss` | — | CoreUI/Dica |

### Como cada um e usado

**Botao.** Pela prop `weight` do `Button`, nunca pela prop `color` do `CButton`: `compromisso` e `btn-primary`, `estruturante` e `btn-outline-secondary`, `texto` e `btn-ghost-primary`, `destrutiva` e `btn-ghost-danger`, `confirmacao-destrutiva` e `btn-danger`. O pressionado de 1px e o 0.45 do solido desabilitado ja estao no atom.

**Campo, select, caixa de marcar e interruptor.** O fio de base, a pauta da textarea, a seta Phosphor do select (`.select-field-caret`) e o interruptor quadrado ja estao nos atoms. `$form-select-indicator`, `$form-check-input-checked-bg-image` e `$form-switch-*-bg-image` estao em `none` no entry, entao nenhum SVG com cor literal da biblioteca chega ao CSS. O rotulo flutuante e os tamanhos `sm` e `lg` nao sao usados.

**Tag.** `Tag` sobre `.badge`, com `status` para as tres cores de status. As classes `text-bg-*` e a prop `color` do `CBadge` nao sao usadas.

**Acordeao.** Um fio por item, desenhado pelo adapter em `.accordion-item`. O indicador e um `Icon` Phosphor com a classe `accordion-indicator`; a seta SVG da biblioteca esta desligada. A variante `accordion-flush` nao muda nada aqui: o adapter ja tira as bordas laterais, e a regra dele vence o `last-child` sem borda da variante.

**Dobra.** `.collapse` com `.show`, controlada por um botao de peso `texto` com `aria-expanded`. A altura anima com `--app-duration-base` quando o `CCollapse` usa `.collapsing`, e o movimento some com `prefers-reduced-motion`.

**Menu suspenso.** `.dropdown-menu` em `bg-page` com fio `rule`, raio e sombra de folha pelo atom `_overlay.scss`; item no hover em `bg-hover`, escolhido em `bg-selected` com `fg-emphasis`. O gatilho e um `IconButton` com `aria-haspopup`; a classe `dropdown-toggle` nao e usada, porque o triangulo dela e desenhado por borda.

**Paginacao.** Itens sem borda, em `fg-muted`; hover em `bg-hover`, pagina atual em `bg-selected` com `fg-emphasis`.

**Marca de margem.** `.callout` sem modificador: um fio de `--app-marker-width` na borda inicial, em `border-selected`, sem fundo e sem margem propria — o espaco de fluxo vem de `l-stack`. `$callout-variants` esta vazio, entao `callout-primary`, `callout-info` e as demais nao existem.

**Alerta.** So `alert-success`, `alert-warning` e `alert-danger`: lavado de status com a tinta de status, sem borda, sem raio. O CSS de `alert-primary`, `alert-info`, `alert-light` e `alert-dark` e gerado pelo mapa de cores do tema, mas elas nao fazem parte do sistema. O botao de fechar e um `IconButton` com `PiX`.

**Folha lateral.** `.offcanvas` so para o que `overlayPolicy: irreversible-or-context-break` permite: ato irreversivel ou contexto que precisa ser esquecido. Escolher, filtrar e editar um campo continuam no lugar. O veu e `--app-bg-backdrop` com opacidade 1, porque o token ja e alfa. A sombra de folha e o raio nos cantos que nao encostam na borda da tela vem do atom `_overlay.scss`.

**Dica.** `.tooltip` e folha: `bg-page`, fio `rule`, `--app-radius-overlay`, `--app-shadow-overlay` e texto em `caption`, alinhado ao inicio. Raio, sombra, fio e fonte estao no atom, porque `.tooltip-inner` nao tem variavel de borda e os mixins de raio e sombra estao desligados. A largura maxima e `--app-measure-apparatus`. A seta fica escondida: na cor da pagina ela nao se distingue do fundo. A dica aparece com o ponteiro do mouse e com o foco, some com Escape e complementa o nome acessivel do controle, nunca o substitui. O lugar dela e o botao so de icone com desenho universal.

**Tabela.** `.table` e a pagina de dados: fios horizontais em `rule`, nenhuma superficie, celula em `body`, o papel da regiao de conteudo; em `table-sm` a celula desce para `body-sm`, o papel do aparato. O cabecalho e `label-sm` em `fg-muted`, com o fio de baixo em `--app-rule-strong`: um degrau mais escuro, na mesma espessura. Coluna de numero leva `.numeric` na celula e no cabecalho — papel `numeric`, algarismos tabulares, alinhada ao fim. O nome da linha e `<th scope="row">`. Grupo de linhas e um `<tbody>` por grupo, aberto por `<th scope="rowgroup">` em `label`, separado por espaco acima e nunca por faixa. `table-hover` pinta o lavado so em aparelho com hover, e so quando a linha leva a algum lugar; `table-active` marca a linha escolhida com `bg-selected`. `table-sm` e a densidade do aparato, e `table-responsive` rola a tabela larga sem mexer na pagina. O zebrado nao pinta nada (`$table-striped-bg: transparent`), `$table-variants` esta vazio, e `table-bordered`, `table-borderless`, `table-dark` e `table-group-divider` nao sao usados. O reset zera a borda de cada celula; `resets.scss` devolve so o estilo e a cor herdada que o reboot do CoreUI daria, com `:where` para a largura da biblioteca vencer.

**Grade.** Usada direto, e mecanica: `row` e `col-*` em flex, `.grid` e `g-col-*` em CSS grid. A calha e a de `--app-gutter` (32px): `$grid-gutter-width` le o mesmo valor de `_metrics.scss`, porque o CoreUI faz conta com ela; o padding do `container` e a metade dela. A secao Utilitarios e helpers diz o que mais se usa assim.

**Barra lateral.** `CSidebar` no `www`, em `bg-page`, com os links do nav pelo adapter.

**Card.** Importado porque a tela de icones do admin usa `CCard`. Nenhum componente novo nasce dele (`Nenhum componente chamado card`), e ele nao entra no Storybook.

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
| `gap-*`, `row-gap-*`, `column-gap-*`, `m*-*`, `p*-*` | espaco interno na escala interna (4, 8, 16, 24, 48) | espaco de fluxo e `l-stack`; `mt-3` entre blocos que o olho desce mistura os dois eixos |
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
| grupo lado a lado que quebra | `l-cluster` |
| margem, conteudo e aparato | `l-regions` |
| medida de texto | `l-measure` |
| colunas dentro de uma regiao, ou uma colecao em grade | `row` e `col-*`, ou `.grid` e `g-col-*` |
| alvo de toque de 44px | `l-target` |
| alvo inteiro de um item | o link e o item: `IndexItem`, `ThumbItem`, `LineListItem` com `href` |

### Nao compilados

Os utilitarios abaixo estao em `null` no `$utilities` do entry e nao existem no CSS:

| familia | por que |
| --- | --- |
| `color`, `text-color`, `text-opacity`, `background-color`, `bg-opacity`, `subtle-background-color`, `gradient` | cor e fundo resolvem num token por configuracao; gradiente e guardrail |
| `link-opacity`, `link-offset`, `link-underline`, `link-underline-opacity` | o link e o atom `_link.scss` |
| `border`, `border-{lado}`, `border-color`, `border-{lado}-color`, `border-width`, `border-{lado}-width`, `subtle-border-color`, `border-opacity` | fio e borda sao tokens diferentes e cada componente escolhe o seu |
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
| `modal` | o bloco `.modal` e o `Modal` desta biblioteca, dentro de `.dialog`. O `.modal` do CoreUI e `position: fixed` com `display: none` e quebraria o dialog |
| `chip`, `chip-set`, `forms/chip-input` | o bloco `.chip` e o atom `_chip.scss` |
| `avatar` | o bloco `.avatar` e o `Avatar` desta biblioteca e aparece no `user-box` do `www` |
| `footer`, `carousel` | os blocos `.footer` e `.carousel` sao componentes desta biblioteca |
| `header` | o bloco `.header` e o cabecalho do `www` |
| `list-group` | toda lista de leitura e `line-list`, e colecao e `index-list` ou `thumb-grid` |
| `placeholders` | o esqueleto e o atom `.skeleton`, que espera 300ms antes de aparecer; nenhuma variavel do CoreUI expressa esse atraso |
| `close` | `.btn-close` e um SVG em data-URI com cor literal; o X e `IconButton` com `PiX` |
| `navbar` | a barra do telefone e `.app-navbar` no `www` |
| `reboot`, `type` | o reset e `the-new-css-reset`, e a tipografia sao os papeis de `typography.scss` |
| `forms/floating-labels` | o rotulo fica sempre acima do campo |
| `forms/input-group` | o campo com icone ou botao e `.field-adorned` |
| `popover`, `toast`, `button-group`, `forms/form-range`, `icon` | nenhum consumidor; os icones sao Phosphor via `react-icons/pi` |

`CSmartTable` e os demais componentes PRO nao estao instalados.

## Z-index

Os z-index do CoreUI continuam os da biblioteca e nao leem `--app-z-*`. Os dois coincidem em dropdown (1000) e sticky (1020). Divergem em tooltip e toast, que no CoreUI sao 1080 e 1090 e na camada 2 sao `--app-z-tooltip` 1090 e `--app-z-toast` 1080, e no offcanvas, que e 1045 e nao tem token.

## Pendencias

Decisoes que dependem de aprovacao. Nenhuma delas esta aplicada.

1. **Z-index.** Decidir se `$zindex-*` segue os tokens, inclusive a troca de tooltip e toast.
2. **Colisoes.** Para usar `CModal` ou `CChip` o bloco proprio precisa de outro nome. Sem isso, os proprios continuam e os do CoreUI ficam fora.
3. **Repeticao entre atom e entry.** `_progress.scss` repete em `--cui-spinner-*` e `--cui-progress-*` os mesmos valores que `$spinner-*` e `$progress-*` ja definem. `_tag.scss` fixa `border-radius: 0` enquanto `$badge-radius` e o adapter apontam para `--app-radius-control`.
4. **Adapter sem componente importado.** Os blocos `.modal` (que alcanca o `.modal` proprio) e `.navbar-toggler-icon`, o bloco `.card` comentado, e `_important-overrides`, que pinta `.text-bg-*` enquanto o helper `color-bg` nao e mais compilado.
5. **Estilos existentes que divergem do `DESIGN_LANGUAGE.md`.**
   - A barra lateral pinta hover e ativo com fundo e raio (`$nav-bg-hover`, `$nav-bg-active`, `$nav-radius`); o §10 pede itens sem fundo e ativo com fio accent na borda inicial.
   - Existem tres barras de progresso: `Progress`, `Progressbar` e `ProgressIndicator`. `Progressbar` nao tem consumidor no `www` e ainda desenha trilho em `bg-subtle` com contorno e raio, onde o §10 pede trilho em `rule`.
   - `dialog.scss` pinta o veu com `rgba(0, 0, 0, 0.75)` em vez de `--app-bg-backdrop`.
   - `$footer-bg` e `bg-accent-solid`; o §11 diz que rodape nao e preenchido em accent.
6. **Lint.** O bloco de `overrides` para `components/**` e `styles/**` redefine `declaration-property-value-disallowed-list` e substitui a lista que proibe `#`, `rgb`, `hsl` e `oklch` em propriedades de cor. E por isso que o literal do `dialog.scss` passa.
7. **Storybook.** `stories/Configure.mdx` e `stories/assets/` sao o onboarding padrao do Storybook.
