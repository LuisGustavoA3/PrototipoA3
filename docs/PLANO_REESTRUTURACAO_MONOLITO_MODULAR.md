# Plano de Reestruturação Arquitetural — A3 Digital

**Projeto:** `LuisGustavoA3/PrototipoA3`  
**Objetivo:** evoluir o frontend para uma arquitetura de **Monólito Modular**, preservando o comportamento existente e permitindo crescimento por módulos de negócio.  
**Público-alvo:** desenvolvedor responsável pelo projeto e GitHub Copilot no VS Code.  
**Abordagem:** incremental, orientada por evidências do código e validada em pequenas etapas.

---

## 1. Objetivo e resultado esperado

Reorganizar gradualmente o código do A3 Digital para que funcionalidades relacionadas ao mesmo domínio fiquem próximas, as responsabilidades sejam explícitas e as dependências entre módulos sejam controladas.

A reestruturação deve:

- manter a aplicação como um único projeto frontend e uma única unidade de build/deploy;
- separar responsabilidades por domínio de negócio;
- evitar que componentes, regras e estados específicos de uma funcionalidade fiquem espalhados em pastas genéricas;
- permitir que módulos sejam desenvolvidos e alterados com menor risco de regressão em outros módulos;
- preservar as rotas, os fluxos, os dados mockados e o comportamento atual, exceto quando uma mudança funcional for explicitamente aprovada;
- preparar a organização para integrações futuras, sem antecipar backend, banco de dados, autenticação ou regras que ainda não foram implementadas;
- viabilizar a migração por etapas, sem uma reescrita total.

**Este documento é um plano de arquitetura e migração, não uma autorização para executar toda a refatoração de uma vez.** O Copilot deve trabalhar fase por fase, apresentar o plano da etapa e aguardar confirmação antes de mudanças que alterem muitos arquivos.

---

## 2. Contexto técnico conhecido

Os arquivos consultados no repositório incluem `package.json`, `src/routes/dashboard.tsx`, `src/components/DashboardContent.tsx` e `src/components/AppSidebar.tsx`.

A aplicação usa, entre outras tecnologias:

- React 19;
- TypeScript;
- TanStack Router com rotas baseadas em arquivos (`createFileRoute`);
- TanStack React Query;
- Vite e TanStack Start;
- Tailwind CSS;
- componentes de interface baseados em Radix UI;
- `lucide-react` para ícones;
- stores locais em arquivos dentro de `src/lib/`, como `pdi-store`, `library-store` e `journey-store`;
- dados mockados e estado local em partes do protótipo.

Exemplos observados:

- `src/routes/dashboard.tsx` compõe `TopBar`, `AppSidebar`, `PageHeader` e `DashboardContent`;
- `src/components/DashboardContent.tsx` concentra diversos elementos da experiência do Mentorado e consome stores locais;
- `src/components/AppSidebar.tsx` concentra a navegação atual do Mentorado;
- `package.json` disponibiliza scripts `dev`, `build`, `lint`, `format` e `format:check`.

Esses exemplos revelam a estrutura atual, mas não são uma auditoria completa de todos os arquivos. Antes de cada migração, o Copilot deve inspecionar os arquivos envolvidos, seus imports, consumidores e rotas relacionadas. Não deve presumir que os exemplos acima representam todos os padrões existentes.

---

## 3. Conceito arquitetural

### 3.1 O que significa Monólito Modular neste projeto

O A3 continuará sendo uma aplicação integrada. A modularidade será obtida pela organização do código e pelas regras de dependência, não pela criação de aplicações, serviços ou deploys separados.

Cada módulo de negócio deve reunir o que pertence à sua responsabilidade: telas, componentes específicos, hooks, tipos, estado, dados de demonstração e acesso a dados, quando aplicável.

### 3.2 Princípios obrigatórios

1. **Organização por domínio:** código de uma mesma capacidade de negócio deve ficar próximo.
2. **Alta coesão:** arquivos que mudam juntos devem, preferencialmente, pertencer ao mesmo módulo.
3. **Baixo acoplamento:** um módulo não deve importar a implementação interna de outro módulo.
4. **Interfaces explícitas:** quando um módulo precisar de algo de outro, deve consumir uma API pública definida pelo módulo fornecedor.
5. **Infraestrutura compartilhada separada do domínio:** utilitários e componentes realmente genéricos podem ficar em `shared`.
6. **Rotas finas:** arquivos de rota devem configurar metadados, compor layout e encaminhar para a página do módulo; não devem concentrar toda a lógica da funcionalidade.
7. **Migração incremental:** não mover todos os arquivos de uma vez.
8. **Comportamento preservado:** a refatoração não deve alterar UX, regras de negócio, dados, validações ou caminhos de navegação sem aprovação.
9. **Evidência antes de decisão:** não criar abstrações ou camadas apenas por convenção. Introduzi-las quando houver uma necessidade concreta.
10. **Sem backend fictício:** não apresentar mocks como dados reais, nem introduzir chamadas de API, autenticação, banco ou permissões não existentes.

### 3.3 O que não é objetivo

Esta iniciativa não deve:

- converter o frontend em microfrontends;
- criar microserviços;
- introduzir NestJS, Supabase, Edge Functions ou outro backend como parte automática desta migração;
- reescrever todas as telas;
- substituir TanStack Router ou as tecnologias atuais;
- transformar cada componente em um módulo independente;
- criar uma camada de serviços sem necessidade real;
- alterar o design visual das telas;
- implementar regras de autorização apenas com base na existência de pastas ou rotas.

---

## 4. Arquitetura-alvo proposta

A estrutura abaixo é um destino evolutivo. Ela não precisa existir inteira desde o primeiro commit. Os diretórios devem ser criados conforme cada área for migrada.

```text
src/
├── app/
│   ├── layouts/
│   ├── providers/
│   ├── router/                 # somente se houver configuração global real
│   └── config/                 # configurações globais reais
│
├── routes/                     # arquivos de rota exigidos pelo roteador
│   ├── dashboard.tsx
│   ├── mentor.tsx
│   ├── administracao.tsx
│   └── ...
│
├── modules/
│   ├── mentorias/
│   │   ├── mentor/
│   │   │   ├── dashboard/
│   │   │   ├── mentorados/
│   │   │   ├── trilhas/
│   │   │   └── sessoes/
│   │   ├── mentorado/
│   │   │   ├── dashboard/
│   │   │   ├── desenvolvimento/
│   │   │   ├── assessment/
│   │   │   ├── jornada/
│   │   │   ├── pdi/
│   │   │   ├── arquivos/
│   │   │   └── sessoes/
│   │   ├── trilhas/             # domínio compartilhado, se a análise justificar
│   │   └── shared/              # elementos específicos do domínio Mentorias
│   │
│   ├── biblioteca/
│   ├── assessment/
│   └── administracao/
│
├── shared/
│   ├── ui/                      # primitivos genéricos de interface
│   ├── components/              # componentes compartilhados entre domínios
│   ├── hooks/                   # hooks genéricos
│   ├── lib/                     # utilitários genéricos
│   └── types/                   # tipos realmente transversais
│
└── ...                          # manter configurações e arquivos de entrada atuais
```

### 4.1 Observações sobre a estrutura

- `src/routes/` permanece porque o projeto usa rotas baseadas em arquivos. Não mover os arquivos de rota para dentro dos módulos sem verificar as exigências do roteador e a geração de rotas.
- `modules/` agrupa funcionalidades de negócio.
- `shared/` é reservado para recursos sem dependência de um único domínio.
- `app/` contém composição e configuração global apenas quando isso trouxer benefício concreto. Não criar pastas vazias ou camadas sem uso.
- A estrutura final pode ser ajustada após inspeção do projeto. O Copilot deve registrar divergências entre a proposta e o código real antes de decidir como migrar.

---

## 5. Organização dos domínios

### 5.1 Mentorias

Mentorias é o domínio que reúne as experiências de Mentor e Mentorado, além das capacidades relacionadas a trilhas e sessões.

A separação `mentor/` e `mentorado/` representa **experiências e funcionalidades diferentes**, não entidades independentes nem sistemas separados.

```text
modules/mentorias/
├── mentor/
│   ├── dashboard/
│   ├── mentorados/
│   ├── trilhas/          # experiência do Mentor relacionada a trilhas
│   └── sessoes/          # experiência do Mentor relacionada a sessões
├── mentorado/
│   ├── dashboard/
│   ├── desenvolvimento/
│   ├── assessment/
│   ├── jornada/
│   ├── pdi/
│   ├── arquivos/
│   └── sessoes/
├── trilhas/              # regras e tipos compartilhados, somente se necessário
└── shared/               # componentes e tipos específicos de Mentorias
```

A localização final de `trilhas/` e `sessoes/` deve ser definida depois de mapear o código existente. Se forem funcionalidades com regras compartilhadas pelas duas experiências, podem constituir subdomínios dentro de `mentorias/`. Se a separação gerar duplicação ou dependências circulares, ajustar a proposta.

### 5.2 Mentor e Mentorado são atuações

Não criar automaticamente uma entidade de domínio independente chamada `Mentor` ou `Mentorado` apenas para representar a pasta. A separação é organizacional e de experiência.

As regras de negócio já estabelecidas para o projeto devem continuar sendo respeitadas, incluindo:

- Mentor é responsável por vincular o Mentorado a uma trilha;
- Mentor pode precisar visualizar a experiência do Mentorado e apoiá-lo nos recursos permitidos;
- a experiência do Mentor possui capacidades adicionais;
- a implementação atual pode ainda não conter os dados, permissões ou relações necessárias para realizar essas operações de forma real.

Essas regras orientam o domínio, mas não autorizam inventar backend, modelo de persistência ou autorização ainda inexistentes.

### 5.3 Biblioteca

Biblioteca deve concentrar funcionalidades e regras próprias de conteúdo, eixos, competências e consulta de conteúdos.

Antes de mover `library-store` ou componentes atuais, mapear todos os consumidores e verificar se o store contém somente dados da Biblioteca ou se também dá suporte a outras telas. O fato de um arquivo estar em `src/lib/` não prova que seja genérico.

### 5.4 Assessment

Assessment deve agrupar a experiência e as funcionalidades específicas de avaliações e resultados, caso a análise do código confirme esse limite. Não migrar nem redefinir regras de assessment por suposição.

### 5.5 Administração

Administração deve agrupar funcionalidades administrativas confirmadas no produto, como usuários, empresas ou permissões somente quando já houver escopo ou implementação definida para elas.

A rota atual `/administracao` é um placeholder. Não implementar funcionalidades administrativas durante a reorganização apenas porque elas aparecem como possíveis áreas futuras.

---

## 6. Responsabilidades por camada

### 6.1 Rotas — `src/routes/`

Responsabilidades:

- declarar a rota com a API correta do TanStack Router;
- definir metadados da página (`head`), quando aplicável;
- selecionar layout e página do módulo;
- lidar com parâmetros de rota e integração com o roteador.

Evitar:

- regras de negócio complexas;
- grandes blocos de interface;
- stores ou mocks extensos;
- duplicação da lógica da página.

Exemplo conceitual de rota fina:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { MentorDashboardPage } from "@/modules/mentorias/mentor/dashboard";

export const Route = createFileRoute("/mentor")({
  component: MentorDashboardPage,
});
```

Este exemplo é ilustrativo. Antes de aplicá-lo, confirmar a forma como o projeto exporta/importa componentes, configura aliases e gera o arquivo de rotas. Preservar os metadados existentes quando houver.

### 6.2 Páginas e componentes de funcionalidade

Uma página do módulo compõe os componentes necessários para a experiência específica. Componentes reutilizados somente dentro de uma funcionalidade devem permanecer próximos dela.

Exemplos possíveis:

- `MentorDashboardPage`;
- `MentorOverviewCards`;
- `MentoredPeopleTable`.

Os nomes são sugestões; adotar a convenção predominante no repositório quando identificada.

### 6.3 Hooks

- Hooks específicos de um domínio ficam dentro do módulo.
- Hooks compartilhados só vão para `shared/hooks/` quando forem independentes do domínio e usados por mais de uma área, ou quando houver uma razão clara para compartilhamento.
- Não mover hooks apenas para centralizar arquivos.

### 6.4 Estado e stores

- Estado específico de uma funcionalidade deve ficar próximo da funcionalidade.
- Stores usados por várias funcionalidades devem ser classificados após mapear os consumidores.
- Preservar comportamento de persistência local, notificações de mudança, validações e formatos atuais durante a migração.
- Não trocar estado local por React Query ou por API remota como parte automática da reorganização.
- Não mudar a origem dos dados ou a semântica dos estados durante uma simples movimentação de arquivos.

### 6.5 Serviços e acesso a dados

Criar `services/` quando existir lógica de acesso a dados ou uma integração que justifique a separação. Para mocks simples, uma pasta `data/` ou arquivo de fixtures pode ser suficiente.

Não criar serviços vazios, clientes HTTP fictícios ou abstrações de API sem necessidade comprovada.

### 6.6 Tipos

- Tipos usados somente por uma funcionalidade ficam junto dela.
- Tipos compartilhados por um módulo podem ficar em `types.ts` ou `types/`, de acordo com o tamanho e padrão do módulo.
- Tipos transversais devem ficar em `shared/types/` apenas se forem realmente independentes dos domínios.
- Evitar tipos duplicados e não converter automaticamente tipos existentes sem verificar todos os usos.

### 6.7 Componentes de interface

- Componentes primitivos e genéricos, como os elementos base de UI já utilizados pelo projeto, podem continuar em `components/ui/` durante a transição.
- Componentes visuais de uma área devem ficar dentro do módulo dessa área.
- `AppSidebar`, `TopBar` e `PageHeader` só devem ser movidos para `shared` ou `app` após confirmar sua abrangência e as dependências atuais.
- Não duplicar um componente compartilhado apenas para dar aparência de independência a um módulo. Se Mentor e Mentorado precisam de variações, preferir composição ou propriedades bem definidas, desde que isso preserve a UX atual.

### 6.8 Utilitários

`cn` e outras funções de formatação podem ser compartilhadas se não dependerem de regra de negócio específica. Funções específicas de PDI, Biblioteca ou Mentorias devem permanecer no módulo correspondente.

---

## 7. Regras de dependência entre módulos

Adotar as seguintes regras como objetivo arquitetural:

1. `routes/` pode importar páginas públicas de `modules/` e elementos globais de `app/` ou `shared/`.
2. Um módulo pode importar sua própria implementação interna livremente, desde que não crie dependências circulares dentro do módulo.
3. Um módulo não deve importar arquivos internos de outro módulo.
4. Para compartilhar comportamento entre módulos, expor uma API pública mínima no `index.ts` do módulo fornecedor ou em um ponto de entrada equivalente.
5. `shared/` não deve importar componentes, stores ou regras de negócio de `modules/`.
6. Módulos não devem importar diretamente detalhes privados de outros módulos por atalhos de caminho.
7. Não criar uma cadeia de abstrações para operações simples. A API pública deve ser proporcional à necessidade real.
8. Evitar dependências circulares. Se `A` importa `B` e `B` importa `A`, reavaliar a responsabilidade e o limite dos módulos.
9. A regra de dependência deve ser introduzida gradualmente; não adicionar ferramenta de lint arquitetural antes de entender a configuração atual e avaliar seu custo.
10. Durante a migração, os imports antigos só devem ser removidos depois de atualizar todos os consumidores e validar o build.

Exemplo de fronteira:

```text
modules/mentorias/mentor
          |
          | importa somente a API pública
          v
modules/mentorias/trilhas
```

Evitar:

```text
modules/mentorias/mentor
          |
          | importa um componente privado
          v
modules/mentorias/trilhas/components/InternalTrailCard
```

Se um componente visual precisar ser compartilhado, avaliar se ele pertence a `mentorias/shared/` ou se a funcionalidade deve expor uma composição pública. Não mover para `shared/` se ainda contiver regras específicas de negócio.

---

## 8. Exemplo aplicado: Dashboard do Mentor

O primeiro caso de uso da arquitetura será o Dashboard do Mentor. A estrutura proposta deve ser mínima e crescer conforme a funcionalidade exigir.

```text
src/
├── routes/
│   └── mentor.tsx
└── modules/
    └── mentorias/
        └── mentor/
            └── dashboard/
                ├── components/
                │   ├── MentorDashboardPage.tsx
                │   ├── MentorOverviewCards.tsx
                │   └── MentoredPeopleTable.tsx
                ├── data/
                │   └── mentorDashboard.mock.ts
                ├── types.ts
                └── index.ts
```

A estrutura é uma referência. Não criar todos os arquivos antecipadamente se o primeiro dashboard não precisar de componentes separados.

### 8.1 Responsabilidade dos arquivos

- `src/routes/mentor.tsx`: define a rota `/mentor`, metadados e composição de layout. Nesta primeira etapa, não criar a Sidebar/TopBar específicas do Mentor; isso será tratado separadamente.
- `MentorDashboardPage.tsx`: compõe o cabeçalho e as seções do dashboard.
- `MentorOverviewCards.tsx`: exibe os indicadores definidos para a visão geral.
- `MentoredPeopleTable.tsx`: apresenta a lista mockada de mentorados.
- `mentorDashboard.mock.ts`: contém dados demonstrativos claramente identificados como mock.
- `types.ts`: declara os tipos usados exclusivamente pelo dashboard.
- `index.ts`: expõe apenas a página ou os elementos necessários à rota; não exportar toda a implementação interna indiscriminadamente.

### 8.2 Escopo funcional inicial

A primeira versão pode conter:

- título e descrição do Dashboard do Mentor;
- saudação, se houver uma fonte de nome já existente e apropriada; caso contrário, usar texto neutro ou dado demonstrativo explicitamente marcado;
- cards de Mentorados, Trilhas e Sessões;
- lista de mentorados com nome, trilha, status e ação visual de acesso.

Não tratar números de exemplo (como 12 mentorados, 3 trilhas e 8 sessões) como dados reais. Não implementar navegação de detalhe funcional até confirmar que existe rota e experiência de destino. Enquanto não existir, a ação deve ser omitida ou apresentada de forma não enganosa, conforme decisão aprovada.

### 8.3 Layout

Na etapa inicial, não desenvolver a Sidebar ou a TopBar específicas do Mentor. O layout deve ser deliberadamente simples e não deve copiar `DashboardContent`, pois esse componente representa a experiência do Mentorado e contém regras e conteúdo próprios.

---

## 9. Plano de migração por fases

Cada fase deve ser uma unidade pequena, revisável e validável. O Copilot deve mostrar quais arquivos pretende alterar, por que e como vai validar, antes de executar.

### Fase 0 — Inventário e linha de base

**Objetivo:** conhecer a estrutura real antes de mover arquivos.

Tarefas:

- [ ] verificar a branch atual e o estado do Git;
- [ ] confirmar que alterações locais do usuário não serão sobrescritas;
- [ ] inspecionar `src/`, configuração do Vite/TanStack Router e geração de rotas;
- [ ] listar rotas existentes e seus componentes principais;
- [ ] identificar stores em `src/lib/` e mapear seus consumidores;
- [ ] identificar componentes globais, componentes específicos de domínio, hooks e utilitários;
- [ ] verificar scripts de `package.json`;
- [ ] executar `npm run lint` e `npm run build`, se o ambiente permitir;
- [ ] registrar falhas preexistentes antes da migração;
- [ ] apresentar um mapa atual → destino e pontos de risco.

**Critério de conclusão:** inventário revisável, com caminhos reais e dependências identificadas. Não mover arquivos nesta fase.

### Fase 1 — Criar a estrutura modular para a nova funcionalidade

**Objetivo:** validar a arquitetura em uma área pequena, sem migrar telas existentes.

Tarefas:

- [ ] criar apenas os diretórios necessários para `modules/mentorias/mentor/dashboard/`;
- [ ] criar a rota `/mentor` em `src/routes/mentor.tsx`, após confirmar que não existe rota conflitante;
- [ ] criar a página de dashboard e os componentes mínimos necessários;
- [ ] isolar os mocks do dashboard;
- [ ] criar tipos locais se forem úteis;
- [ ] manter a rota `/dashboard` e o `DashboardContent` atuais inalterados;
- [ ] manter Sidebar/TopBar específicas do Mentor fora do escopo desta fase;
- [ ] validar navegação, responsividade básica, lint e build.

**Critério de conclusão:** `/mentor` funciona, o dashboard do Mentorado permanece inalterado e a primeira funcionalidade segue a estrutura modular.

### Fase 2 — Definir fronteiras públicas do módulo

**Objetivo:** estabelecer um padrão realista de importação.

Tarefas:

- [ ] definir o que a rota precisa importar do dashboard;
- [ ] criar `index.ts` somente se ele simplificar e tornar explícita a API pública;
- [ ] evitar exportar mocks, componentes internos e tipos que não precisem ser públicos;
- [ ] revisar imports para evitar atalhos a detalhes internos;
- [ ] documentar as regras adotadas em um breve README do módulo se isso ajudar o desenvolvimento futuro.

**Critério de conclusão:** a rota importa a página por um ponto de entrada estável, sem exportações desnecessárias.

### Fase 3 — Migrar uma funcionalidade existente de baixo risco

**Objetivo:** validar a estratégia de migração em código existente antes de aplicá-la em áreas complexas.

Tarefas:

- [ ] escolher uma funcionalidade pequena após o inventário;
- [ ] listar todos os consumidores e rotas afetados;
- [ ] mover os arquivos preservando seus conteúdos e comportamento;
- [ ] atualizar imports e aliases;
- [ ] validar os fluxos afetados;
- [ ] executar lint e build;
- [ ] revisar o diff para confirmar que não houve mudanças funcionais acidentais.

**Critério de conclusão:** funcionalidade migrada sem regressões identificadas. A funcionalidade escolhida deve ser definida com base no inventário, não presumida neste documento.

### Fase 4 — Migrar as áreas de Mentorado

**Objetivo:** organizar as funcionalidades existentes de Mentorado sem alterar sua experiência.

Possíveis agrupamentos a confirmar no inventário:

- Dashboard;
- Sessões de Mentoria;
- Conteúdo;
- Meu Assessment;
- Jornada de Desenvolvimento;
- Plano de Ação (PDI);
- Arquivos Compartilhados;
- Informações Pessoais;
- Minhas Estatísticas.

Tarefas:

- [ ] mapear rota, componentes, hooks, stores, tipos e dependências de cada funcionalidade;
- [ ] priorizar uma funcionalidade por vez;
- [ ] mover primeiro os componentes específicos da funcionalidade;
- [ ] mover estado e lógica apenas após confirmar seus consumidores;
- [ ] manter componentes globais onde estão até uma fase própria;
- [ ] atualizar imports e validar cada fluxo;
- [ ] preservar rotas públicas e links atuais.

**Critério de conclusão:** funcionalidades migradas individualmente, com rotas e comportamento preservados.

### Fase 5 — Organizar Biblioteca e Assessment

**Objetivo:** delimitar os módulos transversais de Biblioteca e Assessment.

Tarefas:

- [ ] identificar quais arquivos representam regras da Biblioteca e quais são apenas componentes genéricos;
- [ ] mapear uso de `library-store` em Dashboard, Biblioteca, estatísticas e outras áreas;
- [ ] decidir onde o store deve residir sem duplicá-lo;
- [ ] repetir a análise para dados, componentes e rotas de Assessment;
- [ ] definir APIs públicas mínimas para usos por outros módulos;
- [ ] validar conteúdos, estados e resultados após cada mudança.

**Critério de conclusão:** domínios organizados sem duplicação de stores nem dependências circulares.

### Fase 6 — Organizar componentes globais e `app/`

**Objetivo:** separar layout e infraestrutura global somente após conhecer seus consumidores.

Tarefas:

- [ ] analisar `AppSidebar`, `TopBar`, `PageHeader`, `use-sidebar` e utilitários compartilhados;
- [ ] decidir se pertencem a `shared/` ou `app/` com base na responsabilidade real;
- [ ] manter a Sidebar/TopBar do Mentorado funcionando;
- [ ] desenvolver posteriormente a navegação específica do Mentor sem misturar as duas experiências;
- [ ] não mover componentes só para preencher a árvore de diretórios;
- [ ] verificar providers, router e configuração global antes de criar pastas em `app/`.

**Critério de conclusão:** componentes globais têm localização e responsabilidade justificadas, e as telas existentes continuam funcionando.

### Fase 7 — Consolidar regras arquiteturais

**Objetivo:** reduzir a chance de a estrutura voltar a se desorganizar.

Tarefas:

- [ ] documentar as fronteiras dos módulos;
- [ ] documentar como criar uma nova funcionalidade;
- [ ] definir convenções de imports e exports;
- [ ] identificar dependências circulares e imports cruzando fronteiras;
- [ ] considerar regras de lint específicas somente se o benefício superar a complexidade;
- [ ] revisar se `shared/` contém código realmente genérico;
- [ ] atualizar a documentação do projeto.

**Critério de conclusão:** há uma convenção clara e exemplos reais que podem ser seguidos por desenvolvedores e Copilot.

---

## 10. Procedimento obrigatório para cada etapa do Copilot

Para cada fase ou lote de arquivos, o Copilot deve seguir este procedimento:

1. **Inspecionar:** ler os arquivos relevantes e seguir os imports até entender os consumidores.
2. **Resumir o estado atual:** explicar o que o código faz hoje, com referências a caminhos reais.
3. **Propor a mudança:** listar arquivos a criar, mover, alterar e excluir, justificando cada item.
4. **Apontar riscos:** identificar rotas, imports, stores, persistência local e fluxos potencialmente afetados.
5. **Aguardar aprovação:** não iniciar alterações em lote antes de o usuário aprovar o plano.
6. **Executar uma etapa pequena:** evitar misturar reorganização arquitetural e novas funcionalidades.
7. **Validar:** rodar os scripts adequados, quando disponíveis, e informar resultados reais.
8. **Revisar o diff:** verificar se houve alterações não solicitadas, remoções, mudanças de conteúdo ou formatação excessiva.
9. **Relatar:** resumir arquivos alterados, decisões tomadas, validações, limitações e próximo passo recomendado.

Se o Copilot não puder executar um comando ou não tiver acesso ao ambiente, deve informar isso claramente e fornecer o comando para o usuário executar. Não deve afirmar que lint, build ou testes passaram sem ter executado e observado o resultado.

---

## 11. Regras de segurança para a refatoração

O Copilot deve obedecer a estas restrições:

- Não sobrescrever mudanças locais do usuário.
- Não executar `git reset --hard`, `git clean`, `git checkout` destrutivo ou comandos de reescrita de histórico.
- Não executar `git push --force` nem alterar branches remotas.
- Não excluir arquivos antigos antes de confirmar que todos os consumidores foram migrados e que a nova implementação compila.
- Não mover ou renomear muitos arquivos em uma única etapa sem aprovação explícita.
- Não instalar dependências ou alterar versões de pacotes sem explicar a necessidade e pedir aprovação.
- Não editar arquivos gerados pelo roteador manualmente sem verificar como são gerados.
- Não mudar aliases de importação sem conferir `tsconfig`, Vite e configuração do roteador.
- Não mudar os dados mockados ou o comportamento das stores como efeito colateral de uma movimentação.
- Não criar entidades, permissões, fluxos, campos ou regras de negócio que não estejam documentados ou implementados.
- Não tratar os números e nomes de demonstração como dados reais.
- Não remover código aparentemente não utilizado sem verificar referências e caminhos dinâmicos.
- Não misturar a construção da Sidebar/TopBar do Mentor com a primeira implementação do Dashboard do Mentor, salvo aprovação específica.

---

## 12. Estratégia para stores e estado atual

A aplicação tem stores em `src/lib/`, incluindo `pdi-store`, `library-store` e `journey-store`. A localização e o nome não bastam para decidir se devem ser movidos para um módulo.

Para cada store:

1. identificar estado que controla;
2. listar todas as funções exportadas;
3. buscar todos os imports no repositório;
4. identificar quais rotas e componentes dependem dele;
5. verificar persistência local, subscriptions e efeitos colaterais;
6. classificar como específico de um módulo, compartilhado dentro de Mentorias ou transversal;
7. propor a nova localização;
8. migrar em uma etapa própria;
9. testar os consumidores antes de remover o caminho antigo.

Não criar uma segunda store para os mesmos dados. Não manter cópias sincronizadas do mesmo estado em módulos diferentes. Se uma funcionalidade depender de dados de outro módulo, definir uma interface de consumo em vez de duplicar a fonte de verdade.

---

## 13. Rotas e layouts

As rotas atuais são arquivos em `src/routes/` e usam `createFileRoute`. Essa estrutura deve ser preservada.

Para cada rota:

- manter o identificador esperado por `createFileRoute`;
- preservar `head`, metadados e descrição, salvo mudança intencional;
- verificar links internos, `navigate`, parâmetros e geração automática de rotas;
- verificar se há dependências de layout ou hooks globais;
- não presumir que mover a página altera ou não o caminho público — confirmar pela configuração real.

O layout pode ser extraído para `app/layouts/` quando houver uma estrutura comum bem identificada. Não fazer isso preventivamente. A rota pode continuar importando componentes globais enquanto a arquitetura é migrada.

### Mentor e Mentorado

A experiência de Mentor não deve reutilizar automaticamente o dashboard do Mentorado. Pode reutilizar componentes genéricos quando forem de fato compartilhados, mas a composição, os indicadores e as ações devem refletir cada experiência.

A rota `/mentor` deve ser adicionada sem alterar `/dashboard`. A Sidebar e a TopBar específicas do Mentor ficam para uma etapa posterior.

---

## 14. Critérios de aceite globais

A reestruturação será considerada concluída quando:

- [ ] as funcionalidades migradas continuarem acessíveis pelas mesmas rotas, salvo mudanças aprovadas;
- [ ] o Dashboard do Mentorado e seus fluxos continuarem funcionando;
- [ ] o Dashboard do Mentor estiver isolado no módulo correspondente;
- [ ] os módulos tiverem responsabilidades identificáveis;
- [ ] as dependências entre módulos forem explícitas e não houver ciclos conhecidos;
- [ ] componentes genéricos não dependerem de regras de negócio de um módulo;
- [ ] stores não estiverem duplicados nem tiverem mudado de comportamento acidentalmente;
- [ ] dados mockados estiverem identificados como demonstração;
- [ ] `npm run lint` e `npm run build` forem executados e seus resultados registrados, ou a impossibilidade de execução for documentada;
- [ ] o diff não contiver alterações funcionais não solicitadas;
- [ ] a documentação de arquitetura estiver atualizada;
- [ ] o usuário tiver revisado as etapas concluídas antes de iniciar as seguintes.

---

## 15. Modelo de relatório após cada etapa

Ao finalizar cada etapa, o Copilot deve responder neste formato:

### Etapa concluída
Resumo curto da mudança realizada.

### Arquivos alterados
- `caminho/arquivo`: motivo da alteração.

### Decisões arquiteturais
Quais fronteiras, interfaces ou responsabilidades foram definidas e por quê.

### Compatibilidade
Rotas, imports, stores e fluxos que foram preservados ou afetados.

### Validação
- `npm run lint`: resultado observado;
- `npm run build`: resultado observado;
- verificações manuais: realizadas ou pendentes.

### Pendências e riscos
O que ainda depende de inspeção, aprovação ou implementação futura.

### Próxima etapa sugerida
Uma única etapa pequena, com objetivo claro.

---

## 16. Prompt inicial para o GitHub Copilot Chat

Copie o texto abaixo para iniciar o trabalho. Ele deve ser usado primeiro em modo de planejamento, antes de autorizar alterações.

> Quero iniciar a reestruturação gradual do projeto para uma arquitetura de Monólito Modular seguindo o documento `PLANO_REESTRUTURACAO_MONOLITO_MODULAR.md`.
>
> **Nesta primeira interação, não altere arquivos.**
>
> 1. Inspecione a estrutura real do repositório, começando por `package.json`, configuração do Vite/TanStack Router, `src/routes/`, componentes compartilhados, hooks, stores e utilitários.
> 2. Identifique rotas, módulos funcionais atuais, stores, dependências e arquivos gerados.
> 3. Para cada store e componente que possa ser compartilhado, identifique os consumidores antes de recomendar sua movimentação.
> 4. Compare a estrutura atual com a arquitetura-alvo do documento.
> 5. Apresente um inventário com caminhos reais, um mapa de migração atual → destino e os principais riscos.
> 6. Recomende uma sequência incremental de fases, priorizando baixo risco e preservação do comportamento.
> 7. Separe fatos encontrados no código de hipóteses e recomendações.
> 8. Informe quais comandos de validação estão disponíveis e, se possível, registre a linha de base de lint/build sem alterar arquivos.
>
> Não crie backend, banco, API, permissões ou regras de negócio. Não faça refatoração em lote. Não mova arquivos nem altere código nesta etapa. Ao final, aguarde minha aprovação para iniciar a primeira mudança.

---

## 17. Decisão recomendada

A recomendação é começar com **Fase 0 — Inventário e linha de base** e, após aprovar o resultado, usar o Dashboard do Mentor como primeiro exemplo real da nova arquitetura.

Isso permite validar a organização proposta sem colocar em risco o Dashboard do Mentorado, que já concentra comportamento e estado existentes. A migração das funcionalidades antigas deve acontecer somente depois que o primeiro módulo e suas fronteiras estiverem claros.

**Princípio final:** reorganizar primeiro com evidências, migrar em lotes pequenos, validar a cada etapa e preservar o comportamento do produto.
