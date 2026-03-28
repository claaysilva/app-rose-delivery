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
@import url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Manrope:wght@500;700;800&display=swap');

* { box-sizing: border-box; }
:root {
  --brand-wine: #7a2f3c;
  --brand-wine-dark: #5a1f2b;
  --brand-gold: #c79f18;
  --paper: #f5f2eb;
  --paper-2: #fcfbf8;
  --ink: #2f1f23;
  --muted: #7d6268;
  --ok: #1d7a4d;
}
body {
  margin: 0;
  color: var(--ink);
  font-family: "Manrope", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at 10% 0%, #fffdf9 0%, transparent 45%),
    radial-gradient(circle at 90% 100%, #efe6d2 0%, transparent 40%),
    var(--paper);
}

.status {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.status::before {
  content: "";
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #fff;
}
.status.open { background: linear-gradient(120deg, #2f8a58, var(--ok)); }
.status.closed { background: linear-gradient(120deg, var(--brand-wine-dark), var(--brand-wine)); }

.header {
  position: sticky;
  top: 36px;
  z-index: 14;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 10px;
  border: 1px solid rgba(122, 47, 60, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: 0 10px 28px rgba(67, 29, 37, 0.08);
}
.logo {
  display: grid;
  line-height: 1;
}
.logo-main {
  font-family: "Bree Serif", serif;
  color: var(--brand-wine);
  font-size: 30px;
  letter-spacing: 1px;
}
.logo-sub {
  font-size: 12px;
  font-weight: 800;
  color: var(--muted);
  margin-top: 2px;
}

.hero {
  min-height: 86vh;
  position: relative;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 24px;
  overflow: hidden;
  background:
    linear-gradient(170deg, rgba(122, 47, 60, 0.9), rgba(95, 31, 45, 0.92)),
    radial-gradient(circle at 15% 10%, rgba(199, 159, 24, 0.2), transparent 40%),
    url('/brand-menu.png');
  background-size: cover, auto, cover;
  background-position: center;
  background-blend-mode: normal, normal, soft-light;
  color: #fff;
}
.hero::before,
.hero::after {
  content: "";
  position: absolute;
  width: 280px;
  height: 280px;
  border: 1px solid rgba(199, 159, 24, 0.4);
  border-radius: 26px;
}
.hero::before { left: -160px; top: -120px; transform: rotate(22deg); }
.hero::after { right: -140px; bottom: -130px; transform: rotate(18deg); }
.hero-card {
  position: relative;
  z-index: 2;
  width: min(760px, 100%);
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  padding: 36px 22px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
  animation: fadeUp 0.6s ease;
}
.hero-title {
  margin: 0;
  font-family: "Bree Serif", serif;
  letter-spacing: 1px;
  line-height: 0.95;
  font-size: clamp(52px, 12vw, 96px);
}
.hero-sub {
  margin: 2px 0 10px;
  font-size: clamp(28px, 7vw, 46px);
  font-weight: 800;
  color: #fff6de;
}
.hero-phone {
  margin: 0 0 16px;
  font-size: 18px;
  color: #fff1d3;
  font-weight: 700;
}
.hero p {
  max-width: 560px;
  margin: 0 auto 20px;
  color: #f7ebd0;
  font-size: 16px;
}

.btn {
  border: 0;
  border-radius: 14px;
  padding: 11px 16px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn.primary {
  background: var(--brand-gold);
  color: #3f2a08;
  box-shadow: 0 12px 24px rgba(199, 159, 24, 0.35);
}
.btn.secondary {
  background: linear-gradient(120deg, var(--brand-wine), var(--brand-wine-dark));
  color: #fff;
}

.section {
  max-width: 1120px;
  margin: 0 auto;
  padding: 18px 14px 110px;
}
.section h2 {
  font-family: "Bree Serif", serif;
  color: var(--brand-wine);
  margin: 0;
  font-size: clamp(30px, 5vw, 42px);
}
.section-head {
  margin-bottom: 14px;
}
.section-head p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  position: sticky;
  top: 98px;
  z-index: 12;
  background: linear-gradient(180deg, var(--paper) 0%, rgba(245, 242, 235, 0.92) 70%, rgba(245, 242, 235, 0));
  padding: 8px 0 12px;
}
.tab {
  flex: 1;
  border: 1px solid rgba(122, 47, 60, 0.18);
  background: var(--paper-2);
  color: var(--brand-wine);
  border-radius: 14px;
  min-height: 52px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.tab.active {
  background: linear-gradient(120deg, var(--brand-wine), var(--brand-wine-dark));
  color: #fff;
  border-color: transparent;
}
.tab-icon { font-size: 16px; line-height: 1; }

.combo {
  background: linear-gradient(120deg, #f2df9f, #eacc6a);
  color: #3d2a08;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 14px;
  border: 1px solid rgba(199, 159, 24, 0.45);
  font-weight: 800;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
}
.card {
  position: relative;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(122, 47, 60, 0.12);
  box-shadow: 0 14px 30px rgba(90, 31, 43, 0.08);
  animation: fadeUp 0.45s ease;
}
.card.destaque { border: 2px solid var(--brand-gold); }
.card-badge {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
  font-size: 11px;
  font-weight: 800;
  color: #3f2a08;
  background: var(--brand-gold);
  border-radius: 999px;
  padding: 5px 9px;
}
.card img { width: 100%; height: 168px; object-fit: cover; }
.card-body { padding: 13px; }
.card h3 {
  margin: 0 0 6px;
  color: var(--brand-wine);
  font-size: 22px;
  font-family: "Bree Serif", serif;
}
.card p {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.45;
  min-height: 42px;
}
.price-tag {
  color: var(--brand-wine-dark);
  font-size: 15px;
  letter-spacing: 0.2px;
}

.row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }

.drawer-backdrop { position: fixed; inset: 0; background: rgba(25, 8, 12, 0.48); z-index: 30; }
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(430px, 100%);
  height: 100%;
  background: #fff;
  z-index: 40;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(122, 47, 60, 0.16);
}
.drawer-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 14px;
  border-bottom: 1px solid rgba(122, 47, 60, 0.12);
}
.drawer-head strong {
  font-family: "Bree Serif", serif;
  color: var(--brand-wine);
  font-size: 30px;
}
.drawer-body { padding: 12px; overflow: auto; flex: 1; }
.item { border-bottom: 1px solid #f0e8d7; padding: 10px 0; }
.qty { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.qty button {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--brand-wine);
  background: #fff;
  color: var(--brand-wine);
  font-weight: 800;
  cursor: pointer;
}
.drawer-foot { padding: 12px; border-top: 1px solid rgba(122, 47, 60, 0.12); }

.field {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid rgba(122, 47, 60, 0.2);
  border-radius: 10px;
  background: #fff;
  font-family: inherit;
}

.nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 15;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(120deg, var(--brand-wine-dark), var(--brand-wine));
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}
.nav button {
  color: #fff;
  background: transparent;
  border: 0;
  padding: 13px 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.nav .active { background: rgba(255, 255, 255, 0.14); }

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(20, 8, 12, 0.45);
  display: grid;
  place-items: end center;
}
.modal {
  width: min(530px, 100%);
  background: #fff;
  border-radius: 18px 18px 0 0;
  padding: 16px 14px;
}
.modal h3 {
  margin: 0;
  font-size: 28px;
  color: var(--brand-wine);
  font-family: "Bree Serif", serif;
}
.modal p { margin: 6px 0 10px; color: var(--muted); }

.section-label {
  margin-top: 4px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 0.6px;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 10px;
}

.size-option {
  border: 1px solid rgba(122, 47, 60, 0.22);
  background: #fff;
  border-radius: 14px;
  min-height: 74px;
  padding: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  color: var(--brand-wine);
  cursor: pointer;
}

.size-option strong {
  font-size: 16px;
}

.size-option span {
  font-size: 13px;
  color: var(--muted);
}

.size-option.active {
  border-color: transparent;
  color: #fff;
  background: linear-gradient(120deg, var(--brand-wine), var(--brand-wine-dark));
  box-shadow: 0 10px 18px rgba(90, 31, 43, 0.22);
}

.size-option.active span { color: #f9e4e8; }

.pills { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
.pill {
  border: 1px solid rgba(122, 47, 60, 0.2);
  border-radius: 999px;
  background: #fff;
  color: var(--brand-wine);
  padding: 9px 12px;
  cursor: pointer;
  font-weight: 700;
  min-height: 42px;
}
.pill.active {
  background: linear-gradient(120deg, var(--brand-wine), var(--brand-wine-dark));
  color: #fff;
}

.hist {
  background: #fff;
  border: 1px solid rgba(122, 47, 60, 0.16);
  border-radius: 14px;
  padding: 13px;
  margin-bottom: 10px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 740px) {
  .header { top: 38px; }
  .hero-card { padding: 30px 16px; }
  .hero-title { font-size: clamp(42px, 15vw, 74px); }
  .hero-sub { font-size: clamp(22px, 8vw, 36px); }
  .tabs { top: 88px; }
  .tab { font-size: 13px; }
  .btn { min-height: 44px; }
  .drawer-head strong { font-size: 26px; }
  .size-grid { grid-template-columns: 1fr; }
}
`;

export default function App() {
  const [tela, setTela] = useState("hero");
  const [aba, setAba] = useState("massas");
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [observacao, setObservacao] = useState("");

  const [modalItem, setModalItem] = useState(null);
  const [tamanho, setTamanho] = useState("G");
  const [adicionais, setAdicionais] = useState([]);

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
  };

  const alternarAdicional = (nome) => {
    setAdicionais((prev) =>
      prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome],
    );
  };

  const confirmarItem = () => {
    if (!modalItem) return;

    const isMassa = modalItem.tipo === "massa";
    const base = isMassa ? modalItem.precos[tamanho] : modalItem.preco;
    const add = adicionais.reduce((acc, nome) => {
      const item = ADICIONAIS.find((a) => a.nome === nome);
      return acc + (item?.preco || 0);
    }, 0);

    const precoUnitario = base + add;
    const chave = `${modalItem.id}-${isMassa ? tamanho : "U"}-${[...adicionais].sort().join(",")}`;

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
          adicionais: [...adicionais],
          precoUnitario,
          qty: 1,
          subtotal: precoUnitario,
        },
      ];
    });

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

  const itensDaAba = aba === "massas" ? MASSAS : PASTEIS;

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
          <button className="btn secondary" onClick={() => setCarrinhoAberto(true)}>
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
            <h2>{aba === "massas" ? "Massas" : "Pasteis"}</h2>
            <p>Escolha seus favoritos e monte seu pedido com adicionais.</p>
          </div>

          <div className="tabs">
            <button className={`tab ${aba === "massas" ? "active" : ""}`} onClick={() => setAba("massas")}>
              <span className="tab-icon">🍝</span>
              <span>Massas</span>
            </button>
            <button className={`tab ${aba === "pasteis" ? "active" : ""}`} onClick={() => setAba("pasteis")}>
              <span className="tab-icon">🥟</span>
              <span>Pasteis</span>
            </button>
          </div>

          {combo.ativo && <div className="combo">{combo.mensagem}</div>}

          <div className="grid">
            {itensDaAba.map((item) => (
              <article key={item.id} className={`card ${item.destaque ? "destaque" : ""}`}>
                {item.destaque && <span className="card-badge">Destaque</span>}
                <img src={item.foto} alt={item.nome} />
                <div className="card-body">
                  <h3>{item.emoji} {item.nome}</h3>
                  <p>{item.descricao}</p>
                  <div className="row">
                    <strong className="price-tag">
                      {aba === "massas"
                        ? `${formatBRL(item.precos.P)} / ${formatBRL(item.precos.G)}`
                        : formatBRL(item.preco)}
                    </strong>
                    <button className="btn secondary" onClick={() => abrirModal(item, aba === "massas" ? "massa" : "pastel")}>Pedir</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
