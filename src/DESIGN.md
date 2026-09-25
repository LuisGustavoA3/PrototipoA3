Especificações de Design — Plataforma A3

Status: Consolidação inicial das especificações visuais e CSS.

Importante: valores ainda não confirmados diretamente no código/CSS atual estão identificados como Proposta / A confirmar. Não devem ser tratados como identidade visual oficial até validação.

1. Typography

Font family

Proposta / A confirmar: Inter

A família tipográfica oficial deve ser confirmada a partir da implementação atual.

Font weights

400 — Regular

500 — Medium

600 — Semibold

700 — Bold

Status: Proposta / A confirmar.

Line-height

Texto comum: 1.5 — aproximadamente 24px em fonte de 16px

Títulos: aproximadamente 1.2–1.35

Status: Proposta / A confirmar.

2. Escala tipográfica

Token

Tamanho

xs

12px

sm

14px

md

16px

lg

18px

xl

24px

2xl

30px

3xl

36px

Hierarquia sugerida

Elemento

Tamanho

Peso

Line-height

Texto auxiliar

12px

400

16–18px

Texto secundário

14px

400–500

20px

Texto padrão

16px

400

24px

Subtítulo

18px

600

28px

Título de seção

24px

600

32px

Título principal

30px

600

36px

Título de destaque

36px

600–700

44px

Status: Proposta / A confirmar.

3. Text Colors

Os tokens abaixo representam a estrutura desejada. Os valores HEX/RGB ainda precisam ser extraídos do código/protótipo atual.

Token

Uso

Valor

text-primary

Texto principal

A confirmar

text-secondary

Texto secundário

A confirmar

text-muted

Texto auxiliar

A confirmar

text-disabled

Elementos desabilitados

A confirmar

text-inverse

Texto sobre fundo contrastante

A confirmar

text-link

Links

A confirmar

text-error

Erros

A confirmar

text-success

Sucesso

A confirmar

text-warning

Alertas

A confirmar

A cor laranja já utilizada pela aplicação deve ser preservada onde representa o estado/identidade existente. O valor exato deve ser confirmado no código.

4. Technical Stack

Referência atual/proposta:

Frontend: React + TypeScript

Build/desenvolvimento: Vite

Backend/serviços: Supabase + Edge Functions

Banco: PostgreSQL

Interface: componentes reutilizáveis e tokens de design

Responsividade: Web responsiva

Observação: não considerar Tailwind como especificação oficial sem confirmação da implementação atual.

5. Spacing

Token

Valor

2xs

4px

xs

8px

sm

12px

md

16px

lg

24px

xl

32px

2xl

40px

3xl

48px

4xl

64px

Status: Proposta / A confirmar.

6. Container

Largura máxima

Proposta:

max-width: 1280px;
width: 100%;
margin: 0 auto;

Padding horizontal

Desktop:

padding-left: 24px;
padding-right: 24px;

Mobile:

padding-left: 16px;
padding-right: 16px;

Status: Proposta / A confirmar.

7. Section Height

Evitar alturas fixas para seções de conteúdo.

Preferir:

height: auto;
min-height: ...;

A altura deve ser determinada pelo conteúdo e pelo contexto da tela.

8. Content

Referência:

max-width: 1280px;
width: 100%;
margin: 0 auto;
padding: 32px 24px;

Mobile:

padding: 24px 16px;

Status: Proposta / A confirmar.

9. Headings

Main heading

font-size: 30px;
font-weight: 600;
line-height: 36px;
margin-bottom: 24px;

Section heading

font-size: 24px;
font-weight: 600;
line-height: 32px;
margin-bottom: 16px;

Subtitle

font-size: 18px;
font-weight: 600;
line-height: 28px;

Status: Proposta / A confirmar.

10. Formulários

Input

Referência:

min-height: 40px;
height: 40px;
padding: 0 12px;
font-size: 14px;
border-width: 1px;

Quando necessário:

height: 44px;

Label

font-size: 14px;
font-weight: 500;
margin-bottom: 6px;

Espaçamento

Entre campos: 16px

Entre grupos: 24px

Entre blocos maiores: 32px

11. Border Radius

Token

Valor

radius-sm

4px

radius-md

6px

radius-lg

8px

radius-xl

12px

Referência geral: 6–8px.

Status: Proposta / A confirmar.

12. Borders

Padrão:

border-width: 1px;

Estados a considerar:

Default

Hover

Focus

Active

Error

Disabled

As cores devem utilizar tokens.

13. Focus

Referência:

outline-width: 2px;
outline-offset: 1px;

O foco deve ser visualmente identificável e não depender somente de cor.

14. Buttons

Referência:

height: 40px;
padding: 0 16px;
font-size: 14px;
font-weight: 500;

Ações de maior destaque podem utilizar 44px.

Estados:

Default

Hover

Active

Focus

Disabled

Loading

15. Grid

Desktop:

12 colunas
gap: 16px

Mobile:

1 coluna

16. Breakpoints

Contexto

Breakpoint

Mobile

< 640px

Tablet

640px – 1023px

Desktop

>= 1024px

Large desktop

>= 1280px

Status: Proposta / A confirmar.

17. Shadows

Escala sugerida:

shadow-sm

shadow-md

shadow-lg

Uso moderado principalmente em cards, menus, modais e elementos elevados.

Status: Proposta / A confirmar.

18. Icons

Contexto

Tamanho

Pequeno

16px

Padrão

20px

Destaque

24px

Grande

32px

19. Transitions

Token

Duração

fast

150ms

normal

200ms

slow

300ms

Referência:

transition: all 200ms ease;

Animações devem ser discretas e servir ao feedback/interação.

20. Z-index

Organizar níveis para evitar valores arbitrários:

base
dropdown
sticky
overlay
modal
toast

Status: Estrutura proposta; valores numéricos a definir.

21. Estados dos componentes

Quando aplicável:

Default

Hover

Focus

Active

Disabled

Loading

Error

Success

Empty

22. Acessibilidade

Considerar:

contraste adequado;

foco visível;

áreas de interação adequadas;

labels associados aos campos;

mensagens de erro compreensíveis;

não depender exclusivamente de cor;

comportamento responsivo;

suporte a teclado quando aplicável.

23. Princípios de CSS

Evitar valores isolados

Preferir tokens reutilizáveis:

var(--spacing-md)
var(--radius-md)
var(--text-primary)

Consistência

Componentes equivalentes devem compartilhar tipografia, espaçamento, bordas, raio, estados, comportamento e responsividade.

Conteúdo acima da decoração

Prioridade:

Legibilidade

Hierarquia visual

Interação

Responsividade

Estética

24. Design Tokens — estrutura

Typography
├── Font family
├── Font size
├── Font weight
└── Line height

Color
├── Text
├── Background
├── Border
├── Primary
├── Error
├── Success
└── Warning

Spacing
├── 2xs
├── xs
├── sm
├── md
├── lg
├── xl
├── 2xl
├── 3xl
└── 4xl

Radius
├── sm
├── md
├── lg
└── xl

Shadow
├── sm
├── md
└── lg

Interaction
├── Hover
├── Focus
├── Active
├── Disabled
└── Loading

Motion
├── Fast
├── Normal
└── Slow

25. O que ainda precisa ser confirmado no código

Antes de transformar esta especificação em Design System oficial, levantar:

família tipográfica;

valores HEX/RGB;

cores de fundo;

cores de borda;

cor primária;

valor exato do laranja existente;

border-radius;

sombras;

espaçamentos;

breakpoints;

altura de inputs e botões;

largura máxima;

biblioteca de ícones;

implementação de responsividade;

tecnologia de estilização;

tokens CSS existentes.

Esses valores devem ser extraídos do código/protótipo existente, e não definidos por suposição.

26. Regra de consolidação

Oficial / Confirmado

Valor ou comportamento confirmado na implementação ou por decisão explícita de UX/UI.

Proposta / A confirmar

Referência criada para organizar o Design System, mas ainda não validada.

Não definido

Informação que ainda não possui decisão.

Nenhuma proposta deve ser tratada como identidade visual oficial sem validação.

27. Próxima etapa

Realizar um levantamento técnico do código atual para substituir os valores marcados como A confirmar pelos valores efetivamente utilizados.

O resultado deverá ser a versão consolidada dos Design Tokens oficiais da Plataforma A3, evitando que o sistema visual seja definido por valores inventados ou apenas por convenções genéricas.