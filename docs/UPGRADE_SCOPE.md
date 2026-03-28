# Rose Delivery - Escopo Completo de Upgrade

## 1. Objetivo
Evoluir o app atual de cardapio + carrinho + WhatsApp para uma plataforma mais robusta, com operacao em tempo real, melhor experiencia mobile e base pronta para crescimento.

## 2. Resultado Esperado
- Melhor conversao no pedido (menos abandono).
- Operacao mais rapida para cozinha e atendimento.
- Visibilidade de pedidos em tempo real.
- Catalogo flexivel sem depender de alteracao manual no codigo.
- Base tecnica para evoluir para pagamento online e programa de fidelidade.

## 3. Escopo Funcional

### 3.1 Catalogo e Produto
- Catalogo dinamico (itens, tamanhos, adicionais, ingredientes, disponibilidade).
- Controle de destaque e "mais pedidos" via painel.
- Regras de combo configuraveis por campanha.
- Preco por bairro para taxa de entrega.
- Janela de funcionamento configuravel por dia da semana.

### 3.2 Checkout e Pedido
- Fluxo em etapas: itens -> endereco -> pagamento -> confirmacao.
- Campos de cliente: nome, telefone, endereco, complemento, referencia.
- Validacoes de pedido minimo e area atendida.
- Resumo com subtotal, desconto, taxa, total final.
- Confirmacao final por WhatsApp com mensagem padronizada.

### 3.3 Personalizacao de Itens
- "Monte o seu" para massa e pastel com ingredientes precificados.
- Limites de ingredientes por categoria (opcional).
- Regras de incompatibilidade de ingredientes (opcional).
- Observacao por item e observacao geral do pedido.

### 3.4 Operacao Interna
- Painel de pedidos com status: novo, preparando, saiu, entregue, cancelado.
- Filtro por data, status, canal e faixa de valor.
- Tempo medio de preparo e entrega.
- Alertas internos para pedidos criticos (alto valor, atraso, reentrega).

### 3.5 Tempo Real
- Atualizacao de status em tempo real no painel.
- Atualizacao de status para o cliente (link de acompanhamento).
- Registro de eventos do pedido para auditoria.

### 3.6 Autenticacao e Perfis (Fase futura)
- Login seguro para Admin, Atendente e Usuario.
- Controle de permissao por tela e por acao.
- Sessao com expiracao e logout seguro.
- Auditoria basica de acesso e alteracoes criticas.

## 4. Escopo Tecnico

### 4.1 Frontend
- Quebrar App monolitico em componentes.
- Criar camada de estado central do carrinho/pedido.
- Melhorar UX mobile (toque, contraste, legibilidade, acessibilidade).
- Skeleton loading, estados de erro e estados vazios.

### 4.2 Backend / Dados
- Banco para produtos, pedidos, clientes, configuracoes e eventos.
- API para criacao/atualizacao de pedidos e status.
- Politica de acesso por perfil (admin, operacao).
- Logs de auditoria e trilha de alteracoes.

### 4.3 Integracoes e Automacao (n8n)
- Workflow de novo pedido (webhook -> validacao -> notificacao).
- Workflow de mudanca de status (painel -> cliente).
- Workflow de recuperacao de pedido abandonado.
- Workflow de relatorio diario (vendas, top itens, ticket medio).

### 4.4 Observabilidade e Qualidade
- Padrao de logs para front e backend.
- Monitoramento de erros e alertas.
- Testes unitarios para regras de preco/combo.
- Testes E2E para fluxo critico de pedido.
- CI: build + lint + testes em pull request.

## 5. Roadmap por Fases

### Fase 0 - Fundacao (1 semana)
- Refactor inicial do frontend (componentes base).
- Padronizacao de estrutura de pastas.
- Preparacao de ambiente e pipeline de qualidade.

### Fase 1 - Catalogo Dinamico e Checkout (2 semanas)
- Modelagem de dados de catalogo.
- Tela de checkout em etapas.
- Persistencia de pedido e historico no backend.

### Fase 2 - Operacao em Tempo Real (2 semanas)
- Painel interno de pedidos.
- Mudanca de status com atualizacao em tempo real.
- Timeline de eventos do pedido.

### Fase 3 - Automacoes n8n (1 a 2 semanas)
- Confirmacao automatica de pedido.
- Lembrete de atraso e SLA.
- Relatorio diario automatizado.

### Fase 4 - Conversao e Crescimento (1 a 2 semanas)
- Cupons e campanhas.
- Experimentos A/B de cards e CTA.
- Metricas de funil de pedido.

### Fase 5 - Escala e Governanca (continuo)
- Hardening de seguranca.
- Revisao de custos e performance.
- Rotina de backup, auditoria e governanca.

### Fase 6 - Autenticacao e Perfis (futuro)
- Autenticacao de admin, atendentes e usuarios.
- Controle de acesso baseado em papel (RBAC).
- Protecao de rotas e recursos sensiveis.
- Sessao segura, renovacao e revogacao de acesso.

## 6. Entregaveis
- Documento de arquitetura.
- Banco e migrations.
- Frontend modularizado.
- Painel de operacao.
- Workflows n8n versionados.
- Dashboards operacionais.
- Suite minima de testes automatizados.

## 7. Criterios de Sucesso
- Queda de abandono no checkout.
- Reducao de tempo medio entre pedido e preparo.
- Reducao de erros manuais na operacao.
- Aumento de ticket medio por combos e adicionais.
- Confiabilidade de build/deploy sem regressao.

## 8. Backlog Futuro (Opcional)
- Pagamento online.
- Programa de fidelidade.
- Recomendacao de itens por historico.
- Multi-loja com cardapios independentes.
- App PWA com notificacoes push.
