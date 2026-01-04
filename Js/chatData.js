// Données de base pour la messagerie
// Les avatars utilisent les ressources déjà présentes dans Images/

const CHAT_CONTACTS = [
  {
    id: "inconnu",
    name: "Inconnu",
    avatar: "Images/profil.svg",
    inContacts: false,
  },
  { id: "papa", name: "Papa", avatar: "Images/profil.svg", inContacts: true },
  {
    id: "justine",
    name: "Justine",
    avatar: "Images/profil.svg",
    inContacts: true,
  },
  { id: "maman", name: "Maman", avatar: "Images/profil.svg", inContacts: true },
  {
    id: "MamanLayla",
    name: "MamanLayla",
    avatar: "Images/profil.svg",
    inContacts: true,
  },
  { id: "layla", name: "Layla", avatar: "Images/profil.svg", inContacts: true },
];

const CHAT_THREADS = {
  inconnu: [{ who: "friend", text: "Hey" }],
  papa: [{ who: "friend", text: "Dernier message en attente..." }],
  justine: [{ who: "friend", text: "Dernier message en attente..." }],
  maman: [{ who: "friend", text: "Dernier message en attente..." }],
  MamanLayla: [
    {
      who: "friend",
      type: "text",
      text: "Bonsoir, J’ai enfin des nouvelles de Laïla. Elle a été retrouvée, cependant elle n’avait pas fuguée comme les enquêteurs et le reste de la ville le pensait. Les autorités affirment qu’elle avait été enlevée par un réseau organisé de kidnappeurs.Dans son téléphone on a trouvé qu’elle pensait échanger avec sa cousine disparue quelque temps plus tôt.Elle avait été à un point de rendez- vous. Était - tu au courant ? Tout ça semble encore irréel… Layla est méconnaissable, les docteurs parlent de troubles post traumatique.Elle est prise de panique et ne cesse de répeter “Je ne ferai plus confiance à l’identité numérique. Maman de Layla",
    },
  ],
  layla: [
    {
      who: "friend",
      type: "text",
      text: "coucou, je vais te faire un audio attends pour mieux t'expliquer",
    },
    { who: "friend", type: "audio", src: "Audios/audioLayla.mp4" },
  ],
};

// Réponses automatiques simples pour la démo
const CHAT_AUTO_REPLIES = {
  inconnu: ["Hey"],
  default: ["OK", "Je te réponds plus tard", "D'accord"],
};
