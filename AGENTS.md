# Diretrizes para Uso Consciente de Tokens (Copilot & Gemini)

Este documento estabelece as boas práticas e regras para o uso eficiente, econômico e consciente de Inteligência Artificial (GitHub Copilot e Gemini) neste projeto, visando reduzir o consumo de tokens e otimizar as respostas dos assistentes.

---

## 🚀 Filosofia Principal: Menos é Mais

Cada caractere enviado ao modelo e cada caractere retornado por ele consome tokens. Um contexto excessivamente grande confunde a IA, aumenta os tempos de resposta e encarece o uso das ferramentas.

---

## 🔎 Fluxo Obrigatório Antes de Alterações

Antes de criar arquivos ou modificar código, o assistente deve:

1. Investigar o pedido e localizar os arquivos, componentes ou rotas envolvidos.
2. Fazer uma leitura breve do contexto necessário.
3. Apresentar ao usuário:
	- o que foi encontrado;
	- a hipótese ou entendimento do problema;
	- o plano de implementação;
	- os arquivos que provavelmente serão alterados;
	- como a alteração será validada.
4. Aguardar a confirmação do usuário antes de editar arquivos.
5. Após a confirmação, executar a implementação de forma incremental e validar cada etapa.

Para tarefas simples, o plano pode ser curto. Para alterações maiores, o assistente deve dividir o trabalho em etapas claras e não criar arquivos ou escrever código antes da aprovação.

---

## 🛠️ Divisão de Papéis (Copilot vs. Gemini)

Para maximizar a eficiência, utilize a ferramenta certa para a tarefa certa:

| Assistente | Especialidade / Quando usar | Como economizar tokens |
| :--- | :--- | :--- |
| **GitHub Copilot** | • Completar código na linha atual (Inline)<br>• Escrever boilerplate simples<br>• Geração de testes rápidos<br>• Dúvidas locais de sintaxe | • Evite abrir muitos arquivos pesados nas abas abertas (o Copilot usa abas abertas como contexto).<br>• Aceite sugestões parciais em vez de forçar regenerações.<br>• Use comentários curtos e precisos para guiar a autoconclusão. |
| **Gemini (CLI / Chat)** | • Refatorações complexas de múltiplos arquivos<br>• Análise arquitetural e depuração de bugs complexos<br>• Planejamento e design de novas funcionalidades | • Sempre limite a leitura de arquivos usando linhas específicas (start/end lines).<br>• Use sub-agents especializados quando necessário.<br>• Não peça explicações longas se precisar apenas do código. |

---

## 📏 Regras e Práticas Recomendadas

### 1. Leituras Cirúrgicas de Arquivos
- **Evite leituras completas:** Ao analisar arquivos grandes (ex: arquivos com mais de 200 linhas), leia apenas as seções relevantes usando parâmetros de início e fim de linha (`start_line`/`end_line`).
- **Não repita leituras:** Se já leu o arquivo na mesma sessão, evite lê-lo de novo a menos que tenha sido modificado.

### 2. Escrita e Modificações Precisas
- **Use edições cirúrgicas (Replace):** Priorize ferramentas de substituição localizada (`replace`) em vez de reescrever arquivos inteiros.
- **Sem placeholders destrutivos:** Nunca envie código contendo comentários como `// ... rest of code` ou `/* código anterior inalterado */` que possam corromper o arquivo ao ser salvo de volta.

### 3. Redução de Logs e Outputs de Comandos de Terminal
- **Flags Silenciosas:** Ao executar comandos que geram logs extensos, sempre utilize flags de silêncio (ex: `npm install --silent`, `vitest run --reporter=dot`).
- **Desative Paginação:** Use `git --no-pager` e outras configurações equivalentes para evitar que o terminal espere interações e gere outputs repetitivos.
- **Redirecionamento para arquivos temporários:** Para comandos que geram saídas massivas, redirecione para `/tmp` (ex: `comando > /tmp/out.log`) e analise apenas o final do arquivo ou use grep.

### 4. Controle de Contexto de Abas no VS Code (Copilot)
- O Copilot analisa os arquivos abertos no editor para compor o prompt oculto.
- **Feche abas desnecessárias:** Mantenha aberto apenas o arquivo no qual você está trabalhando no momento e seus arquivos de teste relacionados.
- **Crie um arquivo `.copilotignore`:** Adicione arquivos grandes de dados, builds ou dependências para garantir que o Copilot nunca os envie como contexto.

### 5. Prompts Eficientes e Sem Chitchat
- **Seja Direto:** Reduza preâmbulos como *"Olá, você poderia por favor me ajudar com..."*. Escreva diretamente o comando ou a dúvida.
- **Solicite apenas o necessário:** Se precisa apenas da correção de um bug, use instruções como: *"Corrija apenas a lógica condicional na linha X, sem explicar as mudanças"*.
- **Desative resumos de alterações pós-execução:** Ao instruir o assistente, peça para que ele não explique as mudanças após a edição se você já as compreende.

### 6. Uso do Arquivo `.geminiignore` e `.gitignore`
- Garanta que pastas como `node_modules`, `dist`, `.next`, `.vite`, `.git`, e arquivos gerados automaticamente (ex: `routeTree.gen.ts`) estejam listados para que os robôs não indexem ou leiam esses arquivos massivos por engano.

---

## 📈 Ciclo de Desenvolvimento Consciente

1. **Investigar:** Faça buscas (`grep_search` / `glob`) focadas para mapear o problema.
2. **Planejar:** Defina o plano em poucas linhas ou em um arquivo local temporário se for muito complexo.
3. **Executar:** Edite cirurgicamente.
4. **Validar:** Execute testes específicos daquele arquivo, em vez de rodar a suite de testes inteira todas as vezes.
5. **Limpar:** Remova logs temporários de depuração e feche as abas extras.
