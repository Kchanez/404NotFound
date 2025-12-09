// Script pour le Visual Novel
let storyData = null;
let currentScene = "start";
let currentScenario = null; // Déclarer globalement
let currentScenarioIndex = 0; // Déclarer globalement
let currentProtagonistDialogueIndex = 0;
let currentThoughtIndex = 0;
let isCurrentlyProtagonistDialogue = false;

// État global pour bloquer la progression en attendant le clic sur le rappel
let isWaitingForNotificationClick = false;
let hasNotificationBeenClicked = false;
let blockedChoices = null;
let blockedDialogues = null;
let blockedIndex = -1;
let isWaitingForCtaClick = false; // Nouvelle variable d'état
let hasInjectedHeyMessage = false;
let hasMainChatCtaBeenClicked = false;
let isGalleryClickable = false;
let galleryViewCount = 0;
let hasImageBeenClicked = false;
let hasAudioBeenClicked = false;
let unknownImageFilename = null;
let currentTypewriterEffect = null; // Variable pour suivre l'effet de machine à écrire en cours
let isChoicesActive = false; // Drapeau pour bloquer la progression quand des choix sont affichés

// Charger l'histoire depuis le fichier JSON
function loadStory() {
  fetch("./story.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement du scénario");
      }
      return response.json();
    })
    .then((data) => {
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

  const dialogueHint = document.getElementById("dialogue-hint");
  if (dialogueHint) {
    dialogueHint.style.display = "block";
  }

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
function showDialogue(dialogues, index, choices, scenarioChoices = null) {
  if (index >= dialogues.length) {
    // Fin des dialogues: afficher les choix
    if (scenarioChoices) {
      showChoices(scenarioChoices);
    } else {
      showChoices(choices);
    }
    return;
  }

  const dialogue = dialogues[index];
  const characterName = document.getElementById("character-name");
  const dialogueText = document.getElementById("dialogue-text");
  const dialogueHint = document.getElementById("dialogue-hint");
  const mainChatCtaBtn = document.getElementById("main-chat-cta-btn"); // Récupérer le bouton
  const dialogueBoxEl = document.getElementById("dialogue-box");

  // S'assurer que le texte est visible
  dialogueText.style.display = "block";

  // Jouer un effet sonore si spécifié
  if (dialogue.sfx && storyData.audio.sfx[dialogue.sfx]) {
    playAudio(storyData.audio.sfx[dialogue.sfx], false);
  }

  // Déléguer le rappel au module séparé (Rappel.js)
  // Déléguer aux modules de rappel
  const onBlock = () => {
    // Ne pas bloquer l'histoire: masquer le dialogue-hint
    if (dialogueHint) dialogueHint.style.display = "none";
  };
  const onUnblock = () => {
    // Plus de logique de déblocage: on ne bloque plus la progression
  };

  // 1) Rappel Anniversaire (bloque sur la phrase cible)
  if (window.RappelAnnivAPI) {
    window.RappelAnnivAPI.handleDialogue(dialogue.text, onBlock, onUnblock);
  }

  // 3) Rappel message vide (ne bloque pas)
  let isEmptyMessage = false;
  if (window.RappelMessageVideAPI) {
    isEmptyMessage = window.RappelMessageVideAPI.handleDialogue(dialogue.text);
  }

  // Ouvrir le panneau de chat principal au message exact demandé
  if (
    typeof dialogue.text === "string" &&
    dialogue.text.trim() ===
      "Ah tiens un nouveau message. Surement une erreur ce numéro n’est pas dans mes contacts"
  ) {
    if (window.ChatAppAPI) {
      window.ChatAppAPI.showChatApp();
      window.ChatAppAPI.selectContact("inconnu");
      if (!hasInjectedHeyMessage) {
        setTimeout(() => {
          window.ChatAppAPI.addMessage("Hey", "friend");
        }, 300);
        hasInjectedHeyMessage = true;
      }
    }
    if (mainChatCtaBtn) {
      mainChatCtaBtn.classList.add("blinking");
    }
  }

  // Le son de notification est maintenant géré uniquement par le sfx dans story.json
  // pour le message "*Ding* - Ton ordinateur affiche une notification"

  // Afficher le nom du personnage
  if (dialogue.character && storyData.characters[dialogue.character]) {
    characterName.textContent = storyData.characters[dialogue.character].name;
    characterName.style.display = "block";

    // Afficher l'avatar du personnage si spécifié
  }

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
  // const dialogueBoxEl = document.getElementById("dialogue-box"); // Already declared above
  let isTyping = true;
  let canAdvance = false; // New flag
  dialogueBoxEl.onclick = () => {
    if (isChoicesActive) {
      // Si des choix sont actifs, ignorer le clic sur la boîte de dialogue
      return;
    }
    if (isTyping) {
      // First click: complete typing
      if (dialogueText.__typewriterCancel) {
        dialogueText.__typewriterCancel();
      } else {
        dialogueText.textContent = dialogue.text;
      }
      isTyping = false;
      // Allow advancing after a short delay to prevent accidental double-clicks
      setTimeout(() => {
        canAdvance = true;
      }, 100); // Small delay
      return;
    }

    if (canAdvance) {
      // Second click (or subsequent clicks after typing e): advance dialogue
      canAdvance = false; // Reset to prevent further rapid advances
      const dialogueHint = document.getElementById("dialogue-hint");
      if (dialogueHint) {
        dialogueHint.classList.remove("blinking");
      }
      // Si le message précédent était vide, masquer l'application de chat privé
      if (isEmptyMessage) {
        const privateChatApp = document.getElementById("private-chat-app");
        if (privateChatApp) {
          privateChatApp.classList.add("hidden");
          privateChatApp.setAttribute("inert", "");
          privateChatApp.style.display = "none";
        }
      }
      showDialogue(dialogues, index + 1, choices, scenarioChoices);
    }
  };

  // Afficher le texte avec effet de machine à écrire
  if (currentTypewriterEffect && currentTypewriterEffect.cancel) {
    currentTypewriterEffect.cancel();
  }
  currentTypewriterEffect = typewriterEffect(
    dialogueText,
    dialogue.text,
    () => {
      // Une fois fini, le clic avancera (handler déjà en place)
      isTyping = false;
      currentTypewriterEffect = null; // Réinitialiser après la fin
      // Allow advancing after a short delay to prevent accidental double-clicks
      setTimeout(() => {
        canAdvance = true;
      }, 100); // Small delay
    },
    50,
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
  let typingSound = null;

  if (isTypingSoundEnabled) {
    typingSound = document.getElementById("typing-sound");
    if (typingSound) {
      typingSound.currentTime = 0;
      typingSound.play().catch((error) => {
        console.error("Erreur lors de la lecture du son typing:", error);
      });
    }
  }

  const cancel = () => {
    if (finished) return;
    finished = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (typingSound) {
      typingSound.pause();
      typingSound.currentTime = 0;
    }
  };

  element.__typewriterCancel = () => {
    cancel();
    element.textContent = text;
    if (callback) callback();
  };

  function completeAndCallback() {
    finished = true;
    if (typingSound) {
      typingSound.pause();
      typingSound.currentTime = 0;
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

  return { cancel };
}

// Afficher les choix
// Nouvelle fonction pour afficher les choix
// (ancienne implémentation showChoices supprimée)

// Nouvelle fonction pour gérer les choix
function handleChoice(choice) {
  // Add the chosen reply text to the chat as a message from the protagonist
  if (window.ChatAppAPI && choice.reply) {
    window.ChatAppAPI.addMessage(choice.reply, "you");
  }

  const mainChatCtaBtn = document.getElementById("main-chat-cta-btn");
  if (mainChatCtaBtn) mainChatCtaBtn.classList.remove("blinking");

  if (
    choice.next &&
    storyData &&
    storyData.scenarios &&
    storyData.scenarios[choice.next]
  ) {
    // Gérer les transitions internes des scénarios via la propriété 'next'
    if (choice.next === "galerie_explore") {
      isGalleryClickable = true;
      const galleryIcon = document.getElementById("gallery-icon");
      if (galleryIcon) {
        galleryIcon.classList.remove("disabled");
        galleryIcon.classList.add("active");
      }
    }
    window.VisualNovelAPI.startScenario(choice.next);
  } else if (choice.nextScene) {
    // Sinon, continuer avec la scène normale
    displayScene(choice.nextScene);
  } else {
    console.warn("Choice has no valid nextScene or nextScenario:", choice);
  }

  if (choice.text === "Ecouter_Voicemail") {
    // Activer visuellement le contact de Layla
    const laylaContact = document.querySelector(
      'li.contact-item[data-id="layla"]'
    );
    if (laylaContact) {
      laylaContact.classList.add("active-contact");
      laylaContact.classList.remove("inactive-contact");
    }
  }

  // Ajout de la logique pour activer et désactiver le calendrier
  if (choice.text === "Voir Calenderier" && window.CalendarAPI) {
    window.CalendarAPI.enableCalendar(true);
  }
  isChoicesActive = false; // Désactiver le drapeau après qu'un choix ait été fait

  const dialogueHint = document.getElementById("dialogue-hint");
  if (dialogueHint) {
    dialogueHint.classList.add("blinking");
    dialogueHint.style.display = "block"; // S'assurer qu'il est visible
  }
}

// Afficher les choix dans #chat-app
function showChoices(choices) {
  const chatApp = document.getElementById("chat-app");
  const messagesContainer = chatApp ? chatApp.querySelector(".messages") : null;

  if (!chatApp || !messagesContainer) {
    console.error("Conteneur #chat-app ou .messages non trouvé.");
    return;
  }

  // S'assurer que #chat-app est visible
  chatApp.style.display = "flex";

  // Masquer le dialogue-hint lorsque les choix sont affichés
  const dialogueHint = document.getElementById("dialogue-hint");
  if (dialogueHint) {
    dialogueHint.style.display = "none";
  }

  // Supprimer tous les anciens wrappers de choix avant d'en ajouter de nouveaux
  const existingChoicesWrappers =
    messagesContainer.querySelectorAll(".choices-wrapper");
  existingChoicesWrappers.forEach((wrapper) => wrapper.remove());

  // Réintroduire le son d'erreur pour le premier affichage des boutons
  if (!window.hasErrorSoundPlayed) {
    // Utiliser le son d'erreur existant (ajustez le chemin si nécessaire)
    playAudio("./Audios/error.mp3", false);
    window.hasErrorSoundPlayed = true;
  }

  // Créer un conteneur pour les boutons de choix pour les regrouper
  const choicesWrapper = document.createElement("div");
  choicesWrapper.classList.add("choices-wrapper"); // Ajouter une classe pour le style

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.classList.add("choice-button");
    button.onclick = () => {
      // Supprimer les choix après qu'un choix ait été fait
      choicesWrapper.remove();
      handleChoice(choice);
    };
    choicesWrapper.appendChild(button);
  });

  messagesContainer.appendChild(choicesWrapper);
  // Faire défiler jusqu'au bas des messages pour afficher les nouveaux choix
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  isChoicesActive = true; // Activer le drapeau quand les choix sont affichés
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

function updateGalleryViewCount() {
  let count = 0;
  if (hasImageBeenClicked) {
    count++;
  }
  if (hasAudioBeenClicked) {
    count++;
  }
  galleryViewCount = count;
  console.log("galleryViewCount mis à jour à:", galleryViewCount);
}

window.VisualNovelAPI = {
  unblockStory: () => {
    isWaitingForCtaClick = false;
    const mainChatCtaBtn = document.getElementById("main-chat-cta-btn");
    if (mainChatCtaBtn) {
      mainChatCtaBtn.classList.remove("blinking");
    }

    if (!hasMainChatCtaBeenClicked) {
      const mainChatCta = document.getElementById("main-chat-cta");
      if (mainChatCta) {
        mainChatCta.style.display = "none";
      }
      hasMainChatCtaBeenClicked = true;
    }

    // Resume dialogue from where it was blocked
    if (blockedDialogues && blockedIndex !== -1) {
      showDialogue(blockedDialogues, blockedIndex + 1, blockedChoices);
      blockedDialogues = null; // Clear blocked state
      blockedIndex = -1;
      blockedChoices = null;
    }
  },
  startScenario: (scenarioName) => {
    // hideHackedScreen(); // Ensure hacked screen is hidden
    if (storyData && storyData.scenarios && storyData.scenarios[scenarioName]) {
      currentScenario = storyData.scenarios[scenarioName];
      currentScenarioIndex = 0;
      currentProtagonistDialogueIndex = 0;
      currentThoughtIndex = 0;
      isCurrentlyProtagonistDialogue = false; // Ensure this is reset
      const dialogueBox = document.getElementById("dialogue-box");
      if (dialogueBox) dialogueBox.classList.remove("hidden");
      currentScenario.currentDialogueTurn =
        currentScenario.who === "protagonist" ? "you" : "friend"; // Initialiser le tour de dialogue

      // Si le scénario est 'galerie' et qu'il y a des photos, envoyer une photo aléatoire
      if (
        scenarioName === "galerie" &&
        currentScenario.galleryPhotos &&
        window.ChatAppAPI &&
        window.ChatAppAPI.sendRandomGalleryImage
      ) {
        window.ChatAppAPI.sendRandomGalleryImage(currentScenario.galleryPhotos);
      }

      displayScenarioDialogue();
    } else {
      console.error(`Scenario ${scenarioName} not found.`);
    }
  },
  showScenarioChoices: (scenarioName) => {
    if (
      storyData &&
      storyData.scenarios &&
      storyData.scenarios[scenarioName] &&
      Array.isArray(storyData.scenarios[scenarioName].choices)
    ) {
      showChoices(storyData.scenarios[scenarioName].choices);
    }
  },
  getIsGalleryClickable: () => isGalleryClickable,
  setIsGalleryClickable: (value) => {
    isGalleryClickable = value;
  },
  getGalleryViewCount: () => galleryViewCount,
  setHasImageBeenClicked: (value) => {
    hasImageBeenClicked = value;
    updateGalleryViewCount();
  },
  getHasAudioBeenClicked: () => hasAudioBeenClicked,
  setHasAudioBeenClicked: (value) => {
    hasAudioBeenClicked = value;
    updateGalleryViewCount();
  },
  getUnknownImageFilename: () => unknownImageFilename,
  setUnknownImageFilename: (filename) => {
    unknownImageFilename = filename;
  },
  showGallery: () => {
    const galleryWindow = document.getElementById("gallery-window");
    if (galleryWindow) {
      galleryWindow.style.display = "block";
      galleryWindow.removeAttribute("aria-hidden");
    }
  },
  hideGallery: () => {
    const galleryWindow = document.getElementById("gallery-window");
    if (galleryWindow) {
      galleryWindow.style.display = "none";
      galleryWindow.setAttribute("aria-hidden", "true");
    }
  },
  showBank: () => {
    console.log("showBank appelée.");
    const bankWindow = document.getElementById("bank-window");
    if (bankWindow) {
      bankWindow.style.display = "block";
      bankWindow.removeAttribute("aria-hidden");
    }
  },
  hideBank: () => {
    const bankWindow = document.getElementById("bank-window");
    if (bankWindow) {
      bankWindow.style.display = "none";
      bankWindow.setAttribute("aria-hidden", "true");
    }
  },
};
console.log("galleryViewCount:", galleryViewCount);

// Initialiser le visual novel au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  loadStory();

  const galleryIcon = document.getElementById("gallery-icon");

  const closeGalleryButton = document.getElementById("close-gallery");

  if (galleryIcon) {
    galleryIcon.addEventListener("click", () => {
      if (isGalleryClickable) {
        window.VisualNovelAPI.showGallery();
      } else {
        alert("La galerie n'est pas encore accessible.");
      }
    });
  }

  if (closeGalleryButton) {
    closeGalleryButton.addEventListener("click", () => {
      window.VisualNovelAPI.hideGallery();
    });
  }

  const bankIcon = document.getElementById("bank-icon");
  if (bankIcon) {
    bankIcon.addEventListener("click", () => {
      window.VisualNovelAPI.showBank();
    });
  }

  // Déclencher un événement lorsque VisualNovelAPI est prêt
  document.dispatchEvent(new Event("visualNovelAPIReady"));
});

function handleEndOfScenario() {
  const dialogueBox = document.getElementById("dialogue-box");
  if (dialogueBox) dialogueBox.classList.remove("hidden");

  if (currentScenario && currentScenario.next) {
    window.VisualNovelAPI.startScenario(currentScenario.next);
  } else if (
    currentScenario &&
    currentScenario.choices &&
    currentScenario.choices.length > 0
  ) {
    if (dialogueBox) dialogueBox.classList.remove("hidden");
    showChoices(currentScenario.choices);
  } else if (currentScenario && currentScenario.nextScene) {
    displayScene(currentScenario.nextScene);
    currentScenario = null;
    currentScenarioIndex = 0;
    currentProtagonistDialogueIndex = 0;
    currentThoughtIndex = 0;
    isCurrentlyProtagonistDialogue = false;
  } else {
    if (dialogueBox) dialogueBox.classList.remove("hidden");
  }
}

function displayScenarioDialogue() {
  const dialogueBox = document.getElementById("dialogue-box");
  const dialogueTextEl = document.getElementById("dialogue-text");
  const characterNameEl = document.getElementById("character-name");
  const dialogueImageEl = document.getElementById("dialogue-image"); // Get the image element

  // Clear previous dialogue image
  if (dialogueImageEl) dialogueImageEl.remove();

  // Déterminer quel ensemble de textes et quel personnage est actif
  let currentTexts;
  let currentCharacter;
  let currentIndex;
  let isThought = false; // New flag to indicate if current text is a thought

  // Check for a link in the current scenario
  const scenarioLink = currentScenario.lien;

  // Prioritize protagonist's thoughts
  if (
    currentScenario.currentDialogueTurn === "you" &&
    currentScenario.thoughts &&
    currentThoughtIndex < currentScenario.thoughts.length
  ) {
    currentTexts = currentScenario.thoughts;
    currentCharacter = "protagonist"; // Thoughts are from protagonist
    currentIndex = currentThoughtIndex;
    isCurrentlyProtagonistDialogue = true;
    isThought = true;
  } else if (currentScenario.currentDialogueTurn === "you") {
    if (
      currentScenario.textsProtagonist &&
      currentProtagonistDialogueIndex < currentScenario.textsProtagonist.length
    ) {
      currentTexts = currentScenario.textsProtagonist;
      currentCharacter = "protagonist";
      currentIndex = currentProtagonistDialogueIndex;
      isCurrentlyProtagonistDialogue = true;
    } else if (
      currentScenario.texts &&
      currentScenarioIndex < currentScenario.texts.length
    ) {
      // Si le protagoniste n'a plus de texte, mais l'ami en a, passer à l'ami
      currentTexts = currentScenario.texts;
      currentCharacter = currentScenario.who || "inconnu";
      currentIndex = currentScenarioIndex;
      isCurrentlyProtagonistDialogue = false;
    } else {
      // Aucun des deux n'a de texte, passer à la suite
      handleEndOfScenario();
      return;
    }
  } else if (currentScenario.currentDialogueTurn === "friend") {
    if (
      currentScenario.texts &&
      currentScenarioIndex < currentScenario.texts.length
    ) {
      currentTexts = currentScenario.texts;
      currentCharacter = currentScenario.who || "inconnu";
      currentIndex = currentScenarioIndex;
      isCurrentlyProtagonistDialogue = false;
    } else if (
      currentScenario.textsProtagonist &&
      currentProtagonistDialogueIndex < currentScenario.textsProtagonist.length
    ) {
      // Si l'ami n'a plus de texte, mais le protagoniste en a, passer au protagoniste
      currentTexts = currentScenario.textsProtagonist;
      currentCharacter = "protagonist";
      currentIndex = currentProtagonistDialogueIndex;
      isCurrentlyProtagonistDialogue = true;
    } else {
      // Aucun des deux n'a de texte, passer à la suite
      handleEndOfScenario();
      return;
    }
  } else {
    // Fallback if currentDialogueTurn is not set or invalid
    handleEndOfScenario();
    return;
  }

  // Set the click handler for advancing the scenario dialogue
  dialogueBox.onclick = null; // Clear previous click handler
  dialogueBox.onclick = () => {
    if (isThought) {
      currentThoughtIndex++;
      currentScenario.currentDialogueTurn = "friend"; // After thought, switch to friend's turn
    } else if (isCurrentlyProtagonistDialogue) {
      currentProtagonistDialogueIndex++;
      currentScenario.currentDialogueTurn = "friend"; // Switch to friend's turn
    } else {
      currentScenarioIndex++;
      currentScenario.currentDialogueTurn = "you"; // Switch to protagonist's turn
    }
    displayScenarioDialogue(); // Advance to the next dialogue
  };

  if (dialogueBox) dialogueBox.classList.remove("hidden");
  if (window.ChatAppAPI) window.ChatAppAPI.showChatApp();
  if (window.ChatAppAPI) {
    window.ChatAppAPI.selectContact("inconnu"); // Assurez-vous que le contact est toujours l'inconnu pour le chat
  }

  const dialogue = {
    character: currentCharacter,
    text: currentTexts[currentIndex],
    avatar: currentScenario.avatar || "",
    sfx: currentScenario.audio || "",
    image: currentScenario.image || "",
    audioPlayer: currentScenario.audioPlayer || null, // Ajouter audioPlayer ici
  };

  // Display message in chat app
  if (!isThought && window.ChatAppAPI) {
    const delay = window.ChatAppAPI.messageDisplayDelay || 200; // Utiliser le délai du chat ou 200ms par défaut
    setTimeout(() => {
      if (dialogue.audioPlayer) {
        window.ChatAppAPI.addAudioMessage(
          dialogue.audioPlayer.src,
          dialogue.character === "protagonist" ? "you" : "friend"
        );
      } else {
        // Ajouter le lien si disponible et si le personnage est inconnu
        let messageText = dialogue.text;
        if (scenarioLink && currentCharacter === "inconnu") {
          messageText += `<br><a href="bank.html" class="scenario-link" target="_blank" rel="noopener noreferrer">${scenarioLink}</a>`;
          const bankIcon = document.getElementById("bank-icon");
          if (bankIcon) {
            bankIcon.classList.remove("disabled");
            bankIcon.classList.add("active");
          }
        }
        window.ChatAppAPI.addMessage(
          messageText,
          dialogue.character === "protagonist" ? "you" : "friend",
          dialogue.image
        );
      }
    }, delay);
  }

  // Afficher le nom du personnage
  if (currentCharacter && !isThought) {
    // Hide character name for thoughts
    characterNameEl.textContent =
      currentCharacter === "inconnu"
        ? ""
        : currentCharacter === "protagonist"
        ? ""
        : storyData.characters[currentCharacter]
        ? storyData.characters[currentCharacter].name
        : currentCharacter;
    characterNameEl.style.display = "block";
  } else {
    characterNameEl.style.display = "none";
  }

  // Display thoughts directly in dialogueTextEl
  if (isThought) {
    const dialogueHint = document.getElementById("dialogue-hint");
    if (dialogueHint) {
      dialogueHint.style.display = "block";
    }
    dialogueTextEl.textContent = ""; // Clear previous text
    typewriterEffect(
      dialogueTextEl,
      dialogue.text,
      () => {
        // Once typing is complete, allow advancing
        // The click handler on dialogueBoxEl will manage progression
      },
      30,
      false // No typing sound for thoughts
    );
  } else {
    // Clear dialogue text for non-thought dialogues, as they are in chat
    dialogueTextEl.textContent = "";
  }
}
