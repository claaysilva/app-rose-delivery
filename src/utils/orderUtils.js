export const formatBRL = (valor) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);

export const formatPrecoMassaCard = (precos) => {
  const menorPreco = Math.min(precos.P, precos.G);
  return `A partir de ${formatBRL(menorPreco)}`;
};

export const estaAbertaAgora = (abertura, fechamento) => {
  const horaAtual = new Date().getHours();
  return horaAtual >= abertura && horaAtual < fechamento;
};

export const detectarCombo = (itens) => {
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

export const gerarMensagemWhatsApp = (itens, combo, total, observacao, checkout = {}) => {
  let msg = "Pedido Rose Delivery\n\n";

  if (checkout.nome || checkout.telefone) {
    msg += "Cliente:\n";
    if (checkout.nome) {
      msg += `- Nome: ${checkout.nome}\n`;
    }
    if (checkout.telefone) {
      msg += `- Telefone: ${checkout.telefone}\n`;
    }
    msg += "\n";
  }

  if (checkout.rua || checkout.numero || checkout.bairro) {
    msg += "Entrega:\n";
    const enderecoBase = [checkout.rua, checkout.numero].filter(Boolean).join(", ");
    if (enderecoBase) {
      msg += `- Rua/Numero: ${enderecoBase}\n`;
    }
    if (checkout.bairro) {
      msg += `- Bairro: ${checkout.bairro}\n`;
    }
    if (checkout.complemento) {
      msg += `- Complemento: ${checkout.complemento}\n`;
    }
    if (checkout.referencia) {
      msg += `- Referencia: ${checkout.referencia}\n`;
    }
    msg += "\n";
  }

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
  if (checkout.pagamento) {
    msg += `Pagamento: ${checkout.pagamento}\n`;
  }
  msg += "Aguardo confirmacao do pedido.";

  return encodeURIComponent(msg);
};
