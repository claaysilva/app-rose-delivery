import { useEffect, useMemo, useState } from "react";
import {
  HORARIO_ABERTURA,
  HORARIO_FECHAMENTO,
  WHATSAPP_NUMBER,
} from "./data/menuData";
import { getCatalogo, salvarCatalogo } from "./services/catalogService";
import {
  getMetricasFunil,
  incrementarCliqueAB,
  incrementarMetrica,
} from "./services/analyticsService";
import {
  gerarBackupJSON,
  getEventosAuditoria,
  registrarEventoAuditoria,
} from "./services/governanceService";
import {
  atualizarStatusPedido,
  gerarRelatorioDiarioPedidos,
  getHistoricoPedidos,
  getAlertasSLA,
  salvarPedidoNoHistorico,
  STATUS_PEDIDO,
} from "./services/orderService";
import {
  detectarCombo,
  estaAbertaAgora,
  formatBRL,
  formatPrecoMassaCard,
  gerarMensagemWhatsApp,
} from "./utils/orderUtils";

const STATUS_LABEL = {
  [STATUS_PEDIDO.NOVO]: "Novo",
  [STATUS_PEDIDO.PREPARANDO]: "Preparando",
  [STATUS_PEDIDO.SAIU]: "Saiu",
  [STATUS_PEDIDO.ENTREGUE]: "Entregue",
  [STATUS_PEDIDO.CANCELADO]: "Cancelado",
};

const STATUS_ORDEM = [
  STATUS_PEDIDO.NOVO,
  STATUS_PEDIDO.PREPARANDO,
  STATUS_PEDIDO.SAIU,
  STATUS_PEDIDO.ENTREGUE,
  STATUS_PEDIDO.CANCELADO,
];

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "1234";
const LIMITE_TENTATIVAS_ADMIN = 3;
const BLOQUEIO_ADMIN_MINUTOS = 5;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@500;700;800;900&family=Baloo+2:wght@700;800&display=swap');

* { box-sizing: border-box; }

:root {
  --rose-red: #7a2f3c;
  --rose-red-700: #64222f;
  --rose-gold: #c89f17;
  --bg: #f7f3ed;
  --surface: #ffffff;
  --line: #ebdcd4;
  --text: #2f1f23;
  --muted: #7a656b;
  --ok: #1d7a4d;
}

body {
  margin: 0;
  font-family: "Nunito Sans", sans-serif;
  color: var(--text);
  background: linear-gradient(180deg, #fbf8f3 0%, var(--bg) 100%);
  overflow-x: hidden;
  -webkit-text-size-adjust: 100%;
}

html, body, #root {
  width: 100%;
  max-width: 100%;
}

.app-shell {
  min-height: 100dvh;
  max-width: 100vw;
  overflow-x: hidden;
  overscroll-behavior-y: contain;
}

.status {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 900;
  color: #fff;
}
.status::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #fff;
}
.status.open { background: linear-gradient(120deg, #2b8a58, var(--ok)); }
.status.closed { background: linear-gradient(120deg, var(--rose-red-700), var(--rose-red)); }

.header {
  position: sticky;
  top: 34px;
  z-index: 35;
  margin: 0;
  padding: 12px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.logo {
  display: grid;
  line-height: 0.95;
}
.logo-main {
  font-family: "Baloo 2", cursive;
  color: var(--rose-red);
  font-size: 31px;
  font-weight: 800;
}
.logo-sub {
  margin-top: -1px;
  color: var(--rose-red-700);
  font-size: 15px;
  font-weight: 800;
}

.hero {
  min-height: 76vh;
  display: grid;
  place-items: center;
  padding: 18px 14px;
  background:
    linear-gradient(160deg, rgba(122, 47, 60, 0.93), rgba(100, 34, 47, 0.9)),
    url('/brand-menu.png');
  background-size: cover, cover;
  background-position: center;
  background-blend-mode: multiply;
}

.hero-card {
  width: min(760px, 100%);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 22px;
  padding: 28px 16px;
  text-align: center;
  color: #fff;
}

.hero-title {
  margin: 0;
  font-family: "Baloo 2", cursive;
  font-size: clamp(52px, 16vw, 96px);
  line-height: 0.82;
}
.hero-sub {
  font-size: clamp(24px, 8vw, 40px);
  font-weight: 900;
  color: #f8e7c4;
  margin: 0;
}
.hero-phone {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 800;
  color: #ffeecf;
}
.hero p {
  margin: 12px auto 16px;
  max-width: 520px;
  color: #fef8ef;
  font-size: 15px;
}

.btn {
  border: 0;
  border-radius: 12px;
  min-height: 42px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}
.btn.primary {
  background: linear-gradient(135deg, #efc23b, var(--rose-gold));
  color: #3e2a05;
}
.btn.secondary {
  background: var(--rose-red);
  color: #fff;
}

.btn.add-to-cart {
  min-height: 36px;
  padding: 7px 11px;
  border-radius: 10px;
}

.carrinho-btn.pulse {
  animation: pulseCart 0.55s ease;
}

.section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 12px 110px;
}

.section-head p {
  margin: 2px 0 10px;
  color: var(--muted);
  font-size: 13px;
}

.tabs {
  position: sticky;
  top: 86px;
  z-index: 28;
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  background: linear-gradient(180deg, #f8f4ee 55%, rgba(248, 244, 238, 0));
  padding: 8px 0 10px;
}

.tab {
  flex: 1;
  min-height: 48px;
  border: 1px solid #e4d0c5;
  background: #fff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--rose-red);
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}
.tab.active {
  border-color: transparent;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
  color: #fff;
}
.tab-icon { font-size: 16px; }

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: visible;
  padding: 2px 0 10px;
  margin-bottom: 8px;
}
.quick-tag {
  white-space: nowrap;
  padding: 8px 11px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #ead8cf;
  color: var(--rose-red);
  font-size: 12px;
  font-weight: 800;
}

.search-wrap {
  position: relative;
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
  min-height: 44px;
  border: 1px solid #e6d7ce;
  border-radius: 12px;
  padding: 10px 38px 10px 12px;
  background: #fff;
  font-size: 16px;
  color: var(--text);
}

.search-input:focus {
  outline: 2px solid rgba(122, 47, 60, 0.16);
  border-color: rgba(122, 47, 60, 0.4);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #8d6d75;
}

.block-title {
  margin: 2px 0 8px;
  font-size: 16px;
  color: var(--rose-red);
  font-weight: 900;
}

.top-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
  overflow: visible;
  padding: 0 0 10px;
}

.top-card {
  min-width: 0;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #eaded4;
}

.top-card img {
  width: 100%;
  height: 96px;
  object-fit: cover;
}

.top-body { padding: 8px; }
.top-name {
  font-size: 13px;
  font-weight: 900;
  color: var(--rose-red);
}

.top-type {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #8f7278;
  margin-bottom: 2px;
}

.top-price {
  margin-top: 3px;
  font-size: 12px;
  color: #54353d;
  font-weight: 800;
}

.top-action {
  margin-top: 7px;
  width: 100%;
  background: #f8eee7;
  color: var(--rose-red);
  border: 1px solid #e7d0c4;
}

.combo {
  margin-bottom: 10px;
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(200, 159, 23, 0.45);
  background: linear-gradient(120deg, #f5e7af, #f0d172);
  color: #4b3505;
  font-size: 13px;
  font-weight: 900;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.card {
  position: relative;
  display: grid;
  grid-template-columns: 108px 1fr;
  gap: 10px;
  background: #fff;
  border: 1px solid #eadfd5;
  border-radius: 14px;
  overflow: hidden;
  min-height: 116px;
}
.card.destaque { border-color: rgba(200, 159, 23, 0.75); }

.card.flash {
  animation: flashAdded 0.65s ease;
}

.card img {
  width: 108px;
  height: 116px;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--rose-gold);
  color: #402e06;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 900;
}

.card-body {
  padding: 9px 10px 9px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card h3 {
  margin: 0;
  color: var(--rose-red);
  font-size: 18px;
  line-height: 1.1;
}
.card p {
  margin: 4px 0 8px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.25;
}

.price-tag {
  color: #352427;
  font-size: 14px;
  font-weight: 900;
}

.row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }

.drawer-backdrop { position: fixed; inset: 0; background: rgba(19, 8, 12, 0.5); z-index: 60; }
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(430px, 100%);
  height: 100%;
  z-index: 61;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.drawer-head {
  padding: 14px;
  border-bottom: 1px solid #eadfd5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.drawer-head strong {
  color: var(--rose-red);
  font-size: 24px;
  font-weight: 900;
}
.drawer-body { flex: 1; overflow: auto; padding: 12px; }
.item { border-bottom: 1px solid #efe4dc; padding: 10px 0; }
.qty { margin-top: 8px; display: flex; align-items: center; gap: 8px; }
.qty button {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--rose-red);
  color: var(--rose-red);
  background: #fff;
  font-weight: 900;
  cursor: pointer;
}
.drawer-foot { padding: 12px; border-top: 1px solid #eadfd5; }

.field {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e4d3ca;
  background: #fff;
  padding: 9px 10px;
  font-size: 16px;
  font-family: inherit;
}

.checkout-card {
  margin-top: 10px;
  border: 1px solid #eadfd5;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
}

.checkout-title {
  margin: 0 0 8px;
  color: var(--rose-red);
  font-size: 16px;
  font-weight: 900;
}

.checkout-step {
  margin: 0 0 10px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.checkout-grid {
  display: grid;
  gap: 8px;
}

.checkout-error {
  margin-top: 8px;
  font-size: 12px;
  color: #ad2438;
  font-weight: 700;
}

.payment-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pay-btn {
  min-height: 38px;
  border: 1px solid #e4d3ca;
  border-radius: 999px;
  background: #fff;
  color: var(--rose-red);
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.pay-btn.active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 70;
  background: rgba(19, 8, 12, 0.48);
  display: grid;
  place-items: end center;
}

.modal {
  width: min(530px, 100%);
  background: #fff;
  border-radius: 18px 18px 0 0;
  padding: 14px;
}
.modal h3 {
  margin: 0;
  color: var(--rose-red);
  font-size: 24px;
  font-weight: 900;
}
.modal p { margin: 4px 0 10px; color: var(--muted); }

.section-label {
  margin: 6px 0;
  color: var(--muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.size-option {
  min-height: 72px;
  text-align: left;
  border-radius: 12px;
  border: 1px solid #e5d5cc;
  background: #fff;
  color: var(--rose-red);
  padding: 10px;
  cursor: pointer;
}
.size-option strong { font-size: 15px; }
.size-option span { display: block; margin-top: 2px; font-size: 12px; color: var(--muted); }
.size-option.active {
  border-color: transparent;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
  color: #fff;
}
.size-option.active span { color: #f6dce2; }

.pills { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 10px; }
.pill {
  min-height: 40px;
  border-radius: 999px;
  border: 1px solid #e4d3ca;
  background: #fff;
  color: var(--rose-red);
  font-size: 12px;
  font-weight: 800;
  padding: 8px 11px;
  cursor: pointer;
}
.pill.active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
}

.hist {
  border-radius: 12px;
  border: 1px solid #eadfd5;
  background: #fff;
  padding: 12px;
  margin-bottom: 9px;
}

.operacao-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  overflow: visible;
  margin-bottom: 10px;
  padding-bottom: 2px;
}

.operacao-filter button {
  border: 1px solid #e2d4ca;
  background: #fff;
  color: var(--rose-red);
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.operacao-filter .active {
  border-color: transparent;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
  color: #fff;
}

.operacao-card {
  border: 1px solid #eadfd5;
  border-radius: 12px;
  background: #fff;
  padding: 12px;
  margin-bottom: 10px;
}

.operacao-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.operacao-tab {
  border: 1px solid #e2d4ca;
  background: #fff;
  color: var(--rose-red);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.operacao-tab.active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
}

.relatorio-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  background: #f2e7e2;
  color: var(--rose-red);
}

.status-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.status-actions button {
  border: 1px solid #e4d3ca;
  border-radius: 999px;
  background: #fff;
  color: var(--rose-red);
  font-size: 11px;
  font-weight: 800;
  padding: 6px 9px;
  cursor: pointer;
}

.status-actions button.active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--rose-red), var(--rose-red-700));
}

.timeline {
  margin-top: 8px;
  border-top: 1px dashed #eadfd5;
  padding-top: 8px;
  display: grid;
  gap: 6px;
}

.timeline-item {
  font-size: 12px;
  color: #64494f;
}

.alertas-sla {
  border: 1px solid #e8d5b8;
  background: linear-gradient(180deg, #fffaf0, #fff3df);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
}

.alertas-sla h3 {
  margin: 0 0 6px;
  color: #88570f;
  font-size: 14px;
}

.alerta-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
  border-radius: 10px;
  padding: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}

.alerta-item .tag {
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
}

.alerta-item.proximo {
  background: #fff2d7;
  color: #7a5317;
}

.alerta-item.proximo .tag {
  background: #ffde9e;
  color: #6b430c;
}

.alerta-item.atrasado {
  background: #ffe4e4;
  color: #7d1d2a;
}

.alerta-item.atrasado .tag {
  background: #ffbcc6;
  color: #6e0f1f;
}

.campanha-banner {
  margin: 4px 0 10px;
  border: 1px solid #ecd39c;
  background: linear-gradient(120deg, #fff7df, #fff0c8);
  color: #5d4610;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 800;
}

.cupom-box {
  margin-top: 8px;
  border: 1px solid #e8d9cd;
  background: #fff;
  border-radius: 10px;
  padding: 8px;
}

.cupom-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
}

.cupom-info {
  margin-top: 6px;
  font-size: 12px;
  color: #2e6b45;
  font-weight: 700;
}

.cupom-erro {
  margin-top: 6px;
  font-size: 12px;
  color: #7d1d2a;
  font-weight: 700;
}

.metricas-funil {
  margin-top: 10px;
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #5f474d;
}

.metrica-item {
  border: 1px solid #ead7ce;
  background: #fffdf9;
  border-radius: 8px;
  padding: 6px 8px;
}

.relatorio-box {
  margin-top: 8px;
  width: 100%;
  min-height: 140px;
  border: 1px solid #e4d3ca;
  border-radius: 10px;
  padding: 10px;
  font-family: "Nunito Sans", sans-serif;
  font-size: 12px;
  color: #4a353a;
  background: #fff;
}

.nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  background: #fff;
  border-top: 1px solid #e7d8cf;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.nav button {
  border: 0;
  background: transparent;
  color: #84666d;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  padding: 11px 6px 13px;
  cursor: pointer;
}
.nav .active {
  color: var(--rose-red);
  background: linear-gradient(180deg, #fff 0%, #f6efea 100%);
}

.empty-state {
  margin-top: 16px;
  border: 1px dashed #dcbeb1;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
  text-align: center;
  color: #81636a;
  font-size: 13px;
}

@keyframes pulseCart {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

@keyframes flashAdded {
  0% { box-shadow: 0 0 0 rgba(200, 159, 23, 0); }
  30% { box-shadow: 0 0 0 3px rgba(200, 159, 23, 0.5); }
  100% { box-shadow: 0 0 0 rgba(200, 159, 23, 0); }
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

@media (max-width: 740px) {
  .header { top: 33px; }
  .hero-card { padding: 24px 12px; }
  .tabs { top: 82px; }
  .size-grid { grid-template-columns: 1fr; }
  .top-row { grid-template-columns: 1fr; }
}
`;

export default function App() {
  const [tela, setTela] = useState("cardapio");
  const [aba, setAba] = useState("massas");
  const [isAdmin, setIsAdmin] = useState(false);
  const [catalogo, setCatalogo] = useState(() => getCatalogo());
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutErro, setCheckoutErro] = useState("");
  const [historico, setHistorico] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [busca, setBusca] = useState("");
  const [itemAnimado, setItemAnimado] = useState("");
  const [pulseCarrinho, setPulseCarrinho] = useState(false);
  const [filtroStatusOperacao, setFiltroStatusOperacao] = useState("todos");
  const [relatorioDiario, setRelatorioDiario] = useState("");
  const [abaOperacao, setAbaOperacao] = useState("pedidos");
  const [cupomCodigo, setCupomCodigo] = useState("");
  const [cupomAplicado, setCupomAplicado] = useState(null);
  const [cupomErro, setCupomErro] = useState("");
  const [metricasFunil, setMetricasFunil] = useState(() => getMetricasFunil());
  const [variacaoAB] = useState(() => (Math.random() < 0.5 ? "A" : "B"));
  const [auditoria, setAuditoria] = useState(() => getEventosAuditoria());
  const [tentativasAdmin, setTentativasAdmin] = useState(0);
  const [adminBloqueadoAte, setAdminBloqueadoAte] = useState(null);

  const [modalItem, setModalItem] = useState(null);
  const [tamanho, setTamanho] = useState("G");
  const [adicionais, setAdicionais] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [checkout, setCheckout] = useState({
    nome: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
    referencia: "",
    pagamento: "Pix",
  });

  const massasCardapio = catalogo.massas || [];
  const pasteisCardapio = catalogo.pasteis || [];
  const ingredientesMassa = catalogo.ingredientesMassa || [];
  const ingredientesPastel = catalogo.ingredientesPastel || [];
  const adicionaisCardapio = catalogo.adicionais || [];
  const maisPedidosIds = catalogo.maisPedidosIds || [];
  const campanhasAtivas = (catalogo.campanhas || []).filter(
    (campanha) => campanha.destaque && campanha.ativoNoDia !== false,
  );
  const campanhaDestaque = (catalogo.campanhas || []).find((campanha) => campanha.destaque);
  const cuponsAtivos = (catalogo.cupons || []).filter((cupom) => cupom.ativo);

  const aberto = estaAbertaAgora(HORARIO_ABERTURA, HORARIO_FECHAMENTO);
  const combo = useMemo(() => detectarCombo(carrinho), [carrinho]);

  const subtotal = carrinho.reduce((acc, i) => acc + i.subtotal, 0);
  const totalSemCupom = Math.max(subtotal - combo.desconto, 0);
  const descontoCupom = useMemo(() => {
    if (!cupomAplicado) {
      return 0;
    }

    const descontoBruto = cupomAplicado.tipo === "percentual"
      ? (totalSemCupom * cupomAplicado.valor) / 100
      : cupomAplicado.valor;

    return Math.min(totalSemCupom, Math.max(0, descontoBruto));
  }, [cupomAplicado, totalSemCupom]);
  const total = Math.max(totalSemCupom - descontoCupom, 0);
  const totalItens = carrinho.reduce((acc, i) => acc + i.qty, 0);

  const textoCTA = variacaoAB === "A" ? "Pedir agora" : "Quero esse";

  useEffect(() => {
    setMetricasFunil(incrementarMetrica("visualizacoesCardapio"));
  }, []);

  useEffect(() => {
    if (carrinho.length === 0) {
      setCupomAplicado(null);
      setCupomCodigo("");
      setCupomErro("");
    }
  }, [carrinho.length]);

  useEffect(() => {
    const sincronizarHistorico = () => setHistorico(getHistoricoPedidos());

    sincronizarHistorico();

    const onStorage = (event) => {
      if (event.key === "rose_historico") {
        sincronizarHistorico();
      }
    };

    window.addEventListener("storage", onStorage);
    const intervalId = setInterval(sincronizarHistorico, 2000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(intervalId);
    };
  }, []);

  const abrirModal = (item, tipo) => {
    setMetricasFunil(incrementarCliqueAB(variacaoAB));
    setModalItem({ ...item, tipo });
    setTamanho("G");
    setAdicionais([]);
    setIngredientes([]);
  };

  const alternarAdicional = (nome) => {
    setAdicionais((prev) =>
      prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome],
    );
  };

  const alternarIngrediente = (nome) => {
    setIngredientes((prev) =>
      prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome],
    );
  };

  const confirmarItem = () => {
    if (!modalItem) return;

    const isMassa = modalItem.tipo === "massa";
    const base = isMassa ? modalItem.precos[tamanho] : modalItem.preco;
    const ingredientesBase = isMassa ? ingredientesMassa : ingredientesPastel;
    const ingredientesSelecionados = modalItem.personalizavel ? ingredientes : [];
    const adicionaisSelecionados = modalItem.personalizavel ? [] : adicionais;

    const addIngredientes = ingredientesSelecionados.reduce((acc, nome) => {
      const item = ingredientesBase.find((a) => a.nome === nome);
      return acc + (item?.preco || 0);
    }, 0);

    const addAdicionais = adicionaisSelecionados.reduce((acc, nome) => {
      const item = adicionaisCardapio.find((a) => a.nome === nome);
      return acc + (item?.preco || 0);
    }, 0);

    const precoUnitario = base + addIngredientes + addAdicionais;
    const chaveDetalhes = modalItem.personalizavel
      ? [...ingredientesSelecionados].sort().join(",")
      : [...adicionaisSelecionados].sort().join(",");
    const chave = `${modalItem.id}-${isMassa ? tamanho : "U"}-${chaveDetalhes}`;

    setCarrinho((prev) => {
      const idx = prev.findIndex((i) => i.chave === chave);
      if (idx >= 0) {
        return prev.map((i) =>
          i.chave === chave
            ? {
                ...i,
                qty: i.qty + 1,
                subtotal: (i.qty + 1) * i.precoUnitario,
              }
            : i,
        );
      }

      return [
        ...prev,
        {
          chave,
          id: modalItem.id,
          nome: modalItem.nome,
          tipo: modalItem.tipo,
          tamanho: isMassa ? tamanho : null,
          ingredientes: [...ingredientesSelecionados],
          adicionais: [...adicionaisSelecionados],
          precoUnitario,
          qty: 1,
          subtotal: precoUnitario,
        },
      ];
    });

    setItemAnimado(modalItem.id);
    setPulseCarrinho(true);
    setMetricasFunil(incrementarMetrica("adicoesCarrinho"));
    setTimeout(() => setItemAnimado(""), 700);
    setTimeout(() => setPulseCarrinho(false), 650);
    setModalItem(null);
  };

  const alterarQtd = (chave, delta) => {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.chave === chave
            ? {
                ...item,
                qty: item.qty + delta,
                subtotal: (item.qty + delta) * item.precoUnitario,
              }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const validarCheckout = () => {
    if (checkoutStep === 1) {
      if (!checkout.nome.trim()) {
        return "Preencha o campo Nome.";
      }

      if (!checkout.telefone.trim()) {
        return "Preencha o campo Telefone.";
      }

      const telefoneValido = /^\+\d{1,3}\s\(\d{2}\)\s(\d\s\d{4}-\d{4}|\d{4}-\d{4})$/.test(
        checkout.telefone,
      );
      if (!telefoneValido) {
        return "Telefone invalido. Use +DDI (DDD) X XXXX-XXXX ou +DDI (DDD) XXXX-XXXX.";
      }
    }

    if (checkoutStep === 2) {
      if (!checkout.rua.trim()) {
        return "Preencha o campo Rua.";
      }

      if (!checkout.numero.trim()) {
        return "Preencha o campo Numero.";
      }

      if (!checkout.bairro.trim()) {
        return "Preencha o campo Bairro.";
      }
    }

    return "";
  };

  const atualizarCheckout = (campo, valor) => {
    setCheckout((prev) => ({ ...prev, [campo]: valor }));
  };

  const atualizarTelefoneCheckout = (valor) => {
    const somenteDigitos = valor.replace(/\D/g, "");

    if (!somenteDigitos) {
      atualizarCheckout("telefone", "");
      return;
    }

    const localBruto = somenteDigitos.startsWith("55")
      ? somenteDigitos.slice(2)
      : somenteDigitos;
    const local = localBruto.slice(0, 11);

    const ddd = local.slice(0, 2);
    const numero = local.slice(2, 11);

    let numeroFormatado = "";
    if (numero.length <= 4) {
      numeroFormatado = numero;
    } else if (numero.length <= 8) {
      numeroFormatado = `${numero.slice(0, 4)}-${numero.slice(4)}`;
    } else {
      numeroFormatado = `${numero.slice(0, 1)} ${numero.slice(1, 5)}-${numero.slice(5, 9)}`;
    }

    let telefoneFormatado = "+55";
    if (ddd.length > 0) {
      telefoneFormatado += ` (${ddd}`;
      if (ddd.length === 2) {
        telefoneFormatado += ")";
      }
    }

    if (numeroFormatado) {
      telefoneFormatado += ` ${numeroFormatado}`;
    }

    atualizarCheckout("telefone", telefoneFormatado.trim());
  };

  const atualizarNumeroCheckout = (valor) => {
    atualizarCheckout("numero", valor);
  };

  const avancarCheckout = () => {
    const erro = validarCheckout();
    if (erro) {
      setCheckoutErro(erro);
      return;
    }
    setCheckoutErro("");
    setCheckoutStep((prev) => Math.min(prev + 1, 3));
  };

  const voltarCheckout = () => {
    setCheckoutErro("");
    setCheckoutStep((prev) => Math.max(prev - 1, 1));
  };

  const iniciarCheckout = () => {
    setMetricasFunil(incrementarMetrica("inicioCheckout"));
    setCarrinhoAberto(false);
    setCheckoutErro("");
    setCheckoutStep(1);
    setCheckoutAberto(true);
  };

  const aplicarCupom = () => {
    const codigo = cupomCodigo.trim().toUpperCase();
    if (!codigo) {
      setCupomErro("Digite um cupom para aplicar.");
      return;
    }

    const encontrado = cuponsAtivos.find((cupom) => cupom.codigo.toUpperCase() === codigo);
    if (!encontrado) {
      setCupomErro("Cupom invalido ou inativo.");
      return;
    }

    setCupomAplicado(encontrado);
    setCupomErro("");
  };

  const removerCupom = () => {
    setCupomAplicado(null);
    setCupomCodigo("");
    setCupomErro("");
  };

  const alternarAcessoAdmin = () => {
    if (isAdmin) {
      setAuditoria(registrarEventoAuditoria("admin_logout"));
      setIsAdmin(false);
      if (tela === "operacao") {
        setTela("cardapio");
      }
      return;
    }

    if (adminBloqueadoAte && Date.now() < adminBloqueadoAte) {
      const restanteMinutos = Math.ceil((adminBloqueadoAte - Date.now()) / 60000);
      window.alert(`Acesso admin bloqueado temporariamente. Tente novamente em ${restanteMinutos} min.`);
      return;
    }

    if (adminBloqueadoAte && Date.now() >= adminBloqueadoAte) {
      setAdminBloqueadoAte(null);
      setTentativasAdmin(0);
    }

    const senha = window.prompt("Senha admin:", "");
    if (senha === ADMIN_PIN) {
      setIsAdmin(true);
      setTentativasAdmin(0);
      setAuditoria(registrarEventoAuditoria("admin_login_sucesso"));
      return;
    }

    if (senha !== null) {
      const totalTentativas = tentativasAdmin + 1;
      setTentativasAdmin(totalTentativas);
      setAuditoria(registrarEventoAuditoria("admin_login_falha", { tentativa: totalTentativas }));

      if (totalTentativas >= LIMITE_TENTATIVAS_ADMIN) {
        const bloqueioAte = Date.now() + BLOQUEIO_ADMIN_MINUTOS * 60000;
        setAdminBloqueadoAte(bloqueioAte);
        window.alert(`Acesso bloqueado por ${BLOQUEIO_ADMIN_MINUTOS} minutos.`);
        return;
      }

      window.alert("Senha invalida.");
    }
  };

  const alternarCampanhaNoDia = () => {
    if (!campanhaDestaque) {
      return;
    }

    const proximoCatalogo = {
      ...catalogo,
      campanhas: (catalogo.campanhas || []).map((campanha) =>
        campanha.id === campanhaDestaque.id
          ? { ...campanha, ativoNoDia: campanha.ativoNoDia === false }
          : campanha,
      ),
    };

    setCatalogo(proximoCatalogo);
    salvarCatalogo(proximoCatalogo);
    setAuditoria(
      registrarEventoAuditoria("campanha_toggle", {
        campanhaId: campanhaDestaque.id,
        ativoNoDia: campanhaDestaque.ativoNoDia === false,
      }),
    );
  };

  const mudarStatusPedido = (pedidoId, novoStatus) => {
    const atualizado = atualizarStatusPedido(pedidoId, novoStatus);
    setHistorico(atualizado);
    setAuditoria(registrarEventoAuditoria("pedido_status_alterado", { pedidoId, novoStatus }));
  };

  const finalizarPedido = () => {
    const mensagem = gerarMensagemWhatsApp(carrinho, combo, total, observacao, checkout);

    const novoPedido = {
      id: `ped-${Date.now()}`,
      data: new Date().toLocaleString("pt-BR"),
      itens: carrinho,
      total,
      descontoCupom,
      cupom: cupomAplicado ? cupomAplicado.codigo : null,
      combo: combo.ativo,
      checkout,
      status: STATUS_PEDIDO.NOVO,
      eventos: [
        {
          tipo: "criacao",
          descricao: "Pedido criado",
          data: new Date().toLocaleString("pt-BR"),
        },
      ],
    };

    const atualizado = salvarPedidoNoHistorico(novoPedido);
    setHistorico(atualizado);
  setMetricasFunil(incrementarMetrica("pedidosFinalizados"));

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`, "_blank");

    setCarrinho([]);
    setObservacao("");
    setCarrinhoAberto(false);
    setCheckoutAberto(false);
    setCheckoutStep(1);
    setCheckoutErro("");
    removerCupom();
  };

  const itensDaAbaBase = aba === "massas" ? massasCardapio : pasteisCardapio;
  const maisPedidos = maisPedidosIds
    .map((ref) => {
      const base = ref.tipo === "massa" ? massasCardapio : pasteisCardapio;
      const item = base.find((m) => m.id === ref.id);
      return item ? { ...item, tipo: ref.tipo } : null;
    })
    .filter(Boolean);
  const termoBusca = busca.trim().toLowerCase();
  const itensDaAba = termoBusca
    ? itensDaAbaBase.filter((item) =>
        `${item.nome} ${item.descricao}`.toLowerCase().includes(termoBusca),
      )
    : itensDaAbaBase;

  const pedidosOperacao = historico.filter((pedido) =>
    filtroStatusOperacao === "todos" ? true : pedido.status === filtroStatusOperacao,
  );
  const alertasSLA = useMemo(() => getAlertasSLA(historico), [historico]);

  const gerarRelatorioDiario = () => {
    const relatorio = gerarRelatorioDiarioPedidos(historico);
    setRelatorioDiario(relatorio);
    setAuditoria(registrarEventoAuditoria("relatorio_diario_gerado", { totalPedidos: historico.length }));
  };

  const baixarBackupSistema = () => {
    const backup = gerarBackupJSON({
      catalogo,
      historico,
      metricas: metricasFunil,
      auditoria,
    });

    const blob = new Blob([backup], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `backup-rose-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setAuditoria(registrarEventoAuditoria("backup_exportado"));
  };

  const baixarRelatorioCSV = () => {
    if (!relatorioDiario) {
      return;
    }

    const csv = relatorioDiario
      .split("\n")
      .map((linha) => `"${linha.replace(/"/g, '""')}"`)
      .join("\n");

    const blob = new Blob([`linha\n${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `relatorio-rose-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const baixarRelatorioPDF = async () => {
    if (!relatorioDiario) {
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const linhas = relatorioDiario.split("\n");
    let y = 50;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    linhas.forEach((linha) => {
      if (y > 790) {
        doc.addPage();
        y = 50;
      }
      doc.text(linha || " ", 40, y);
      y += 18;
    });

    doc.save(`relatorio-rose-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="app-shell">
      <style>{CSS}</style>

      <div className={`status ${aberto ? "open" : "closed"}`}>
        {aberto
          ? `Loja aberta ate ${HORARIO_FECHAMENTO}h`
          : `Loja fechada agora - abre as ${HORARIO_ABERTURA}h`}
      </div>

      {tela !== "hero" && (
        <header className="header">
          <div className="logo">
            <span className="logo-main">ROSE</span>
            <span className="logo-sub">Delivery</span>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn" onClick={alternarAcessoAdmin}>
              {isAdmin ? "Sair Admin" : "Admin"}
            </button>
            <button className={`btn secondary carrinho-btn ${pulseCarrinho ? "pulse" : ""}`} onClick={() => setCarrinhoAberto(true)}>
              Carrinho ({totalItens})
            </button>
          </div>
        </header>
      )}

      {tela === "hero" && (
        <section className="hero">
          <div className="hero-card">
            <h1 className="hero-title">ROSE</h1>
            <div className="hero-sub">Delivery</div>
            <div className="hero-phone">(38) 99735-5426</div>
            <p>
              Massas e pasteis com o sabor da casa, em uma experiencia de pedido rapida,
              elegante e direta no WhatsApp.
            </p>
            <button className="btn primary" onClick={() => setTela("cardapio")}>Ver cardapio</button>
          </div>
        </section>
      )}

      {tela === "cardapio" && (
        <section className="section">
          <div className="section-head">
            <p>Escolha seus favoritos e monte seu pedido com adicionais.</p>
          </div>

          <div className="quick-tags">
            <span className="quick-tag">Entrega rapida</span>
            <span className="quick-tag">Combo da casa</span>
            <span className="quick-tag">Adicionais</span>
            <span className="quick-tag">Pedido no WhatsApp</span>
          </div>

          {campanhasAtivas.length > 0 && (
            <div className="campanha-banner">
              {campanhasAtivas[0].titulo}: {campanhasAtivas[0].descricao}
            </div>
          )}

          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Buscar no cardapio"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <span className="search-icon">🔎</span>
          </div>

          <div className="block-title">Mais pedidos</div>
          <div className="top-row">
            {maisPedidos.map((item) => (
              <article key={`top-${item.id}`} className="top-card">
                <img src={item.foto} alt={item.nome} />
                <div className="top-body">
                  <div className="top-type">{item.tipo === "massa" ? "Macarrao" : "Pastel"}</div>
                  <div className="top-name">{item.nome}</div>
                  <div className="top-price">
                    {item.tipo === "massa"
                      ? formatPrecoMassaCard(item.precos)
                      : formatBRL(item.preco)}
                  </div>
                  <button className="btn secondary add-to-cart top-action" onClick={() => abrirModal(item, item.tipo)}>
                    {textoCTA}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="block-title">Monte o seu</div>
          <div className="tabs">
            <button className={`tab ${aba === "massas" ? "active" : ""}`} onClick={() => setAba("massas")}>
              <span className="tab-icon">🍝</span>
              <span>Macarrao</span>
            </button>
            <button className={`tab ${aba === "pasteis" ? "active" : ""}`} onClick={() => setAba("pasteis")}>
              <span className="tab-icon">🥟</span>
              <span>Pastel</span>
            </button>
          </div>

          {combo.ativo && <div className="combo">{combo.mensagem}</div>}

          <div className="grid">
            {itensDaAba.map((item) => (
              <article key={item.id} className={`card ${item.destaque ? "destaque" : ""} ${itemAnimado === item.id ? "flash" : ""}`}>
                {item.destaque && <span className="card-badge">Destaque</span>}
                <img src={item.foto} alt={item.nome} />
                <div className="card-body">
                  <h3>{item.emoji} {item.nome}</h3>
                  <p>{item.descricao}</p>
                  <div className="row">
                    <strong className="price-tag">
                      {aba === "massas"
                        ? formatPrecoMassaCard(item.precos)
                        : formatBRL(item.preco)}
                    </strong>
                    <button className="btn secondary add-to-cart" onClick={() => abrirModal(item, aba === "massas" ? "massa" : "pastel")}>{textoCTA}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {itensDaAba.length === 0 && (
            <div className="empty-state">
              Nenhum item encontrado para "{busca}".
            </div>
          )}
        </section>
      )}

      {tela === "historico" && (
        <section className="section">
          <h2>Historico</h2>
          {historico.length === 0 && <p>Nenhum pedido ainda.</p>}
          {historico.map((pedido, idx) => (
            <div key={`${pedido.data}-${idx}`} className="hist">
              <div><strong>{pedido.data}</strong></div>
              {pedido.itens.map((item) => (
                <div key={item.chave}>
                  - {item.qty}x {item.nome} {item.tamanho ? `(${item.tamanho})` : ""} - {formatBRL(item.subtotal)}
                  {item.ingredientes?.length > 0 ? ` | Ingredientes: ${item.ingredientes.join(", ")}` : ""}
                </div>
              ))}
              <div>Status: <strong>{STATUS_LABEL[pedido.status] || "Novo"}</strong></div>
              {pedido.combo && <div>Combo aplicado: -{formatBRL(5)}</div>}
              <div><strong>Total: {formatBRL(pedido.total)}</strong></div>
            </div>
          ))}
        </section>
      )}

      {tela === "operacao" && isAdmin && (
        <section className="section">
          <h2>Operacao</h2>

          <div className="operacao-tabs">
            <button
              className={`operacao-tab ${abaOperacao === "pedidos" ? "active" : ""}`}
              onClick={() => setAbaOperacao("pedidos")}
            >
              Pedidos
            </button>
            <button
              className={`operacao-tab ${abaOperacao === "relatorios" ? "active" : ""}`}
              onClick={() => setAbaOperacao("relatorios")}
            >
              Relatorios
            </button>
          </div>

          {abaOperacao === "pedidos" && (
            <>
              {alertasSLA.length > 0 && (
                <div className="alertas-sla">
                  <h3>Alertas de Pedido</h3>
                  {alertasSLA.slice(0, 5).map((alerta) => {
                    const prioridade = alerta.minutos >= alerta.limite + 10 ? "atrasado" : "proximo";

                    return (
                      <div key={alerta.pedidoId} className={`alerta-item ${prioridade}`}>
                        <span className="tag">{prioridade === "atrasado" ? "Urgente" : "Atencao"}</span>
                        <span>
                          Pedido {alerta.pedidoId} ({alerta.cliente}) em {STATUS_LABEL[alerta.status] || alerta.status} ha {alerta.minutos} min
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="operacao-filter">
                <button
                  className={filtroStatusOperacao === "todos" ? "active" : ""}
                  onClick={() => setFiltroStatusOperacao("todos")}
                >
                  Todos
                </button>
                {STATUS_ORDEM.map((status) => (
                  <button
                    key={status}
                    className={filtroStatusOperacao === status ? "active" : ""}
                    onClick={() => setFiltroStatusOperacao(status)}
                  >
                    {STATUS_LABEL[status]}
                  </button>
                ))}
              </div>

              {pedidosOperacao.length === 0 && <p>Nenhum pedido para este filtro.</p>}

              {pedidosOperacao.map((pedido) => (
                <article key={pedido.id} className="operacao-card">
                  <div className="row">
                    <strong>{pedido.checkout?.nome || "Cliente"}</strong>
                    <span className="status-chip">{STATUS_LABEL[pedido.status] || "Novo"}</span>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#6f565d" }}>
                    {pedido.checkout?.rua ? `${pedido.checkout.rua}, ${pedido.checkout.numero || "s/n"}` : "Endereco nao informado"}
                    {pedido.checkout?.bairro ? ` - ${pedido.checkout.bairro}` : ""}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#6f565d" }}>
                    {pedido.data} • Total: {formatBRL(pedido.total || 0)}
                  </div>

                  <div className="status-actions">
                    {STATUS_ORDEM.map((status) => (
                      <button
                        key={`${pedido.id}-${status}`}
                        className={pedido.status === status ? "active" : ""}
                        onClick={() => mudarStatusPedido(pedido.id, status)}
                      >
                        {STATUS_LABEL[status]}
                      </button>
                    ))}
                  </div>

                  <div className="timeline">
                    {(pedido.eventos || []).slice(0, 5).map((evento, idx) => (
                      <div key={`${pedido.id}-evento-${idx}`} className="timeline-item">
                        {evento.data} - {evento.descricao}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </>
          )}

          {abaOperacao === "relatorios" && (
            <div className="operacao-card">
              <div className="row">
                <strong>Relatorio diario</strong>
                <button className="btn secondary" onClick={gerarRelatorioDiario}>Gerar</button>
              </div>
              {campanhaDestaque && (
                <div className="row" style={{ marginTop: 10 }}>
                  <span>
                    Campanha do dia: <strong>{campanhaDestaque.titulo}</strong>
                  </span>
                  <button className="btn" onClick={alternarCampanhaNoDia}>
                    {campanhaDestaque.ativoNoDia === false ? "Ativar hoje" : "Desativar hoje"}
                  </button>
                </div>
              )}
              <div className="metricas-funil">
                <div className="metrica-item">Visualizacoes cardapio: {metricasFunil.visualizacoesCardapio || 0}</div>
                <div className="metrica-item">Adicoes ao carrinho: {metricasFunil.adicoesCarrinho || 0}</div>
                <div className="metrica-item">Inicio de checkout: {metricasFunil.inicioCheckout || 0}</div>
                <div className="metrica-item">Pedidos finalizados: {metricasFunil.pedidosFinalizados || 0}</div>
                <div className="metrica-item">
                  Cliques CTA A/B: A {metricasFunil.variacaoAB?.A?.cliquesCTA || 0} | B {metricasFunil.variacaoAB?.B?.cliquesCTA || 0}
                </div>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <strong>Governanca</strong>
                <button className="btn" onClick={baixarBackupSistema}>Baixar backup JSON</button>
              </div>
              <div className="metricas-funil">
                {(auditoria || []).slice(0, 5).map((evento) => (
                  <div key={evento.id} className="metrica-item">
                    {evento.data} - {evento.acao}
                  </div>
                ))}
                {(!auditoria || auditoria.length === 0) && (
                  <div className="metrica-item">Sem eventos de auditoria registrados.</div>
                )}
              </div>
              {relatorioDiario ? (
                <>
                  <textarea className="relatorio-box" readOnly value={relatorioDiario} />
                  <div className="relatorio-actions">
                    <button className="btn" onClick={() => setRelatorioDiario("")}>Fechar</button>
                    <button className="btn" onClick={baixarRelatorioCSV}>Baixar CSV</button>
                    <button className="btn secondary" onClick={baixarRelatorioPDF}>Baixar PDF</button>
                  </div>
                </>
              ) : (
                <p style={{ marginTop: 8, fontSize: 12, color: "#70565c" }}>
                  Clique em Gerar para criar o resumo diario automatico.
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {modalItem && (
        <div className="modal-backdrop" onClick={() => setModalItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{modalItem.nome}</h3>
            <p>{modalItem.descricao}</p>

            {modalItem.tipo === "massa" && (
              <>
                <div className="section-label">Escolha o tamanho</div>
                <div className="size-grid">
                  <button className={`size-option ${tamanho === "P" ? "active" : ""}`} onClick={() => setTamanho("P")}>
                    <strong>Pequeno</strong>
                    <span>{formatBRL(modalItem.precos.P)}</span>
                  </button>
                  <button className={`size-option ${tamanho === "G" ? "active" : ""}`} onClick={() => setTamanho("G")}>
                    <strong>Grande</strong>
                    <span>{formatBRL(modalItem.precos.G)}</span>
                  </button>
                </div>
              </>
            )}

            {modalItem.personalizavel ? (
              <>
                <div className="section-label">Ingredientes</div>
                <div className="pills">
                  {(modalItem.tipo === "massa" ? ingredientesMassa : ingredientesPastel).map((a) => (
                    <button
                      key={a.id}
                      className={`pill ${ingredientes.includes(a.nome) ? "active" : ""}`}
                      onClick={() => alternarIngrediente(a.nome)}
                    >
                      {a.nome} (+{formatBRL(a.preco)})
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="section-label">Adicionais</div>
                <div className="pills">
                  {adicionaisCardapio.map((a) => (
                    <button
                      key={a.id}
                      className={`pill ${adicionais.includes(a.nome) ? "active" : ""}`}
                      onClick={() => alternarAdicional(a.nome)}
                    >
                      {a.nome} {a.preco ? `(+${formatBRL(a.preco)})` : "(Gratis)"}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => setModalItem(null)}>Cancelar</button>
              <button className="btn secondary" onClick={confirmarItem}>Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {carrinhoAberto && (
        <>
          <div className="drawer-backdrop" onClick={() => setCarrinhoAberto(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <strong>Seu pedido</strong>
              <button className="btn" onClick={() => setCarrinhoAberto(false)}>Fechar</button>
            </div>

            <div className="drawer-body">
              {carrinho.length === 0 && <p>Seu carrinho esta vazio.</p>}
              {carrinho.map((item) => (
                <div key={item.chave} className="item">
                  <div className="row">
                    <div>
                      <strong>{item.nome}</strong> {item.tamanho ? `(${item.tamanho})` : ""}
                      {item.ingredientes?.length > 0 && <div>Ingredientes: {item.ingredientes.join(", ")}</div>}
                      {item.adicionais.length > 0 && <div>+ {item.adicionais.join(", ")}</div>}
                    </div>
                    <strong>{formatBRL(item.subtotal)}</strong>
                  </div>
                  <div className="qty">
                    <button onClick={() => alterarQtd(item.chave, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => alterarQtd(item.chave, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {carrinho.length > 0 && (
              <div className="drawer-foot">
                <label htmlFor="obs"><strong>Observacao</strong></label>
                <textarea
                  id="obs"
                  rows={2}
                  className="field"
                  placeholder="Ex: sem cebola"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />

                <div className="row" style={{ marginTop: 10 }}>
                  <span>Subtotal</span>
                  <strong>{formatBRL(subtotal)}</strong>
                </div>
                {combo.ativo && (
                  <div className="row">
                    <span>Combo</span>
                    <strong>-{formatBRL(combo.desconto)}</strong>
                  </div>
                )}
                <div className="cupom-box">
                  {!cupomAplicado ? (
                    <>
                      <div className="cupom-row">
                        <input
                          className="field"
                          placeholder="Cupom de desconto"
                          value={cupomCodigo}
                          onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
                        />
                        <button className="btn" onClick={aplicarCupom}>Aplicar</button>
                      </div>
                      {cupomErro && <div className="cupom-erro">{cupomErro}</div>}
                    </>
                  ) : (
                    <div className="row">
                      <div className="cupom-info">Cupom {cupomAplicado.codigo} aplicado</div>
                      <button className="btn" onClick={removerCupom}>Remover</button>
                    </div>
                  )}
                </div>
                {descontoCupom > 0 && (
                  <div className="row" style={{ marginTop: 6 }}>
                    <span>Desconto cupom</span>
                    <strong>-{formatBRL(descontoCupom)}</strong>
                  </div>
                )}
                <div className="row" style={{ margin: "8px 0 10px" }}>
                  <span>Total</span>
                  <strong>{formatBRL(total)}</strong>
                </div>

                <button className="btn primary" disabled={!aberto} onClick={iniciarCheckout} style={{ width: "100%" }}>
                  {aberto ? "Ir para checkout" : "Loja fechada"}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {checkoutAberto && (
        <>
          <div className="drawer-backdrop" onClick={() => setCheckoutAberto(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <strong>Checkout</strong>
              <button className="btn" onClick={() => setCheckoutAberto(false)}>Fechar</button>
            </div>

            <div className="drawer-body">
              <div className="checkout-card">
                <h3 className="checkout-title">Finalizar pedido</h3>
                <p className="checkout-step">Etapa {checkoutStep} de 3</p>

                {checkoutStep === 1 && (
                  <div className="checkout-grid">
                    <input className="field" placeholder="Nome" value={checkout.nome} onChange={(e) => atualizarCheckout("nome", e.target.value)} />
                    <input
                      className="field"
                      placeholder="+55 (11) 9 9999-9999"
                      value={checkout.telefone}
                      inputMode="tel"
                      onChange={(e) => atualizarTelefoneCheckout(e.target.value)}
                    />
                  </div>
                )}

                {checkoutStep === 2 && (
                  <div className="checkout-grid">
                    <input className="field" placeholder="Rua" value={checkout.rua} onChange={(e) => atualizarCheckout("rua", e.target.value)} />
                    <input
                      className="field"
                      placeholder="Numero (ou s/n)"
                      value={checkout.numero}
                      inputMode="text"
                      onChange={(e) => atualizarNumeroCheckout(e.target.value)}
                    />
                    <input className="field" placeholder="Bairro" value={checkout.bairro} onChange={(e) => atualizarCheckout("bairro", e.target.value)} />
                    <input className="field" placeholder="Complemento (opcional)" value={checkout.complemento} onChange={(e) => atualizarCheckout("complemento", e.target.value)} />
                    <input className="field" placeholder="Referencia (opcional)" value={checkout.referencia} onChange={(e) => atualizarCheckout("referencia", e.target.value)} />
                  </div>
                )}

                {checkoutStep === 3 && (
                  <div className="checkout-grid">
                    <div className="section-label">Forma de pagamento</div>
                    <div className="payment-group">
                      {["Pix", "Dinheiro", "Cartao"].map((modo) => (
                        <button
                          key={modo}
                          className={`pay-btn ${checkout.pagamento === modo ? "active" : ""}`}
                          onClick={() => atualizarCheckout("pagamento", modo)}
                        >
                          {modo}
                        </button>
                      ))}
                    </div>
                    <div className="row" style={{ marginTop: 6 }}>
                      <span>Subtotal</span>
                      <strong>{formatBRL(subtotal)}</strong>
                    </div>
                    {combo.ativo && (
                      <div className="row">
                        <span>Combo</span>
                        <strong>-{formatBRL(combo.desconto)}</strong>
                      </div>
                    )}
                    {descontoCupom > 0 && (
                      <div className="row">
                        <span>Cupom {cupomAplicado?.codigo || ""}</span>
                        <strong>-{formatBRL(descontoCupom)}</strong>
                      </div>
                    )}
                    <div className="row">
                      <span>Total</span>
                      <strong>{formatBRL(total)}</strong>
                    </div>
                  </div>
                )}

                {checkoutErro && <div className="checkout-error">{checkoutErro}</div>}
              </div>
            </div>

            <div className="drawer-foot">
              <div className="row">
                {checkoutStep > 1 ? (
                  <button className="btn" onClick={voltarCheckout}>Voltar</button>
                ) : (
                  <button className="btn" onClick={() => setCheckoutAberto(false)}>Cancelar</button>
                )}

                {checkoutStep < 3 ? (
                  <button className="btn secondary" onClick={avancarCheckout}>Continuar</button>
                ) : (
                  <button className="btn primary" disabled={!aberto} onClick={finalizarPedido}>
                    {aberto ? "Enviar no WhatsApp" : "Loja fechada"}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {tela !== "hero" && (
        <nav className="nav">
          <button className={tela === "cardapio" ? "active" : ""} onClick={() => setTela("cardapio")}>Cardapio</button>
          <button onClick={() => setCarrinhoAberto(true)}>Carrinho ({totalItens})</button>
          <button className={tela === "historico" ? "active" : ""} onClick={() => setTela("historico")}>Historico</button>
          {isAdmin ? (
            <button className={tela === "operacao" ? "active" : ""} onClick={() => setTela("operacao")}>Operacao</button>
          ) : (
            <button disabled style={{ opacity: 0.35, cursor: "not-allowed" }}>Operacao</button>
          )}
        </nav>
      )}
    </div>
  );
}
