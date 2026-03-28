export const HORARIO_ABERTURA = 7;
export const HORARIO_FECHAMENTO = 22;
export const WHATSAPP_NUMBER = "5538997355426";

export const MASSAS = [
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

export const PASTEIS = [
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

export const INGREDIENTES_MASSA = [
  { id: "frango", nome: "Frango", preco: 4 },
  { id: "carne-moida", nome: "Carne moida", preco: 4 },
  { id: "bacon", nome: "Bacon", preco: 3 },
  { id: "calabresa", nome: "Calabresa", preco: 3 },
  { id: "brocolis", nome: "Brocolis", preco: 2 },
  { id: "milho", nome: "Milho", preco: 2 },
  { id: "mussarela", nome: "Mussarela", preco: 3 },
  { id: "catupiry", nome: "Catupiry", preco: 3 },
];

export const INGREDIENTES_PASTEL = [
  { id: "frango", nome: "Frango", preco: 4 },
  { id: "carne", nome: "Carne", preco: 4 },
  { id: "carne-seca", nome: "Carne seca", preco: 5 },
  { id: "queijo", nome: "Queijo", preco: 3 },
  { id: "presunto", nome: "Presunto", preco: 3 },
  { id: "catupiry", nome: "Catupiry", preco: 3 },
  { id: "vinagrete", nome: "Vinagrete", preco: 1 },
  { id: "bacon", nome: "Bacon", preco: 3 },
];

export const ADICIONAIS = [
  { id: "bacon", nome: "Bacon", preco: 3 },
  { id: "catupiry", nome: "Catupiry", preco: 3 },
  { id: "queijo", nome: "Queijo", preco: 3 },
  { id: "vinagrete", nome: "Vinagrete", preco: 0 },
];
