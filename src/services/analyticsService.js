const METRICAS_KEY = "rose_funil_metricas_v1";

const METRICAS_PADRAO = {
  visualizacoesCardapio: 0,
  adicoesCarrinho: 0,
  inicioCheckout: 0,
  pedidosFinalizados: 0,
  variacaoAB: {
    A: { cliquesCTA: 0 },
    B: { cliquesCTA: 0 },
  },
};

const podeUsarStorage = () => typeof window !== "undefined" && window.localStorage;

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

export const getMetricasFunil = () => {
  if (!podeUsarStorage()) {
    return clonar(METRICAS_PADRAO);
  }

  try {
    const raw = localStorage.getItem(METRICAS_KEY);
    if (!raw) {
      return clonar(METRICAS_PADRAO);
    }

    const parsed = JSON.parse(raw);
    return {
      ...clonar(METRICAS_PADRAO),
      ...parsed,
      variacaoAB: {
        ...METRICAS_PADRAO.variacaoAB,
        ...(parsed.variacaoAB || {}),
      },
    };
  } catch {
    return clonar(METRICAS_PADRAO);
  }
};

const salvarMetricas = (metrica) => {
  if (!podeUsarStorage()) {
    return;
  }

  localStorage.setItem(METRICAS_KEY, JSON.stringify(metrica));
};

export const incrementarMetrica = (campo) => {
  const atual = getMetricasFunil();
  atual[campo] = (atual[campo] || 0) + 1;
  salvarMetricas(atual);
  return atual;
};

export const incrementarCliqueAB = (variacao) => {
  const atual = getMetricasFunil();
  if (!atual.variacaoAB[variacao]) {
    atual.variacaoAB[variacao] = { cliquesCTA: 0 };
  }
  atual.variacaoAB[variacao].cliquesCTA += 1;
  salvarMetricas(atual);
  return atual;
};
