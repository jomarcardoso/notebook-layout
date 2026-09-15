<!-- notebook-layout/docs/composition.md -->

# Composicao

Como uma pagina se monta com o que ja existe. `DESIGN_LANGUAGE.md` diz a regra; este documento diz com que classe e componente ela se escreve, e registra as decisoes que a regra deixa em aberto. O inventario do CoreUI e o que dele se usa direto estao em `docs/coreui.md`.

Quase tudo aqui e composicao: primitivos `l-*`, grade do CoreUI, tipografia e componentes da biblioteca arranjados, sem CSS proprio. So tres pecas tem CSS: o boxe, a ficha e o folio.

## As pecas

| peca | classe | camada | Storybook |
| --- | --- | --- | --- |
| boxe | `.box` | atom `styles/atoms/_box.scss` | Atomos/Boxe |
| ficha e dado | `.facts`, `.facts__item`, `.facts__label`, `.facts__value` | molecula `styles/molecules/_facts.scss` | Moleculas/Ficha |
| folio | `.folio` | atom `styles/atoms/_folio.scss` | Composicoes/Folio |

### Boxe

A unica superficie de conteudo: `bg-muted`, sem raio, sem borda, sem sombra. Guarda um aparte com mais de um bloco ou um conjunto que se le junto, como a ficha. O padding e escala interna (`--app-space-md`); o espaco em volta e fluxo e vem de `l-stack`, entao o boxe nao tem margem.

O boxe nao e clicavel. O que leva a algum lugar e item de colecao, sem superficie; um boxe clicavel e um card com outro nome. Link dentro do boxe e permitido e usa o hover de alfa, que compoe sobre o lavado.

Pela escada de separacao a marca de margem (`.callout`) vem antes: um aparte de uma frase e marca de margem, e o boxe entra quando a marca nao basta.

### Ficha e dado

A ficha sao os dados-chave lado a lado. A marcacao e `dl`, e cada `.facts__item` agrupa `dt.facts__label` e `dd.facts__value` — esse par e o dado. Rotulo em `label-sm` e `fg-muted`, valor em `numeric` com algarismos tabulares. Os pares se separam pela calha (`--app-gutter`) e quebram para a linha de baixo com `--app-space-sm` entre linhas; nunca por fio vertical.

A ficha nao tem superficie propria. No papel ela se separa por espaco, e e o padrao, como na abertura. Quando precisa ser lida como bloco a parte, a mesma `dl` recebe `.box`. A faixa entre dois fios nao e forma de ficha, porque desenha dois fios paralelos.

Dois pares rotulo e valor em lista vertical nao sao ficha: sao `LineList family="data"`.

### Folio

O texto de pe e cabeca que orienta sem pedir leitura: titulo corrido, posicao numa sequencia, numero de pagina. `fg-subtle`, que o §4 reserva para o folio, em `caption`, com algarismos tabulares. Separa-se do conteudo por espaco, sem fio.

## Composicoes

| composicao | com o que | Storybook |
| --- | --- | --- |
| abertura | `row` 4/8, `.app-image`, `display`, `subtitle`, `.facts` | Composicoes/Abertura |
| destaque de vitrine | `row` 7/5, `.section-title`, `ThumbItem` com `variant` `featured` e `brief` | Composicoes/Destaque de vitrine |
| secao com acao | `l-cluster -between -baseline`, `.section-title.-plain`, link, `IndexList` | Composicoes/Secao com acao |
| vazio | `l-measure -narrow`, `l-stack -tight`, `.state-illustration`, `title-sm`, `Button` | Composicoes/Vazio |
| grupo de campos | `.fieldset`, `l-stack`, `Field` | Composicoes/Grupo de campos |
| montagem de leitura | `l-regions`, `sticky-top`, `LineList`, `.table.table-sm` | Composicoes/Montagem de leitura |

### Abertura

O cabecalho da pagina de leitura: figura 1:1 em quatro colunas, texto em oito — titulo em `display`, headnote em `subtitle` e a ficha no papel. Sem foto, o lugar da figura continua ocupado pelo lavado de `.app-image`, e a abertura tem a mesma forma. Estreitando a tela, figura e texto viram sequencia na mesma ordem.

### Destaque de vitrine

Uma secao de vitrine: o item principal (`ThumbItem variant="featured"`) com imagem e texto em `title-md`, e tres ou quatro secundarios (`variant="brief"`) sem imagem, em `label` com o detalhe em `caption`. A hierarquia e de tamanho, e o §5 registra essa escala como a unica excecao das colecoes. O titulo da secao e o unico heading; os itens nao sao partes da pagina.

Em todo item o link E o item, como no resto das colecoes: a area de clique, o hover e o anel de foco sao a mesma caixa, como o §11 pede. `stretched-link` nao e usado, porque ele estica o clique e deixa o anel no texto.

### Secao com acao

Quando a secao tem uma acao de secao — "ver todas" —, titulo e link dividem a linha de base num `l-cluster -between -baseline`. A acao e link, porque leva a outro lugar. O titulo usa `.section-title.-plain`: o fio correria so sob o titulo, cortado pelo link, e o link ja marca o comeco da secao.

### Vazio

Tipografico, sem caixa: o que falta em `title-sm`, para que serve em `body`, e a acao que resolve, quando existe. A ilustracao e opcional (`.state-illustration`) e sai quando o leitor esta no meio de uma tarefa, como numa busca sem resultado; ali a saida e um link.

### Grupo de campos

A pagina de composicao divide o formulario em `.fieldset`: legenda em `label` e `fg-muted`, uma linha de apoio em `caption` e os campos em `l-stack`. Entre grupos, uma unidade de ritmo, que `.fieldset + .fieldset` ja aplica. A largura e do campo, na medida estreita. O opcional e marcado; o obrigatorio, nao.

### Montagem de leitura

Uma proposta, ainda nao decidida — ver Decisoes a confirmar. A pagina de leitura nas tres regioes de `l-regions`:

- **margem:** o indice ancorado, uma `LineList` de links presa por `sticky-top`, com a secao atual em `selected`;
- **conteudo:** as secoes da receita;
- **aparato:** o que acompanha o conteudo — nutricional em `.table.table-sm` e relacionadas — com titulos internos em `label-sm`.

A proposta poe o indice ancorado na margem porque no aparato ele dividiria a coluna com nutricional e relacionadas. Ela so respeita o teto de tres regioes (`regionsMax: 3`) se o trilho de navegacao do app for moldura (`frame: app-frame`) e nao regiao.

## Decisoes a confirmar

1. **Onde mora o indice ancorado.** O §7 diz que a margem guarda "navegacao, indice do caderno", e que tres regioes e o teto. Com o trilho do app na tela, a proposta soma trilho, indice, conteudo e aparato: quatro, se o trilho contar como regiao. As saidas sao tres. O trilho e moldura e nao conta, e a proposta fica como esta. Ou o indice entra no trilho quando a pagina e de leitura, e a margem e uma so. Ou o indice vai para o aparato, acima de nutricional e relacionadas, e o aparato passa a ter tres assuntos.
2. **Boxe.** Existe como `.box` e pode ser desfeito sem tocar em nenhuma tela: nenhum consumidor usa a classe.
3. **Ficha no papel como padrao.** A ficha no boxe fica como segunda forma. Se o padrao for o boxe, a abertura muda de forma.
