# Administração — decisões e primeira etapa de telas

## Escopo e perfis

O protótipo mostra a visão de A3 Super Admin, utilizando a conta já existente.
Consultor A3 e A3 Super Admin têm inicialmente as mesmas permissões no escopo
planejado. Cadastro, login e provisionamento de contas não fazem parte desta etapa.
Admin Empresa tem experiência de mentorado com Agenda do Líder; Usuário é mentorado.
Não presumir que Admin Empresa possa administrar o desenvolvimento de outras pessoas.

## Menu adotado

- Dashboard.
- Desenvolvimento: Mentorados, Trilhas, Banco de Ações, Ferramentas de Avaliação.
- Usuários.
- Empresas.
- Configurações, com Contatos e localização, Ajuda e FAQ e Notificações.

Programas passa a Trilhas; Coachees passa a Mentorados; Book de Ações passa a
Banco de Ações. Planos & Configurações foi retirado. Configurações é geral, fora
do grupo Desenvolvimento. Biblioteca fica fora desta rodada de definição e do
menu administrativo atual; a Biblioteca do mentorado não foi alterada.

## Regras acordadas

- Trilha é uma pasta individual, alimentada com informações de desenvolvimento,
  não um modelo reutilizável. Uma trilha ativa por pessoa; histórico selecionável.
- Pode concluir, cancelar ou suspender preservando histórico; transições ainda
  não estão implementadas nestas telas iniciais.
- Empresa contrata uma quantidade de trilhas. Uma associação consome a cota e a
  conclusão não libera a vaga. Distribuição pela equipe A3. Tolerância de vencimento
  ainda precisa de duração e comportamento definidos.
- Disponibilidade de assessments decorre da contratação da empresa. Distribuição
  individual e visibilidade exata dos resultados ainda precisam ser detalhadas.
- Resultados são inseridos manualmente pela A3; reaplicações preservam histórico.
- Jornada definida pela A3; mentorado registra progresso. PDI colaborativo, com
  autoria e conclusão direta por mentor ou mentorado.
- Sessões têm Monday como fonte de verdade, com consulta no Portal. Em falhas,
  manter últimos dados e oferecer nova tentativa. As novas trilhas de demonstração
  não estão vinculadas a registros reais no Monday.
- Documentos podem ser enviados pelos envolvidos autorizados. Anotações privadas
  por padrão, com compartilhamento explícito a implementar.
- Banco de Ações recebe cópias automáticas dos PDIs. Visibilidade global/empresa
  ainda em discussão; não publicar ações de uma empresa para outra por suposição.
- Ajuda comum aos públicos, mantida pela A3. Integração do FAQ com o Assistente
  exige publicação controlada, ainda não implementada.
- Notificações terão discussão própria: plataforma, e-mail e push previstos,
  preferências individuais com exceções obrigatórias. Nenhum envio nesta etapa.

## Telas criadas

As novas páginas estão em `src/modules/administracao/pages/`; fixtures em
`lib/development-demo.ts`; composição visual em `components/ManagementShell.tsx`.

| URL                                                     | Comportamento inicial                                                      |
| ------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/mentor/mentorados`                                    | Busca por nome/e-mail/empresa, filtro de empresa, acesso ao acompanhamento |
| `/mentor/mentorados/:personId`                          | Seleção de trilha, com ativa e histórico identificados                     |
| `/mentor/mentorados/:personId/trilhas/:trailId?secao=…` | Página exclusiva da trilha selecionada, com seção reabrível por URL        |
| `/mentor/trilhas`                                       | Lista pesquisável de pastas individuais com link direto                    |
| `/mentor/empresas`                                      | Listagem pesquisável com acesso à página de cada empresa                   |
| `/mentor/empresas/:companyId`                           | Página exclusiva com cotas e lista pesquisável de usuários                 |
| `/mentor/usuarios?usuario=…&empresa=…`                  | Consulta demonstrativa de conta, sem editar o perfil do operador           |
| `/mentor/ferramentas-de-avaliacao`                      | Catálogo demonstrativo pesquisável                                         |
| `/mentor/banco-de-acoes`                                | Estado vazio que explicita a integração futura ao PDI                      |
| `/mentor/configuracoes`                                 | Seções institucionais, prévia da ajuda atual e limites de implementação    |

O acompanhamento oferece Assessments, Jornada, PDI, Sessões, Documentos e Anotações,
sem exigir uma página de visão geral. Associação de assessment e anotação privada
são interações locais de demonstração; não há gravação centralizada nem persistência
após desmontar a tela. Os demais fluxos mostram estados vazios explícitos.

Não foi conectado o cadastro real de usuários nem o store pessoal de PDI às pessoas
fictícias. Criação/edição de trilhas, contratos, catálogo, publicação de ajuda,
resultados, documentos e edição colaborativa do PDI são próximas etapas.

## Validação

Testes verificam renderização das novas rotas, busca, seleção de trilha, associação
demonstrativa, consulta de sessões sem edição e retorno de Usuários para Empresas.
Ainda é necessária revisão visual com o responsável antes de ampliar o CRUD.

## Ajuste de navegação

Empresas e trilhas abrem páginas exclusivas, sem detalhes expandidos nas listagens.
As listas usam linhas e busca, evitando a organização em dois cartões por linha.
O nome do perfil de acesso não é exibido no cabeçalho. Links anteriores por query
são redirecionados para as páginas individuais. O retorno de Usuários preserva
a empresa de origem.

## Configurações editáveis e página de usuário

Contatos e localização possuem formulário com WhatsApp, telefone, e-mail, dias e
horários de atendimento, unidade, edifício, endereço, cidade, CEP e URLs do Maps.
O FAQ lista todas as perguntas existentes, por categoria, com pergunta e resposta
editáveis. As respostas inicialmente vazias não foram preenchidas com conteúdo
inventado. As páginas de ajuda do mentorado consomem os valores salvos.

Notificações permite Push e e-mail, Somente push ou Somente e-mail. WhatsApp é
obrigatório, sem opção de desativação. Esta configuração guarda a preferência;
o envio real de notificações continua dependendo da integração futura.

Os dados institucionais são validados e persistidos em localStorage, sob a chave
`a3-institution-settings-v1`, com confirmação de salvamento e erro visível em caso
de falha. Não há persistência em servidor nem propagação entre dispositivos.
URLs de mapa são restritas a HTTPS do Google Maps. Formulários trabalham com
rascunhos e só publicam alterações ao salvar a seção.

Usuários agora tem uma listagem independente; `/mentor/usuarios/:userId` é a página
de dados da conta selecionada. Os links da empresa preservam o parâmetro `empresa`
para retorno. URLs antigas com `?usuario=…` redirecionam para a página individual.

## Sessões por empresa — Testes

A empresa `testes` representa o quadro de testes `18435417982` já utilizado pela
integração individual. O vínculo explícito fica em `server/company-boards.ts`.
O contrato de Testes permanece não informado, sem inventar limite de trilhas.

`GET /api/empresas/sessoes?empresa=testes` consulta os itens de todo o quadro e seus
subitens, incluindo as páginas seguintes via cursor. Não utiliza o item fixo do Luis
nem aceita IDs arbitrários de quadro enviados pelo frontend. A integração individual
existente foi preservada. Referências da API: [items_page](https://developer.monday.com/api-reference/reference/items-page)
e [next_items_page](https://developer.monday.com/api-reference/reference/next-items-page).

Na página de Testes, Sessões de mentoria agrupa os registros por mentorado, permite
busca e filtro por situação e exibe consultor, datas e cargas horárias. Não há edição
manual. Há atualização a cada minuto e por botão; falhas mantêm o último resultado
disponível na consulta. O horário exibido é o da consulta bem-sucedida ou do snapshot.

Em desenvolvimento, a consulta exige `MONDAY_API_TOKEN` no processo Node (pode vir de
`.env.local`, sem prefixo `VITE_`). A credencial não estava presente nesta sessão;
validação com os dois registros reais permanece pendente. Os testes simulam Luis e
João para verificar que a consulta não fica limitada a um mentorado.

Em produção estática, usa o snapshot completo já gerado por
`scripts/generate-monday-snapshot.mjs`, validando que pertence ao quadro associado.
Atualizar a tela nesse ambiente relê o snapshot; não consulta diretamente o Monday.
Para atualização em tempo real em produção, hospedar a API no backend do Portal.
O token e o cliente de consulta do Monday permanecem fora do bundle do navegador.

Os itens do Monday não criam automaticamente contas de usuários do Portal nem
associações de trilha por semelhança de nomes; esse vínculo ainda será definido.

## Informações pessoais e navegação compartilhada

Gerenciar usuário apresenta os campos dos tipos compartilhados `Profile` e
`Address`, incluindo contato, dados profissionais e endereço. Campos sem dados
da pessoa selecionada mostram Não informado; não são preenchidos com os dados
do operador da plataforma. A consulta usa `PersonalInfoDetails`; o formulário de
edição do próprio perfil continua separado. Permissões aparecem na seção Acesso.
Os links laranja duplicados da página de usuário foram retirados; a navegação
pela empresa de origem permanece no breadcrumb superior.

Mentorias também exibe breadcrumbs, incluindo os grupos de Desenvolvimento e
Ajuda e os nomes de conteúdos e eixos da Biblioteca. Grupos sem página própria
não geram links inexistentes. O perfil compartilhado mostra somente o breadcrumb
do módulo de origem. A altura do Assistente acomoda essa navegação sem ocultar
a área de conversa.

## Breadcrumbs administrativos

O layout administrativo exibe navegação estrutural com separadores chevron, links
para os níveis anteriores e página atual com `aria-current="page"`, sem link.
Os nomes de empresas, mentorados, usuários e trilhas acompanham a rota; o contexto
de empresa é preservado ao consultar um usuário. Os níveis quebram linha em telas
menores. O componente utiliza os primitivos existentes de `ui/breadcrumb.tsx`.

## Apresentação das trilhas

Trilhas usam nomes individuais de pessoas e ciclo, tanto na Administração quanto
em Minhas trilhas do mentorado. A listagem administrativa apresenta ID numérico,
capa, título, matrículas atuais e status Ativo (verde) ou Inativo (vermelho),
com busca por título/ID e filtro de status. Os identificadores internos das
rotas foram mantidos. A capa inicial é um SVG local reutilizável.

Matrículas atuais são contadas pelos vínculos ativos de matrícula, independentemente
de a trilha estar ativa ou inativa. Esses vínculos não são o mesmo que vagas
contratadas disponíveis; concluir uma trilha não devolve uma vaga ao contrato.
O estado de acompanhamento anterior continua separado do indicador visual de
disponibilidade da trilha, sem alterar regras de edição desta etapa.

Minhas trilhas usa o nome de Luis Gustavo Ribeiro nos ciclos 2026, 2025 e 2024,
com uma trilha ativa e ciclos anteriores inativos. A seleção antiga gravada no
navegador é migrada para os novos nomes, preservando a seleção com conteúdo ativo.

## Trilha de Luis compartilhada entre os módulos

O usuário local `luis-gustavo` e suas trilhas 601, 602 e 603 aparecem nas listagens
administrativas. Metadados são obtidos do mesmo catálogo usado em Minhas trilhas,
com ID interno administrativo `trilha-luis-601` para o ciclo com conteúdo existente.
A edição administrativa de nome, capa e status atualiza os dois módulos; a seleção
não perde o conteúdo quando o nome muda. Esses metadados são guardados no navegador.

O ciclo 601 utiliza os mesmos stores de assessments, Jornada, PDI e arquivos do
mentorado. A Administração permite editar assessments, adicionar/editar itens da
Jornada e ações do PDI, além de adicionar/editar documentos e anotações. Resultados
de assessments nesta etapa correspondem à situação já modelada; relatórios externos
podem ser compartilhados como documentos. Não foi criada uma segunda cópia desses
dados no módulo administrativo. Os ciclos anteriores não recebem os dados do ciclo
atual e outros mentorados não têm acesso ao conteúdo de Luis.

Sessões de Luis utilizam a consulta individual já existente e continuam somente
leitura. Documentos novos guardam a referência do arquivo no navegador e podem ser
baixados pelo mentorado durante a sessão; upload administrativo aceita até 10 MB.
Os arquivos iniciais continuam sendo registros de exemplo, sem conteúdo binário real.
Anotações são privadas por padrão; somente as marcadas para compartilhamento aparecem
na Jornada do mentorado. Metadados do catálogo são persistidos em localStorage; os
conteúdos de desenvolvimento e arquivos continuam no estado local em memória, sem
backend de persistência e sem envio ao Monday.

## Informações Pessoais independente dos módulos

`/informacoes-pessoais` utiliza exclusivamente `src/shared/pages/InformacoesPessoaisPage.tsx`
e o formulário compartilhado. Não possui topbar, sidebar ou breadcrumb, mesmo quando
aberta pelos antigos links com `modulo=administracao`. O botão Voltar leva ao Hub.
Essa decisão substitui a composição anterior por layout do módulo de origem.

## Catálogo de avaliações, contratação e tabela de usuários

O catálogo inicial tem exatamente: Âncoras de Carreira, CliftonStrengths, HTM,
HumanGuide, Janusian, MBTI, Perfil Caliper e PERFIL DE GESTÃO: Pipeline de Liderança.
Todas começam ativas; somente Pipeline começa gratuito. O cadastro administrativo
permite adicionar e editar nome, imagem, atividade e gratuidade. A imagem aceita
URL HTTPS ou PNG/JPG/WebP de até 1 MB; sem imagem há um espaço reservado. Não foram
fabricados logotipos das ferramentas.

O catálogo é compartilhado e persistido no navegador em `a3-evaluation-tools-v1`.
As aplicações têm vínculo pelo ID da ferramenta, para que renomear uma ferramenta
não altere o vínculo contratual nem perca a aplicação. Associar/editar aplicações
utiliza uma ferramenta do catálogo, sem inventar nomes fora dele.

Empresas permite selecionar as ferramentas contratadas. Vínculos locais ficam em
`a3-company-assessment-contracts-v1`. Testes inicia com os quatro exemplos que já
tinham aplicações em processamento ou concluídas: Âncoras, CliftonStrengths, Janusian
e Perfil Caliper. São dados locais de interface, sem criação de contrato real.
A visão de Luis usa a empresa Testes nesta fase de conta única.

Meu Assessment filtra as aplicações pelos IDs contratados da empresa e pelos estados
processing/completed. Não exibe ferramentas não contratadas, cartões de interesse
ou aplicações não iniciadas; os contadores seguem o mesmo filtro. O catálogo
administrativo continua completo. A mensagem que remete à contratação em Empresas
não aparece no catálogo.

A listagem de Usuários é uma tabela com ID numérico, foto/avatar, nome, e-mail,
empresa, perfil e link para a página de gestão individual. A busca aceita ID,
nome e e-mail. As fotos ainda não cadastradas utilizam avatar padrão.
