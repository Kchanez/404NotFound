// Données de base pour la messagerie
// Les avatars utilisent les ressources déjà présentes dans Images/

const CHAT_CONTACTS = [
  { id: 'inconnu', name: 'Inconnu', avatar: 'Images/Avatar.svg', inContacts: false },
  { id: 'papa', name: 'Papa', avatar: 'Images/Angry.svg', inContacts: true },
  { id: 'justine', name: 'Justine', avatar: 'Images/Hacker.png', inContacts: true },
  { id: 'maman', name: 'Maman', avatar: 'Images/Content.svg', inContacts: true },
  { id: 'laila', name: 'Laïla', avatar: 'Images/Avatar.svg', inContacts: true }
];

const CHAT_THREADS = {
  inconnu: [
    { who: 'friend', text: 'Hey' }
  ],
  papa: [
    { who: 'friend', text: 'Dernier message en attente...' }
  ],
  justine: [
    { who: 'friend', text: 'Dernier message en attente...' }
  ],
  maman: [
    { who: 'friend', text: 'Dernier message en attente...' }
  ],
  layla: [
    { who: 'friend', text: 'Dernier message en attente...' }
  ]
};

// Réponses automatiques simples pour la démo
const CHAT_AUTO_REPLIES = {
  inconnu: [
    "Tu es là ?",
    "On peut parler ?",
    "J'ai quelque chose à te dire...",
  ],
  default: ["OK", "Je te réponds plus tard", "D'accord"]
};