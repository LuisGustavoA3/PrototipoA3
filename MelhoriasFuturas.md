melhorias do prototipo

- ~~tirar fale com a a3~~
- ~~achar a api do forms para avalie-nos~~
- ~~consertar minhas ações~~
- ~~setinha de back~~
- ~~dropdown ajuda~~
- ~~sidebar com o chatbot~~
- ~~reestruturação da pagina de arquivos compartilhados~~
- ~~Agenda de Sessões - atualizações do monday~~
- ~~vamos fazer logo a relação das trilhas~~
- Bookmarking/Favoritos = O usuário poderia salvar o conteúdo para que pudesse ser acessado diretamente ao entrar no site/aplicativo
- ultimo conteúdo acessado
- barra de pesquisa geral
- pagina geral da biblioteca
- minhas estatísticas devem ser sobre conteúdo da categoria do conteúdo
- Quando um arquivo recebido for aberto, como devemos tratar o indicador "Novo"
- Respostas do faq
- Não eexibir o botão do faq e dos contatos o tempo todo no assistente
- Ao clicar na ação no dashboard abre os detalhes das ações
- Um conteudo da biblioteca deve estar relacionado a apenas uma competencia na biblioteca? pode ser mais de uma
- ~~O mentor vai poder compartilhar conteúdo externo a a3 para o mentorado? como links de vídeo livro podcast? o link direto não~~
- ao tiver chegando proximo a data ações atualização de status(notificação)

- colocar status atrasado
- evidencia é opcinal e anexo de documento tmb metor tb

- pdi visualização de tabelas editaveis primeiro e visualização de cards depois ou abas separadas

- link de compartilhamento de conteudo, notificação de criação e se enviou documentos antes da mentoria

- configurar sessoes de mentoria sessao-> atendimento colunas atendimento mentor/ consultor data prevista

- assessment não listar todos listar os que o gestor cadastrou o mentorado

- agente de ia do davi integração whats e/ou monday e email notificação

- notificação de conclusao de conteudo

oraganizar as regras de negocio por areas

organizar o banco de dados (escrever)
insights mais pessoais

monday
documentação
apresentação

ver o quadro real sessoes da mentoria com a nat e sobre a jornada de desenvolvimento tmb

mostrar o quadro de planejamentos da agenda somente, com a mari, produto mentoria e assessment

todos os mentorados?
todos ciclos? por ano
os resultados dos assessments sao pdf abrir visualizador

assistente:

> 1. Orientação por intenção
>    Em vez de depender apenas de palavras exatas, o Assistente deve reconhecer diferentes formas de expressar uma mesma dúvida.
>    Exemplo:
>    Usuário: “Quero saber como estou evoluindo.”
>    Assistente: “Você quer acompanhar sua evolução na mentoria, consultar os resultados do assessment ou verificar o progresso do seu plano de ação?”
> 2. Perguntas guiadas por contexto
>    O Assistente pode ajudar o usuário a descobrir o que precisa por meio de opções simples, sem exigir que ele saiba o nome exato da funcionalidade.
>    Exemplo:
>    “O que você gostaria de fazer?”
>    Acompanhar meu desenvolvimento.
> 3. Próximos passos após cada resposta
>    O Assistente não deve simplesmente exibir um texto e encerrar a conversa.
>    Ele pode oferecer ações como:
>
> - “Ver perguntas relacionadas.”
> - “Consultar o FAQ completo.”
> - “Falar com a equipe.”
> - “Voltar ao início.”
>
> 4. Respostas mais úteis e contextualizadas
>    Quando as respostas oficiais estiverem disponíveis, elas devem ser apresentadas de forma objetiva, com instruções claras e, quando necessário, links para a funcionalidade correspondente.
>    Por exemplo, em vez de apenas informar onde está o plano de ação, explicar como encontrá-lo e o que o usuário pode consultar naquela área.

- Levantamento das informações do módulo
- Estrutura do módulo dentro do Portal A3
- Acesso e permissões
- Funcionalidades
- Fluxos do módulo
- Entidades e relacionamentos
- Regras de negócio
- Estados e ciclos
- Integração com o modelo documental do A3
- Pendências
- Resultado esperado
- Objetivo
- Estrutura do Módulo e Fluxos de Uso
- Recursos e limitações
- Geração de valor para o cliente
- Conclusão

Portal A3
Acredito que devemos concretizar tecnicamente o que é o produto A3 Digital, para que possamos ter uma visão mais clara do que será desenvolvido como portal/hub e como será a experiência do usuário. Portanto, eu classificaria a A3 Digital como:
SaaS:  
Como a solução é distribuida: hospedada em nuvem e disponibilizada pela internet.
PWA:  
Aplicação web com recursos de instalação e integração com dispositivos.
B2B:  
Solução voltada para empresas, com foco em atender as necessidades corporativas.
Suite de Soluções:  
Ecossistema de produtos especializados que compartilham serviços e identidade.
Multi-Tenant:  
Arquitetura que permite atender múltiplas empresas em uma infraestrutura compartilhada, com isolamento lógico de dados.
Modular:  
Arquitetura organizada em módulos com responsabilidades bem separadas.

com isso, temos alguma soluções no mercado que se aproximam do que vamos construir, o principal é o microsoft 365 por isso construi um benchmark com ele, mas existem outros como o google workspace, slack, monday, asana, trello, notion, entre outros.
