const SCENARIOS = {
  start: {
    who: "inconnu",
    texts: ["Hey"],
    // audio: "assets/audio/notification.mp3",
    choices: [
      { text: "Répondre", reply: "?", next: "reply_1" },
      { text: "Ignorer", next: "ignore_1" },
    ],
  },

  reply_1: {
    who: "inconnu",
    texts: ["On peut parler ?"],
    // image: "assets/images/photo_mystere.jpg",
    choices: [
      {
        text: "Répondre",
        reply: "Je pense que vous vous êtes trompé de personne !",
        next: "reply_11",
      },
      {
        text: "ignorer",
        next: "reply_11",
      },
    ],
  },

  reply_11: {
    who: "inconnu",
    texts: [
      "C'est Layla",
      "J'aimerais si tu l’acceptes qu’on s’explique. Je comprendrais totalement si tu ne veux pas. Bonne soirée",
    ],
    // image: "assets/images/photo_mystere.jpg",
    choices: [
      {
        text: "Gentiment",
        reply: "...",
        next: "Gentiment_2",
      },
      {
        text: "Méchament",
        reply: "",
        next: "Mechament_2",
      },
    ],
  },

  ignore_1: {
    who: "inconnu",
    texts: ["Hey", "On peut parler ?"],
    choices: [
      {
        text: "Répondre",
        reply: "Je pense que vous vous êtes trompé de personne !",
        next: "ignore_11",
      },
      {
        text: "Ignorer",
        next: "ignore_11",
      },
    ],
  },
  ignore_11: {
    who: "inconnu",
    texts: [
      "C'est Layla",
      "J'aimerais si tu l’acceptes qu’on s’explique. Je comprendrais totalement si tu ne veux pas. Bonne soirée",
    ],
    choices: [
      {
        text: "Gentiment",
        reply: "...",
        next: "Gentiment_1",
      },
      {
        text: "Méchament",
        reply: "...",
        next: "Mechament_1",
      },
    ],
  },
};
