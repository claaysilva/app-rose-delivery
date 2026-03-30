const AUDITORIA_KEY = "rose_auditoria_v1";

const podeUsarStorage = () => typeof window !== "undefined" && window.localStorage;

const clonar = (obj) => JSON.parse(JSON.stringify(obj));

export const getEventosAuditoria = () => {
  if (!podeUsarStorage()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(AUDITORIA_KEY) || "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const registrarEventoAuditoria = (acao, detalhes = {}) => {
  if (!podeUsarStorage()) {
    return [];
  }

  const eventosAtuais = getEventosAuditoria();
  const evento = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    acao,
    detalhes,
    data: new Date().toLocaleString("pt-BR"),
  };

  const atualizado = [evento, ...eventosAtuais].slice(0, 100);
  localStorage.setItem(AUDITORIA_KEY, JSON.stringify(atualizado));
  return atualizado;
};

export const gerarBackupJSON = ({ catalogo, historico, metricas, auditoria }) => {
  const payload = {
    versao: 1,
    criadoEm: new Date().toISOString(),
    dados: {
      catalogo: clonar(catalogo || {}),
      historico: clonar(historico || []),
      metricas: clonar(metricas || {}),
      auditoria: clonar(auditoria || []),
    },
  };

  return JSON.stringify(payload, null, 2);
};
