import { useEffect, useMemo, useState } from "react";

const HORARIO_ABERTURA = 11;
const HORARIO_FECHAMENTO = 22;
const WHATSAPP_NUMBER = "5538997355426";

const MASSAS = [
  {
    id: "bolonhesa",
    nome: "Bolonhesa",
    descricao: "Molho vermelho, carne moida, milho e mussarela",
    emoji: "🍝",
    precos: { P: 15, G: 25 },
    foto: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
    destaque: false,
  },
  {
    id: "gourmet",
    nome: "Gourmet",
    descricao: "Molho branco, brocolis, bacon e mussarela",
    emoji: "🧀",
    precos: { P: 18, G: 28 },
    foto: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80",
    destaque: false,
  },
  {
    id: "misto",
    nome: "Misto",
    descricao: "Bolonhesa e Gourmet no mesmo prato",
    emoji: "✨",
    precos: { P: 18, G: 28 },
    foto: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80",
    destaque: false,
  },
  {
    id: "da-casa",
    nome: "Da Casa",
    descricao: "Molho especial com carne, frango, bacon, calabresa e catupiry",
    emoji: "🏡",
    precos: { P: 22, G: 32 },
    foto: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&q=80",
    destaque: true,
  },
  {
    id: "monte-seu-macarrao",
    nome: "Monte seu Macarrao",
    descricao: "Escolha os ingredientes e monte do seu jeito",
    emoji: "🛠️",
    precos: { P: 14, G: 22 },
    foto: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
    destaque: false,
    personalizavel: true,
  },
];

const PASTEIS = [
  {
    id: "pastel-frango",
    nome: "Frango",
    descricao: "Frango temperado e suculento",
    emoji: "🍗",
    preco: 10,
    foto: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    destaque: false,
  },
  {
    id: "pastel-pizza",
    nome: "Pizza",
    descricao: "Queijo, presunto e oregano",
    emoji: "🍕",
    preco: 10,
    foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    destaque: false,
  },
  {
    id: "pastel-carne",
    nome: "Carne",
    descricao: "Carne moida bem temperada",
    emoji: "🥩",
    preco: 10,
    foto: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80",
    destaque: false,
  },
  {
    id: "pastel-carne-seca",
    nome: "Carne Seca com Queijo",
    descricao: "Carne seca desfiada com queijo derretido",
    emoji: "⭐",
    preco: 15,
    foto: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80",
    destaque: true,
  },
  {
    id: "monte-seu-pastel",
    nome: "Monte seu Pastel",
    descricao: "Escolha os ingredientes e monte do seu jeito",
    emoji: "🛠️",
    preco: 8,
    foto: "https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400&q=80",
    destaque: false,
    personalizavel: true,
  },
];

const INGREDIENTES_MASSA = [
  { id: "frango", nome: "Frango", preco: 4 },
  { id: "carne-moida", nome: "Carne moida", preco: 4 },
  { id: "bacon", nome: "Bacon", preco: 3 },
  { id: "calabresa", nome: "Calabresa", preco: 3 },
  { id: "brocolis", nome: "Brocolis", preco: 2 },
  { id: "milho", nome: "Milho", preco: 2 },
  { id: "mussarela", nome: "Mussarela", preco: 3 },
  { id: "catupiry", nome: "Catupiry", preco: 3 },
];

const INGREDIENTES_PASTEL = [
  { id: "frango", nome: "Frango", preco: 4 },
  { id: "carne", nome: "Carne", preco: 4 },
  { id: "carne-seca", nome: "Carne seca", preco: 5 },
  { id: "queijo", nome: "Queijo", preco: 3 },
  { id: "presunto", nome: "Presunto", preco: 3 },
  { id: "catupiry", nome: "Catupiry", preco: 3 },
  { id: "vinagrete", nome: "Vinagrete", preco: 1 },
  { id: "bacon", nome: "Bacon", preco: 3 },
];

const ADICIONAIS = [
  { id: "bacon", nome: "Bacon", preco: 3 },
  { id: "catupiry", nome: "Catupiry", preco: 3 },
  { id: "queijo", nome: "Queijo", preco: 3 },
  { id: "vinagrete", nome: "Vinagrete", preco: 0 },
];

const formatBRL = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

const formatPrecoMassaCard = (precos) => {
  const menorPreco = Math.min(precos.P, precos.G);
  return `A partir de ${formatBRL(menorPreco)}`;
};

const estaAbertaAgora = () => {
  const horaAtual = new Date().getHours();
  return horaAtual >= HORARIO_ABERTURA && horaAtual < HORARIO_FECHAMENTO;
};

const detectarCombo = (itens) => {
  const temMassa = itens.some((i) => i.tipo === "massa");
  const temPastel = itens.some((i) => i.tipo === "pastel");
  if (!temMassa || !temPastel) {
    return { ativo: false, desconto: 0, mensagem: "" };
  }
  return {
    ativo: true,
    desconto: 5,
    mensagem: "Combo Massa + Pastel ativo: R$ 5,00 de desconto",
  };
};

const gerarMensagemWhatsApp = (itens, combo, total, observacao) => {
  let msg = "Pedido Rose Delivery\n\n";

  const massas = itens.filter((i) => i.tipo === "massa");
  const pasteis = itens.filter((i) => i.tipo === "pastel");

  if (massas.length) {
    msg += "Massas:\n";
    massas.forEach((item) => {
      msg += `- ${item.qty}x ${item.nome} (${item.tamanho}) - ${formatBRL(item.subtotal)}\n`;
      if (item.ingredientes?.length) {
        msg += `  Ingredientes: ${item.ingredientes.join(", ")}\n`;
      }
      if (item.adicionais.length) {
        msg += `  + ${item.adicionais.join(", ")}\n`;
      }
    });
    msg += "\n";
  }

  if (pasteis.length) {
    msg += "Pasteis:\n";
    pasteis.forEach((item) => {
      msg += `- ${item.qty}x ${item.nome} - ${formatBRL(item.subtotal)}\n`;
      if (item.ingredientes?.length) {
        msg += `  Ingredientes: ${item.ingredientes.join(", ")}\n`;
      }
      if (item.adicionais.length) {
        msg += `  + ${item.adicionais.join(", ")}\n`;
      }
    });
    msg += "\n";
  }

  if (combo.ativo) {
    msg += `${combo.mensagem}\n\n`;
  }

  if (observacao.trim()) {
    msg += `Observacao: ${observacao.trim()}\n\n`;
  }

  msg += `Total: ${formatBRL(total)}\n`;
  msg += "Aguardo confirmacao do pedido.";

  return encodeURIComponent(msg);
};

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
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0 10px;
  margin-bottom: 8px;
  scrollbar-width: none;
}
.quick-tags::-webkit-scrollbar { display: none; }
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
  font-size: 14px;
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
  display: flex;
  gap: 9px;
  overflow-x: auto;
  padding: 0 0 10px;
  scrollbar-width: none;
}

.top-row::-webkit-scrollbar { display: none; }

.top-card {
  min-width: 204px;
  max-width: 204px;
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
  font-family: inherit;
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

.nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  background: #fff;
  border-top: 1px solid #e7d8cf;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
}
`;

export default function App() {
  const [tela, setTela] = useState("cardapio");
  const [aba, setAba] = useState("massas");
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [observacao, setObservacao] = useState("");
  const [busca, setBusca] = useState("");
  const [itemAnimado, setItemAnimado] = useState("");
  const [pulseCarrinho, setPulseCarrinho] = useState(false);

  const [modalItem, setModalItem] = useState(null);
  const [tamanho, setTamanho] = useState("G");
  const [adicionais, setAdicionais] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  const aberto = estaAbertaAgora();
  const combo = useMemo(() => detectarCombo(carrinho), [carrinho]);

  const subtotal = carrinho.reduce((acc, i) => acc + i.subtotal, 0);
  const total = subtotal - combo.desconto;
  const totalItens = carrinho.reduce((acc, i) => acc + i.qty, 0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rose_historico") || "[]";
      setHistorico(JSON.parse(raw));
    } catch {
      setHistorico([]);
    }
  }, []);

  const abrirModal = (item, tipo) => {
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
    const ingredientesBase = isMassa ? INGREDIENTES_MASSA : INGREDIENTES_PASTEL;
    const ingredientesSelecionados = modalItem.personalizavel ? ingredientes : [];
    const adicionaisSelecionados = modalItem.personalizavel ? [] : adicionais;

    const addIngredientes = ingredientesSelecionados.reduce((acc, nome) => {
      const item = ingredientesBase.find((a) => a.nome === nome);
      return acc + (item?.preco || 0);
    }, 0);

    const addAdicionais = adicionaisSelecionados.reduce((acc, nome) => {
      const item = ADICIONAIS.find((a) => a.nome === nome);
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

  const finalizarPedido = () => {
    const mensagem = gerarMensagemWhatsApp(carrinho, combo, total, observacao);

    const novoPedido = {
      data: new Date().toLocaleString("pt-BR"),
      itens: carrinho,
      total,
      combo: combo.ativo,
    };

    const atualizado = [novoPedido, ...historico].slice(0, 10);
    setHistorico(atualizado);
    localStorage.setItem("rose_historico", JSON.stringify(atualizado));

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`, "_blank");

    setCarrinho([]);
    setObservacao("");
    setCarrinhoAberto(false);
  };

  const itensDaAbaBase = aba === "massas" ? MASSAS : PASTEIS;
  const maisPedidos = [
    { ...MASSAS.find((item) => item.id === "da-casa"), tipo: "massa" },
    { ...PASTEIS.find((item) => item.id === "pastel-carne-seca"), tipo: "pastel" },
    { ...MASSAS.find((item) => item.id === "gourmet"), tipo: "massa" },
    { ...PASTEIS.find((item) => item.id === "pastel-pizza"), tipo: "pastel" },
  ].filter(Boolean);
  const termoBusca = busca.trim().toLowerCase();
  const itensDaAba = termoBusca
    ? itensDaAbaBase.filter((item) =>
        `${item.nome} ${item.descricao}`.toLowerCase().includes(termoBusca),
      )
    : itensDaAbaBase;

  return (
    <>
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
          <button className={`btn secondary carrinho-btn ${pulseCarrinho ? "pulse" : ""}`} onClick={() => setCarrinhoAberto(true)}>
            Carrinho ({totalItens})
          </button>
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
                    Pedir agora
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
                    <button className="btn secondary add-to-cart" onClick={() => abrirModal(item, aba === "massas" ? "massa" : "pastel")}>Pedir</button>
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
              {pedido.combo && <div>Combo aplicado: -{formatBRL(5)}</div>}
              <div><strong>Total: {formatBRL(pedido.total)}</strong></div>
            </div>
          ))}
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
                  {(modalItem.tipo === "massa" ? INGREDIENTES_MASSA : INGREDIENTES_PASTEL).map((a) => (
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
                  {ADICIONAIS.map((a) => (
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
                <div className="row" style={{ margin: "8px 0 10px" }}>
                  <span>Total</span>
                  <strong>{formatBRL(total)}</strong>
                </div>

                <button className="btn primary" disabled={!aberto} onClick={finalizarPedido} style={{ width: "100%" }}>
                  {aberto ? "Enviar no WhatsApp" : "Loja fechada"}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {tela !== "hero" && (
        <nav className="nav">
          <button className={tela === "cardapio" ? "active" : ""} onClick={() => setTela("cardapio")}>Cardapio</button>
          <button onClick={() => setCarrinhoAberto(true)}>Carrinho ({totalItens})</button>
          <button className={tela === "historico" ? "active" : ""} onClick={() => setTela("historico")}>Historico</button>
        </nav>
      )}
    </>
  );
}
