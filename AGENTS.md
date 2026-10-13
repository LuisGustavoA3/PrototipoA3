# AGENTS.md

# Diretrizes para Uso Consciente de IA no Desenvolvimento

# Regra — Economia de Tokens e Eficiência de Contexto

## Objetivo

Reduzir o consumo de tokens durante as tarefas de desenvolvimento e reestruturação, preservando a precisão técnica, a segurança das alterações e o contexto arquitetural do projeto.

## Diretrizes

**1. Leitura seletiva**

- Consultar primeiro os arquivos diretamente relacionados à tarefa.
- Evitar reler arquivos já analisados quando não houver alterações relevantes.
- Pesquisar símbolos, imports e referências antes de abrir arquivos completos.
- Não percorrer todo o repositório quando uma análise localizada for suficiente.

**2. Respostas objetivas**

- Evitar introduções, explicações repetidas e descrições extensas de procedimentos triviais.
- Apresentar planos curtos, contendo somente arquivos envolvidos, alterações previstas e riscos relevantes.
- Não reproduzir arquivos completos ou trechos extensos de código já disponíveis no repositório.
- Priorizar caminhos de arquivos e referências a funções no lugar de copiar seu conteúdo.

**3. Execução incremental**

- Realizar somente as alterações aprovadas.
- Evitar refatorações paralelas, abstrações antecipadas e alterações fora do escopo.
- Não repetir verificações já realizadas quando nenhuma mudança relevante ocorreu.
- Executar as validações necessárias ao impacto das alterações, preservando as verificações obrigatórias da fase.

**4. Gerenciamento de contexto**

- Utilizar os documentos de contexto existentes como referência, sem reproduzi-los integralmente nas respostas.
- Registrar decisões arquiteturais duradouras no documento apropriado, evitando depender exclusivamente do histórico da conversa.
- Antes de analisar novamente uma área, verificar se há diagnóstico anterior válido.
- Priorizar informações atuais do código quando houver divergência com documentos.

**5. Comunicação**

- Antes de alterar o código, apresentar somente:
  - Objetivo;
  - Arquivos afetados;
  - Estratégia resumida;
  - Riscos ou dúvidas que bloqueiem a execução.
- Aguardar aprovação quando exigida pelo fluxo do projeto.
- Após executar, informar:
  - Alterações realizadas;
  - Validações e respectivos resultados;
  - Pendências ou problemas identificados.
- Não exibir logs completos, diffs extensos ou código integral, exceto quando solicitado ou necessário para diagnosticar um erro.

## Princípio fundamental

Economizar tokens eliminando informações redundantes e operações desnecessárias, nunca omitindo riscos relevantes, falhas de validação ou impactos arquiteturais.

A correção e a segurança da implementação têm prioridade sobre a economia de tokens.

## 1. Princípio central

> **Economizar tokens não significa fornecer menos informação. Significa evitar informação desnecessária, repetida ou fora do escopo.**

A IA deve trabalhar sempre com o **menor contexto suficiente para executar a tarefa com segurança e qualidade**.

Prioridades:

1. Entender corretamente a tarefa.
2. Investigar somente o necessário.
3. Evitar releituras e repetições.
4. Não alterar código fora do escopo.
5. Preservar decisões já validadas.
6. Validar as alterações realizadas.
7. Manter o contexto do projeto documentado, em vez de repeti-lo nos prompts.

---

# 2. Ferramentas de IA

## 2.1 Copilot — ferramenta principal

O GitHub Copilot é a ferramenta principal para desenvolvimento e manutenção do projeto.

Deve ser priorizado para:

- análise do código;
- investigação de problemas;
- implementação de funcionalidades;
- correções;
- refatorações autorizadas;
- criação e atualização de componentes;
- testes, quando solicitados;
- validações;
- manutenção da arquitetura existente.

O contexto deve ser obtido preferencialmente através de:

- arquivos diretamente relacionados à tarefa;
- estrutura do projeto;
- documentação existente;
- código que referencia ou utiliza o trecho em questão;
- instruções deste arquivo;
- documentação técnica do projeto.

Não assumir que toda a base de código precisa ser analisada em toda solicitação.

---

## 2.2 Gemini — ferramenta alternativa

Gemini não é a ferramenta padrão do projeto.

Pode ser utilizado quando:

- o Copilot não consegue resolver adequadamente a tarefa;
- uma segunda análise é necessária;
- houver necessidade de uma abordagem alternativa;
- houver alguma limitação específica do Copilot.

Não utilizar Gemini apenas para duplicar uma análise que o Copilot já realizou satisfatoriamente.

---

## 2.3 Lovable — ferramenta alternativa para prototipação

Lovable não é a ferramenta principal de desenvolvimento.

Pode ser utilizado como alternativa para:

- prototipação rápida;
- exploração de interfaces;
- validação visual;
- experimentação de layouts.

As decisões de UX/UI e os requisitos do produto **não devem ser definidos pelo Lovable**.

O código ou interface gerado pelo Lovable deve ser considerado material de exploração/prototipação e não fonte de verdade do projeto.

---

# 3. Contexto permanente x contexto da tarefa

## 3.1 Contexto permanente

Informações que são válidas para várias tarefas devem permanecer documentadas em:

- `AGENTS.md`;
- documentação de arquitetura;
- documentação de banco;
- especificações;
- documentação de features;
- demais documentos oficiais do projeto.

Não repetir essas informações em todos os prompts.

---

## 3.2 Contexto específico da tarefa

O prompt deve informar somente aquilo que for necessário para aquela tarefa.

Evitar repetir informações que já estejam disponíveis na documentação do projeto.

Exemplo:

```text
Corrija o comportamento do botão de download em `$contentId.tsx`.

Quando o download não for permitido:
- o botão deve permanecer visível;
- deve ficar desabilitado.

Não altere layout ou outros comportamentos.
```
