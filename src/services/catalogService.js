import {
  ADICIONAIS,
  INGREDIENTES_MASSA,
  INGREDIENTES_PASTEL,
  MASSAS,
  PASTEIS,
} from "../data/menuData";

const CATALOGO_STORAGE_KEY = "rose_catalogo_v1";

const CATALOGO_PADRAO = {
  massas: MASSAS,
  pasteis: PASTEIS,
  ingredientesMassa: INGREDIENTES_MASSA,
  ingredientesPastel: INGREDIENTES_PASTEL,
  adicionais: ADICIONAIS,
  maisPedidosIds: [
    { tipo: "massa", id: "da-casa" },
    { tipo: "pastel", id: "pastel-carne-seca" },
    { tipo: "massa", id: "gourmet" },
    { tipo: "pastel", id: "pastel-pizza" },
  ],
  campanhas: [
    {
      id: "campanha-cupom-rose10",
      titulo: "Campanha do dia",
      descricao: "Use o cupom ROSE10 e ganhe 10% no pedido",
      destaque: true,
      ativoNoDia: true,
    },
  ],
  cupons: [
    {
      codigo: "ROSE10",
      tipo: "percentual",
      valor: 10,
      ativo: true,
    },
    {
      codigo: "ROSE5",
      tipo: "fixo",
      valor: 5,
      ativo: true,
    },
  ],
};

const podeUsarStorage = () => typeof window !== "undefined" && window.localStorage;

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

export const getCatalogoPadrao = () => clonar(CATALOGO_PADRAO);

export const getCatalogo = () => {
  if (!podeUsarStorage()) {
    return getCatalogoPadrao();
  }

  try {
    const raw = localStorage.getItem(CATALOGO_STORAGE_KEY);
    if (!raw) {
      return getCatalogoPadrao();
    }

    const parsed = JSON.parse(raw);
    const catalogo = {
      ...getCatalogoPadrao(),
      ...parsed,
    };

    if (!Array.isArray(catalogo.massas) || !Array.isArray(catalogo.pasteis)) {
      return getCatalogoPadrao();
    }

    return catalogo;
  } catch {
    return getCatalogoPadrao();
  }
};

export const salvarCatalogo = (catalogo) => {
  if (!podeUsarStorage()) {
    return;
  }

  localStorage.setItem(CATALOGO_STORAGE_KEY, JSON.stringify(catalogo));
};
