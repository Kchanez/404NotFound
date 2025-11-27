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
  { id: "layla", name: "Laïla", avatar: "Images/profil.svg", inContacts: true },
];

const CHAT_THREADS = {
  inconnu: [{ who: "friend", text: "Hey" }],
  papa: [{ who: "friend", text: "Dernier message en attente..." }],
  justine: [{ who: "friend", text: "Dernier message en attente..." }],
  maman: [{ who: "friend", text: "Dernier message en attente..." }],
  layla: [
    {
      who: "friend",
      type: "text",
      text: "coucou, je vais te faire un audio attends pour mieux t'expliquer",
    },
    { who: "friend", type: "audio", src: "Audios/typing.mp3" },
  ],
};

// Réponses automatiques simples pour la démo
const CHAT_AUTO_REPLIES = {
  inconnu: ["Hey"],
  default: ["OK", "Je te réponds plus tard", "D'accord"],
};
