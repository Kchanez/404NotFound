// Script pour le Visual Novel
let storyData = null;
let currentScene = "start";

// État global pour bloquer la progression en attendant le clic sur le rappel
let isWaitingForNotificationClick = false;
let hasNotificationBeenClicked = false;
let blockedChoices = null;
let blockedDialogues = null;
let blockedIndex = -1;

// Charger l'histoire depuis le fichier JSON
function loadStory() {
  console.log("Chargement du scénario...");
  fetch("./story.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du scénario");
      }
      console.log("Réponse reçue:", response);
      return response.json();
    })
    .then((data) => {
      console.log("Données chargées:", data);
      storyData = data;
      // Commencer par la scène de départ
      if (storyData && storyData.scenes && storyData.scenes.start) {
        displayScene("start");
      } else {
        throw new Error("Structure de données incorrecte");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      document.getElementById("dialogue-text").textContent =
        "Erreur lors du chargement du scénario: " + error.message;
      document.getElementById("dialogue-text").style.display = "block";
    });
}

// Afficher une scène
function displayScene(sceneId) {
  if (!storyData || !storyData.scenes[sceneId]) {
    console.error("Scène non trouvée:", sceneId);
    return;
  }

  const scene = storyData.scenes[sceneId];
  currentScene = sceneId;

  // Récupérer les éléments du DOM nécessaires
  const container = document.getElementById("novel-container");
  const dialogueBox = document.getElementById("dialogue-box");

  // Recréer les éléments pour éviter les problèmes
  dialogueBox.innerHTML = `
        <div id="character-name"></div>
        <div id="dialogue-text"></div>
        <div id="choices-container"></div>
        <img id="dialogue-hint" src="Images/down.svg" alt="Cliquez pour continuer" title="Cliquez pour continuer" />
    `;

  // Les références seront récupérées à la volée dans showDialogue

  // Changer l'arrière-plan si spécifié
  if (scene.background && storyData.backgrounds[scene.background]) {
    container.style.backgroundImage = `url('${
      storyData.backgrounds[scene.background]
    }')`;
  }

  // Jouer la musique de fond si spécifiée
  if (scene.bgm && storyData.audio.bgm[scene.bgm]) {
    playAudio(storyData.audio.bgm[scene.bgm]);
  }

  // Afficher le premier dialogue
  if (scene.dialogue && scene.dialogue.length > 0) {
    showDialogue(scene.dialogue, 0, scene.choices);
  } else {
    // S'il n'y a pas de dialogue, afficher directement les choix
    showChoices(scene.choices);
  }
}

// Afficher un dialogue
function showDialogue(dialogues, index, choices) {
  if (index >= dialogues.length) {
    // Fin des dialogues: si on attend le clic sur le rappel, ne pas afficher les choix
    if (isWaitingForNotificationClick && !hasNotificationBeenClicked) {
      blockedChoices = choices;
      blockedDialogues = dialogues;
      blockedIndex = index;
      return;
    }
    // Sinon, afficher les choix
    showChoices(choices);
    return;
  }

  const dialogue = dialogues[index];
  const characterName = document.getElementById("character-name");
  const dialogueText = document.getElementById("dialogue-text");
  const dialogueHint = document.getElementById("dialogue-hint");
  // L'icône de notification message sera récupérée uniquement au moment requis

  // S'assurer que le texte est visible
  dialogueText.style.display = "block";

  // Créer l'élément d'image du personnage s'il n'existe pas
  let characterImage = document.getElementById("character-image");
  if (!characterImage) {
    characterImage = document.createElement("img");
    characterImage.id = "character-image";
    document.getElementById("novel-container").appendChild(characterImage);
  }

  // Jouer un effet sonore si spécifié
  if (dialogue.sfx && storyData.audio.sfx[dialogue.sfx]) {
    playAudio(storyData.audio.sfx[dialogue.sfx], false);
  }

  // Déléguer le rappel au module séparé (Rappel.js)
  // Déléguer aux modules de rappel
  const onBlock = () => {
    // Ne pas bloquer l'histoire: laisser les notifications visibles et continuer
    isWaitingForNotificationClick = false;
    hasNotificationBeenClicked = true;
    if (dialogueHint) dialogueHint.style.display = "block";
  };
  const onUnblock = () => {
    // Plus de logique de déblocage: on ne bloque plus la progression
    hasNotificationBeenClicked = true;
    isWaitingForNotificationClick = false;
  };

  // 1) Rappel Anniversaire (bloque sur la phrase cible)
  if (window.RappelAnnivAPI) {
    window.RappelAnnivAPI.handleDialogue(dialogue.text, onBlock, onUnblock);
  }
  // 2) Rappel examen / Ding (module existant)
  if (window.RappelAPI) {
    window.RappelAPI.handleDialogue(dialogue.text, onBlock, onUnblock);
  }

  // Ouvrir le panneau inline private-chat-app au message exact demandé
  if (
    typeof dialogue.text === 'string' &&
    dialogue.text.trim() === 'Joyeux anniversaire ma veille, tu me manques.'
  ) {
    const notificationIcon = document.getElementById('notification-icon');
    if (notificationIcon) {
      notificationIcon.classList.add('hidden');
      notificationIcon.classList.remove('attention-shake');
    }
    const messageNotifIcon = document.getElementById('rappel-icon');
    if (messageNotifIcon) {
      messageNotifIcon.classList.add('hidden');
      messageNotifIcon.classList.remove('attention-shake');
    }
    const panel = document.getElementById('private-chat-app');
    if (panel) {
      console.log('[VN] Déclencheur chat privé – ouverture.');
      // Retirer le masquage et forcer l’affichage
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
      panel.style.display = 'flex';
      // Laisser les tailles contrôlées par privateChat.css (variables CSS par défaut)

      const hint = document.getElementById('dialogue-hint');
      if (hint) hint.style.display = 'none';

      // Gérer le bouton de fermeture intégré au header
      const closeBtn = document.getElementById('close-window');
      if (closeBtn) {
        closeBtn.onclick = () => {
          console.log('[VN] Chat privé – fermeture.');
          panel.classList.add('hidden');
          panel.setAttribute('aria-hidden', 'true');
          panel.style.display = 'none';
          const hint2 = document.getElementById('dialogue-hint');
          if (hint2) hint2.style.display = '';
        };
      }
    }
  }



  // Le son de notification est maintenant géré uniquement par le sfx dans story.json
  // pour le message "*Ding* - Ton ordinateur affiche une notification"

  // Afficher le nom du personnage
  if (dialogue.character && storyData.characters[dialogue.character]) {
    characterName.textContent = storyData.characters[dialogue.character].name;
    characterName.style.display = "block";

    // Afficher l'avatar du personnage si spécifié
    if (
      dialogue.avatar &&
      storyData.characters[dialogue.character].avatars[dialogue.avatar]
    ) {
      characterImage.src =
        storyData.characters[dialogue.character].avatars[dialogue.avatar];
      characterImage.style.display = "block";
    } else {
      characterImage.style.display = "none";
    }
  } else {
    characterName.style.display = "none";
    characterImage.style.display = "none";
  }

  // Déterminer si le son typing doit être activé
  // Uniquement pour le message "Un jour ordinaire dans ta chambre, tu reçois un message étrange..."
  let enableTypingSound = false;
  if (
    dialogue.text &&
    dialogue.text.includes(
      "Un jour ordinaire dans ta chambre, tu reçois un message étrange..."
    )
  ) {
    enableTypingSound = true;
  }

  // Jouer le son de notification spécial pour le message "Ding" (déjà implémenté au-dessus)
  // Gérer le clic pendant la frappe: premier clic termine le texte, clic suivant avance
  const dialogueBoxEl = document.getElementById("dialogue-box");
  let isTyping = true;
  let advanced = false;
  dialogueBoxEl.onclick = () => {
    // Bloquer l'avance tant que la notification n'a pas été cliquée
    if (isWaitingForNotificationClick && !hasNotificationBeenClicked) {
      return;
    }
    if (isTyping) {
      if (dialogueText.__typewriterCancel) {
        dialogueText.__typewriterCancel();
      } else {
        // Fallback: afficher instantanément le texte
        dialogueText.textContent = dialogue.text;
      }
      isTyping = false;
      return;
    }
    if (!advanced) {
      advanced = true;
      showDialogue(dialogues, index + 1, choices);
    }
  };

  // Afficher le texte avec effet de machine à écrire
  typewriterEffect(
    dialogueText,
    dialogue.text,
    () => {
      // Une fois fini, le clic avancera (handler déjà en place)
      isTyping = false;
    },
    30,
    enableTypingSound
  );
}

// Effet de machine à écrire pour le texte
function typewriterEffect(
  element,
  text,
  callback,
  speed = 30,
  isTypingSoundEnabled = true
) {
  element.textContent = "";
  let i = 0;
  let finished = false;
  let timeoutId = null;

  // Jouer le son de typing seulement si activé
  if (isTypingSoundEnabled) {
    const typingSound = document.getElementById("typing-sound");
    if (typingSound) {
      typingSound.currentTime = 0;
      typingSound.play().catch((error) => {
        console.error("Erreur lors de la lecture du son typing:", error);
      });
    }
  }

  // Permettre d'annuler la frappe et d'afficher instantanément le texte
  element.__typewriterCancel = () => {
    if (finished) return;
    finished = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    element.textContent = text;
    if (isTypingSoundEnabled) {
      const typingSound = document.getElementById("typing-sound");
      if (typingSound) {
        typingSound.pause();
        typingSound.currentTime = 0;
      }
    }
    // Ne pas appeler le callback ici: le prochain clic avancera
  };

  function completeAndCallback() {
    finished = true;
    if (isTypingSoundEnabled) {
      const typingSound = document.getElementById("typing-sound");
      if (typingSound) {
        typingSound.pause();
        typingSound.currentTime = 0;
      }
    }
    if (callback) callback();
  }

  function type() {
    if (finished) return;
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      timeoutId = setTimeout(type, speed);
    } else {
      completeAndCallback();
    }
  }

  type();
}

// Afficher les choix
function showChoices(choices) {
  const choicesContainer = document.getElementById("choices-container");
  choicesContainer.innerHTML = "";

  if (!choices || choices.length === 0) {
    // S'il n'y a pas de choix, ajouter un bouton pour continuer
    const button = document.createElement("button");
    button.textContent = "Continuer";
    button.onclick = () => {
      // Fin de l'histoire ou redirection vers une autre page
      alert("Fin de cette partie de l'histoire.");
    };
    choicesContainer.appendChild(button);
    return;
  }

  // Créer un bouton pour chaque choix
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.onclick = () => {
      displayScene(choice.nextScene);
    };
    choicesContainer.appendChild(button);
  });
}

// Jouer un fichier audio
function playAudio(src, isLoop = true) {
  const audio = new Audio(src);
  audio.loop = isLoop;
  audio.play().catch((error) => {
    console.error("Erreur lors de la lecture audio:", error);
  });

  // Arrêter les autres audios de fond si c'est une musique de fond
  if (isLoop) {
    if (window.currentBGM) {
      window.currentBGM.pause();
    }
    window.currentBGM = audio;
  }
}

// Initialiser le visual novel au chargement de la page
document.addEventListener("DOMContentLoaded", loadStory);
