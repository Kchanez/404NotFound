// Messages initiaux reproduisant DiscussionPrive.png

const PRIVATE_CHAT_DATA = {
  dateLabel: "Aujourd'hui - 23:46",
  thread: [
    { who: 'you', text: 'Bonjour Layla !' },
    { who: 'friend', text: 'Bonjour Joueur !' },
    { who: 'you', text: 'Tu vas bien ?' },
    { who: 'date', text: "Aujourd'hui - 23:46" },
    { who: 'you', text: 'Layla?' },
    { who: 'friend', text: "Ah, excuse-moi nomJoueur j’ai oublié de répondre…" }
  ]
};

// Quelques réponses automatiques légères si l’utilisateur continue la discussion
const PRIVATE_CHAT_REPLIES = [
  "Oui, tout va bien !",
  "On se parle demain ?",
  "Désolée, j’étais occupée."
];