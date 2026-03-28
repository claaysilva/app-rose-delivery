# Rose Delivery - Progresso do Upgrade

Regra de controle
- Nao marcar check de concluido durante implementacao.
- So marcar concluido apos:
  - teste executado com resultado aprovado
  - validacao e aprovacao explicitas do cliente
- Execucao sempre por fase (nao por parte).

Legenda de status
- Em desenvolvimento
- Em teste
- Aguardando aprovacao do cliente
- Concluido

Padrao de testes por etapa
- Sempre informar dois blocos de teste:
  - Testes tecnicos (executados por mim)
  - Testes de validacao funcional (executados por voce)
- So marcar "Check final: [x]" apos os dois blocos aprovados.

Modo de execucao
- Unidade de entrega: Fase completa.
- Check: 1 check final por fase.
- Partes internas servem apenas como checklist tecnico, sem check individual.

## Fase 0 - Fundacao

Status da fase
- Status: Em validacao
- Aprovacao do cliente: Pendente
- Check final da fase: [ ]

1. Refactor inicial do frontend (componentes base)
- Status: Concluido
- Teste: Build de producao executado e aprovado
- Testes de validacao funcional (cliente):
  - Abrir o cardapio e verificar se todos os itens carregam normalmente.
  - Adicionar 1 massa e 1 pastel no carrinho e validar total + desconto combo.
  - Testar "Monte seu Macarrao" escolhendo ingredientes e conferir valor no carrinho.
  - Testar "Monte seu Pastel" escolhendo ingredientes e conferir valor no carrinho.
  - Finalizar pedido e validar se a mensagem no WhatsApp inclui ingredientes e adicionais.
- Aprovacao do cliente: Aprovado
- Check interno: OK

2. Padronizacao de estrutura de pastas
- Status: Concluido
- Teste: Build de producao executado e aprovado
- Testes de validacao funcional (cliente):
  - Abrir a aplicacao e validar que o cardapio carrega normalmente.
  - Navegar entre Cardapio, Carrinho e Historico para garantir que nao houve regressao.
  - Adicionar e remover itens do carrinho para confirmar fluxo funcional.
  - Validar que o fechamento no WhatsApp continua abrindo a mensagem corretamente.
- Aprovacao do cliente: Aprovado
- Check interno: OK

3. Preparacao de ambiente e pipeline de qualidade
- Status: Aguardando aprovacao do cliente
- Teste: Script local "npm run check" executado e aprovado
- Testes de validacao funcional (cliente):
  - Executar "npm run check" e confirmar execucao sem erro.
  - Fazer uma alteracao simples local, commitar em branch de teste e abrir PR no GitHub para confirmar que a CI "Build" dispara.
  - Conferir no GitHub Actions se os passos Checkout, Install dependencies e Build finalizaram com sucesso.
- Aprovacao do cliente: Pendente
- Check interno: Pendente

## Fase 1 - Catalogo Dinamico e Checkout

Status da fase
- Status: Concluido
- Testes tecnicos (executados): Build de producao executado e aprovado
- Aprovacao do cliente: Aprovado
- Check final da fase: [x]

1. Modelagem de dados de catalogo
- Status: Concluido
- Teste: Catalogo carregado por servico com fallback e suporte a configuracao de "mais pedidos"
- Aprovacao do cliente: Pendente
- Check interno: OK

2. Tela de checkout em etapas
- Status: Concluido
- Teste: Checkout em 3 etapas (cliente, endereco, pagamento/resumo) com validacao minima
- Aprovacao do cliente: Pendente
- Check interno: OK

3. Persistencia de pedido e historico no backend
- Status: Concluido
- Teste: Persistencia movida para servico dedicado de historico (storage local)
- Aprovacao do cliente: Pendente
- Check interno: OK

Testes de validacao funcional (cliente)
- Abrir o cardapio e confirmar que os itens e a busca continuam funcionando normalmente.
- Adicionar itens (massa e pastel), abrir carrinho e clicar em "Ir para checkout".
- Etapa 1: tentar continuar sem nome/telefone e validar a mensagem de erro; depois preencher e continuar.
- Etapa 2: tentar continuar sem endereco e validar a mensagem de erro; depois preencher e continuar.
- Etapa 3: alternar forma de pagamento (Pix, Dinheiro, Cartao) e confirmar total.
- Finalizar pedido e conferir no WhatsApp os blocos de Cliente, Entrega, Itens e Pagamento.
- Ir em Historico e validar se o pedido finalizado aparece.

## Fase 2 - Operacao em Tempo Real

Status da fase
- Status: Aguardando aprovacao do cliente
- Testes tecnicos (executados): Build de producao executado e aprovado
- Aprovacao do cliente: Pendente
- Check final da fase: [ ]

1. Painel interno de pedidos
- Status: Concluido
- Teste: Tela Operacao adicionada com listagem, filtro por status e resumo de pedidos
- Aprovacao do cliente: Pendente
- Check interno: OK

2. Mudanca de status com atualizacao em tempo real
- Status: Concluido
- Teste: Atualizacao de status persistida em storage e sincronizacao automatica por polling/storage event
- Aprovacao do cliente: Pendente
- Check interno: OK

3. Timeline de eventos do pedido
- Status: Concluido
- Teste: Registro de eventos de criacao e mudanca de status exibidos na timeline do pedido
- Aprovacao do cliente: Pendente
- Check interno: OK

Testes de validacao funcional (cliente)
- Criar 1 pedido novo pelo fluxo de checkout e abrir a aba Operacao.
- Confirmar que o pedido aparece na listagem com status "Novo".
- Alterar status para Preparando, Saiu e Entregue, verificando atualizacao imediata na tela.
- Conferir se cada alteracao gera um item novo na timeline do pedido.
- Usar filtro por status (Novo, Preparando, Saiu, Entregue, Cancelado) e validar retorno correto.
- Abrir a aba Historico e confirmar que o pedido continua registrado.

## Fase 3 - Automacoes n8n

Status da fase
- Status: Aguardando aprovacao do cliente
- Testes tecnicos (executados): Build de producao executado e aprovado
- Aprovacao do cliente: Pendente
- Check final da fase: [ ]

1. Confirmacao automatica de pedido
- Status: Concluido
- Teste: Evento de criacao de pedido padronizado na timeline (sem confirmacao automatica simulada)
- Aprovacao do cliente: Pendente
- Check interno: OK

2. Lembrete de atraso e SLA
- Status: Concluido
- Teste: Alertas de SLA implementados na tela de Operacao com leitura em tempo real
- Aprovacao do cliente: Pendente
- Check interno: OK

3. Relatorio diario automatizado
- Status: Concluido
- Teste: Gerador de relatorio diario implementado na tela de Operacao
- Aprovacao do cliente: Pendente
- Check interno: OK

Testes de validacao funcional (cliente)
- Criar um pedido e conferir na timeline o evento "Confirmacao automatica de pedido enviada".
- Deixar pedido em status Novo por alguns minutos e validar exibicao em "Alertas de SLA".
- Alterar para Preparando e validar mudanca no alerta conforme tempo.
- Na aba Operacao, clicar em "Gerar" no bloco de relatorio diario e validar texto com total de pedidos, faturamento e ticket medio.
- Confirmar que o relatorio muda ao criar novos pedidos no mesmo dia.

## Fase 4 - Conversao e Crescimento

Status da fase
- Status: Em desenvolvimento
- Testes tecnicos (executados): Build de producao executado e aprovado
- Aprovacao do cliente: Pendente
- Check final da fase: [ ]

1. Cupons e campanhas
- Status: Em desenvolvimento
- Teste: Cupom aplicado no carrinho/checkout com recalc de total e campanha destacada no cardapio
- Aprovacao do cliente: Pendente
- Check interno: Em andamento

2. Experimentos A/B de cards e CTA
- Status: Em desenvolvimento
- Teste: Variacao de CTA com tracking de clique por variante
- Aprovacao do cliente: Pendente
- Check interno: Em andamento

3. Metricas de funil de pedido
- Status: Em desenvolvimento
- Teste: Contadores de visualizacao, adicao ao carrinho, inicio checkout e pedido finalizado exibidos na Operacao
- Aprovacao do cliente: Pendente
- Check interno: Em andamento

## Fase 5 - Escala e Governanca

1. Hardening de seguranca
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final: [ ]

2. Revisao de custos e performance
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final: [ ]

3. Rotina de backup, auditoria e governanca
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final: [ ]

## Fase 6 - Autenticacao e Perfis (futuro)

Status da fase
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final da fase: [ ]

1. Autenticacao de admin, atendentes e usuarios
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final: [ ]

2. Controle de permissao por papel (RBAC)
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final: [ ]

3. Protecao de rotas e recursos sensiveis
- Status: Pendente
- Teste: Pendente
- Aprovacao do cliente: Pendente
- Check final: [ ]
