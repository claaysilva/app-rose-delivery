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
* { box-sizing: border-box; }
body { margin: 0; font-family: "Segoe UI", Arial, sans-serif; background: #f4efe3; color: #2c1810; }
.status { position: sticky; top: 0; z-index: 20; text-align: center; padding: 10px; color: #fff; font-weight: 700; }
.status.open { background: #2b7a3d; }
.status.closed { background: #6b1e2a; }
.header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #fff; border-bottom: 1px solid #eadfc8; position: sticky; top: 40px; z-index: 10; }
.logo { font-weight: 900; color: #6b1e2a; }
.hero { min-height: 72vh; display: grid; place-items: center; text-align: center; padding: 24px; background: linear-gradient(160deg, #6b1e2a, #8b2d3a); color: #fff; }
.hero h1 { font-size: clamp(34px, 8vw, 60px); margin: 0 0 8px; }
.hero p { max-width: 560px; margin: 0 auto 18px; }
.btn { border: 0; border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
.btn.primary { background: #b8963e; color: #2c1810; }
.btn.secondary { background: #6b1e2a; color: #fff; }
.section { padding: 16px; max-width: 980px; margin: 0 auto; }
.tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.tab { flex: 1; border: 1px solid #d7c9a8; background: #fff; border-radius: 8px; padding: 10px; cursor: pointer; font-weight: 700; }
.tab.active { background: #6b1e2a; color: #fff; }
.combo { background: #f0d998; color: #2c1810; border-radius: 8px; padding: 10px; margin-bottom: 12px; font-weight: 700; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
.card { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #eee1c3; }
.card img { width: 100%; height: 150px; object-fit: cover; }
.card-body { padding: 12px; }
.card h3 { margin: 0 0 6px; font-size: 18px; }
.card p { margin: 0 0 10px; color: #6b5b52; font-size: 13px; min-height: 32px; }
.row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.drawer-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); z-index: 30; }
.drawer { position: fixed; top: 0; right: 0; width: min(420px, 100%); height: 100%; background: #fff; z-index: 40; display: flex; flex-direction: column; }
.drawer-head { display: flex; justify-content: space-between; align-items: center; padding: 14px; border-bottom: 1px solid #eee; }
.drawer-body { padding: 12px; overflow: auto; flex: 1; }
.item { border-bottom: 1px solid #f0f0f0; padding: 10px 0; }
.qty { display: flex; align-items: center; gap: 8px; }
.qty button { width: 28px; height: 28px; border-radius: 999px; border: 1px solid #6b1e2a; background: #fff; cursor: pointer; }
.drawer-foot { padding: 12px; border-top: 1px solid #eee; }
.field { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; }
.nav { position: sticky; bottom: 0; display: grid; grid-template-columns: repeat(3, 1fr); background: #4a1219; }
.nav button { color: #fff; background: transparent; border: 0; padding: 12px 8px; cursor: pointer; font-weight: 700; }
.nav .active { background: #6b1e2a; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: grid; place-items: end center; z-index: 50; }
.modal { width: min(520px, 100%); background: #fff; border-radius: 12px 12px 0 0; padding: 14px; }
.pills { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
.pill { border: 1px solid #d9cdb2; border-radius: 999px; background: #fff; padding: 8px 10px; cursor: pointer; }
.pill.active { background: #6b1e2a; color: #fff; }
.hist { background: #fff; border: 1px solid #eadfc8; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
@media (max-width: 560px) { .header { top: 40px; } }
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
          <div className="logo">ROSE DELIVERY</div>
          <button className="btn secondary" onClick={() => setCarrinhoAberto(true)}>
            Carrinho ({totalItens})
          </button>
        </header>
      )}

      {tela === "hero" && (
        <section className="hero">
          <div>
            <h1>Rose Delivery</h1>
            <p>Sabor de casa, entregue pra voce. Massas e pasteis com pedido direto no WhatsApp.</p>
            <button className="btn primary" onClick={() => setTela("cardapio")}>Ver cardapio</button>
          </div>
        </section>
      )}

      {tela === "cardapio" && (
        <section className="section">
          <h2>Nosso cardapio</h2>

          <div className="tabs">
            <button className={`tab ${aba === "massas" ? "active" : ""}`} onClick={() => setAba("massas")}>Massas</button>
            <button className={`tab ${aba === "pasteis" ? "active" : ""}`} onClick={() => setAba("pasteis")}>Pasteis</button>
          </div>

          {combo.ativo && <div className="combo">{combo.mensagem}</div>}

          <div className="grid">
            {itensDaAba.map((item) => (
              <article key={item.id} className="card">
                <img src={item.foto} alt={item.nome} />
                <div className="card-body">
                  <h3>{item.emoji} {item.nome}</h3>
                  <p>{item.descricao}</p>
                  <div className="row">
                    <strong>
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
                <strong>Tamanho</strong>
                <div className="pills">
                  <button className={`pill ${tamanho === "P" ? "active" : ""}`} onClick={() => setTamanho("P")}>P - {formatBRL(modalItem.precos.P)}</button>
                  <button className={`pill ${tamanho === "G" ? "active" : ""}`} onClick={() => setTamanho("G")}>G - {formatBRL(modalItem.precos.G)}</button>
                </div>
              </>
            )}

            <strong>Adicionais</strong>
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
