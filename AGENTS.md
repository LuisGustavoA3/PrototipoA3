# AGENTS.md

# Diretrizes para Uso Consciente de IA no Desenvolvimento

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