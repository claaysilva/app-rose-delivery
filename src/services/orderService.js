const HISTORICO_STORAGE_KEY = "rose_historico";

export const STATUS_PEDIDO = {
  NOVO: "novo",
  PREPARANDO: "preparando",
  SAIU: "saiu",
  ENTREGUE: "entregue",
  CANCELADO: "cancelado",
};

const SLA_MINUTOS = {
  [STATUS_PEDIDO.NOVO]: 10,
  [STATUS_PEDIDO.PREPARANDO]: 25,
};

const podeUsarStorage = () => typeof window !== "undefined" && window.localStorage;

const gerarPedidoId = () => `ped-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const normalizarPedido = (pedido) => {
  const eventosBase = Array.isArray(pedido.eventos) ? pedido.eventos : [];
  const status = pedido.status || STATUS_PEDIDO.NOVO;
  const createdAt = pedido.createdAt || new Date().toISOString();
  const updatedAt = pedido.updatedAt || createdAt;

  return {
    ...pedido,
    id: pedido.id || gerarPedidoId(),
    status,
    createdAt,
    updatedAt,
    eventos: eventosBase.length
      ? eventosBase
      : [
          {
            tipo: "criacao",
            descricao: "Pedido criado",
            data: pedido.data || new Date().toLocaleString("pt-BR"),
          },
        ],
  };
};

const salvarHistorico = (historico) => {
  if (!podeUsarStorage()) {
    return;
  }

  localStorage.setItem(HISTORICO_STORAGE_KEY, JSON.stringify(historico));
};

export const getHistoricoPedidos = () => {
  if (!podeUsarStorage()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(HISTORICO_STORAGE_KEY) || "[]";
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizarPedido);
  } catch {
    return [];
  }
};

export const salvarPedidoNoHistorico = (pedido) => {
  const historicoAtual = getHistoricoPedidos();
  const pedidoNormalizado = normalizarPedido(pedido);
  const atualizado = [pedidoNormalizado, ...historicoAtual].slice(0, 50);

  salvarHistorico(atualizado);

  return atualizado;
};

export const atualizarStatusPedido = (pedidoId, novoStatus) => {
  const historicoAtual = getHistoricoPedidos();

  const atualizado = historicoAtual.map((pedido) => {
    if (pedido.id !== pedidoId) {
      return pedido;
    }

    if (pedido.status === novoStatus) {
      return pedido;
    }

    const evento = {
      tipo: "status",
      descricao: `Status alterado de ${pedido.status} para ${novoStatus}`,
      data: new Date().toLocaleString("pt-BR"),
      de: pedido.status,
      para: novoStatus,
    };

    return {
      ...pedido,
      status: novoStatus,
      updatedAt: new Date().toISOString(),
      eventos: [evento, ...(pedido.eventos || [])],
    };
  });

  salvarHistorico(atualizado);

  return atualizado;
};

const minutosDesdeIso = (isoDate) => {
  if (!isoDate) {
    return 0;
  }

  const inicio = new Date(isoDate).getTime();
  const agora = Date.now();

  if (Number.isNaN(inicio)) {
    return 0;
  }

  return Math.max(0, Math.floor((agora - inicio) / 60000));
};

export const getAlertasSLA = (pedidos) => {
  return pedidos
    .map((pedido) => {
      const limite = SLA_MINUTOS[pedido.status];
      if (!limite) {
        return null;
      }

      const baseTempo = pedido.updatedAt || pedido.createdAt;
      const minutos = minutosDesdeIso(baseTempo);
      if (minutos < limite) {
        return null;
      }

      return {
        pedidoId: pedido.id,
        status: pedido.status,
        minutos,
        limite,
        cliente: pedido.checkout?.nome || "Cliente",
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.minutos - a.minutos);
};

export const gerarRelatorioDiarioPedidos = (pedidos) => {
  const hoje = new Date().toISOString().slice(0, 10);
  const pedidosHoje = pedidos.filter((pedido) =>
    (pedido.createdAt || "").startsWith(hoje),
  );

  const totalPedidos = pedidosHoje.length;
  const faturamento = pedidosHoje.reduce((acc, pedido) => acc + (pedido.total || 0), 0);
  const ticketMedio = totalPedidos ? faturamento / totalPedidos : 0;

  const contagemStatus = pedidosHoje.reduce((acc, pedido) => {
    const key = pedido.status || STATUS_PEDIDO.NOVO;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const linhas = [
    "Relatorio diario - Rose Delivery",
    `Data: ${new Date().toLocaleDateString("pt-BR")}`,
    "",
    `Total de pedidos: ${totalPedidos}`,
    `Faturamento: R$ ${faturamento.toFixed(2)}`,
    `Ticket medio: R$ ${ticketMedio.toFixed(2)}`,
    "",
    "Pedidos por status:",
  ];

  Object.keys(contagemStatus).forEach((status) => {
    linhas.push(`- ${status}: ${contagemStatus[status]}`);
  });

  return linhas.join("\n");
};
