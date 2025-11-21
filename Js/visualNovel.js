// Script pour le Visual Novel
let storyData = null;
let currentScene = "start";
let currentScenario = null; // Déclarer globalement
let currentScenarioIndex = 0; // Déclarer globalement

// État global pour bloquer la progression en attendant le clic sur le rappel
let isWaitingForNotificationClick = false;
let hasNotificationBeenClicked = false;
let blockedChoices = null;
let blockedDialogues = null;
let blockedIndex = -1;
let isWaitingForCtaClick = false; // Nouvelle variable d'état
let hasInjectedHeyMessage = false;

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
  console.log("displayScene:", sceneId);
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
function showDialogue(dialogues, index, choices, scenarioChoices = null) {
  console.log("showDialogue: index=", index, "dialogue=", dialogues[index]);
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
  const mainChatCtaBtn = document.getElementById('main-chat-cta-btn'); // Récupérer le bouton
  const dialogueBoxEl = document.getElementById("dialogue-box");

  

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
    if (dialogueHint) dialogueHint.style.display = "block";
  };
  const onUnblock = () => {
    // Plus de logique de déblocage: on ne bloque plus la progression
  };

  // 1) Rappel Anniversaire (bloque sur la phrase cible)
  if (window.RappelAnnivAPI) {
    window.RappelAnnivAPI.handleDialogue(dialogue.text, onBlock, onUnblock);
  }
  // 2) Rappel examen / Ding (module existant)
  if (window.RappelAPI) {
    window.RappelAPI.handleDialogue(dialogue.text, onBlock, onUnblock);
  }
  // 3) Rappel message vide (ne bloque pas)
  let isEmptyMessage = false;
  if (window.RappelMessageVideAPI) {
    isEmptyMessage = window.RappelMessageVideAPI.handleDialogue(dialogue.text);
  }



  // Ouvrir le panneau de chat principal au message exact demandé
  if (
    typeof dialogue.text === 'string' &&
    dialogue.text.trim() === 'Ah tiens un nouveau message. Surement une erreur ce numéro n’est pas dans mes contacts'
  ) {
    if (window.ChatAppAPI) {
      window.ChatAppAPI.showChatApp();
      window.ChatAppAPI.selectContact('inconnu');
      if (!hasInjectedHeyMessage) {
        setTimeout(() => {
          window.ChatAppAPI.addMessage('Hey', 'friend');
        }, 500);
        hasInjectedHeyMessage = true;
      }
    }
    if (mainChatCtaBtn) {
      mainChatCtaBtn.classList.add('blinking');
    }
  }

  // Afficher l'écran piraté si le texte est "...."
  if (typeof dialogue.text === 'string' && dialogue.text.trim() === '....') {
    if (window.showHackedScreen) {
      window.showHackedScreen();
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
  // const dialogueBoxEl = document.getElementById("dialogue-box"); // Already declared above
  let isTyping = true;
  let advanced = false;
  dialogueBoxEl.onclick = () => {
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
      // Si le message précédent était vide, masquer l'application de chat privé
      if (isEmptyMessage) {
        const privateChatApp = document.getElementById('private-chat-app');
        if (privateChatApp) {
          privateChatApp.classList.add('hidden');
          privateChatApp.setAttribute('inert', '');
          privateChatApp.style.display = 'none';
        }
      }
      showDialogue(dialogues, index + 1, choices, scenarioChoices);
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
// Nouvelle fonction pour afficher les choix
// (ancienne implémentation showChoices supprimée)

// Nouvelle fonction pour gérer les choix
function handleChoice(choice) {
  console.log("handleChoice: choice=", choice);

  // Add the chosen reply text to the chat as a message from the protagonist
  if (window.ChatAppAPI && choice.reply) {
    console.log("Attempting to add user reply to chat:", choice.reply);
    window.ChatAppAPI.addMessage(choice.reply, 'you');
  }

  const hackedScreen = document.getElementById('hacked-screen');
  if (hackedScreen) hackedScreen.classList.add('hidden');
  const mainChatCtaBtn = document.getElementById('main-chat-cta-btn');
  if (mainChatCtaBtn) mainChatCtaBtn.classList.remove('blinking');

  if (choice.next && storyData && storyData.scenarios && storyData.scenarios[choice.next]) {
    // Gérer les transitions internes des scénarios via la propriété 'next'
    window.VisualNovelAPI.startScenario(choice.next);
  } else if (choice.nextScenario) {
    // Si le choix mène à un scénario, le démarrer
    window.VisualNovelAPI.startScenario(choice.nextScenario);
  } else if (choice.nextScene) {
    // Sinon, continuer avec la scène normale
    displayScene(choice.nextScene);
  } else {
    console.warn("Choice has no valid nextScene or nextScenario:", choice);
  }
}

// Override: afficher les choix via #hacked-screen
function showChoices(choices) {
  const hackedScreen = document.getElementById('hacked-screen');
  const errorActions = hackedScreen ? hackedScreen.querySelector('.error-actions') : null;

  if (hackedScreen) hackedScreen.classList.remove('hidden');
  if (errorActions) errorActions.innerHTML = "";

  setTimeout(() => {
    if (choices.length === 1 && choices[0].text === "Répondre") {
      const button = document.createElement("button");
      button.textContent = choices[0].text;
      button.classList.add("choice-button");
      button.onclick = () => handleChoice(choices[0]);
      if (errorActions) errorActions.appendChild(button);
    } else {
      choices.forEach((choice) => {
        const button = document.createElement("button");
        button.textContent = choice.text;
        button.classList.add("choice-button");
        button.onclick = () => handleChoice(choice);
        if (errorActions) errorActions.appendChild(button);
      });
    }
  }, 400);
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

window.VisualNovelAPI = {
  unblockStory: () => {
    isWaitingForCtaClick = false;
    document.getElementById('main-chat-cta-btn').classList.remove('blinking');
    // Resume dialogue from where it was blocked
    if (blockedDialogues && blockedIndex !== -1) {
      showDialogue(blockedDialogues, blockedIndex + 1, blockedChoices);
      blockedDialogues = null; // Clear blocked state
      blockedIndex = -1;
      blockedChoices = null;
    }
  },
  startScenario: (scenarioName) => {
    console.log("startScenario: scenarioName=", scenarioName);
    // hideHackedScreen(); // Ensure hacked screen is hidden
    if (storyData && storyData.scenarios && storyData.scenarios[scenarioName]) {
      currentScenario = storyData.scenarios[scenarioName];
      console.log("startScenario: currentScenario after assignment=", currentScenario);
      currentScenarioIndex = 0;
      displayScenarioDialogue();
    } else {
      console.error(`Scenario ${scenarioName} not found.`);
    }
  },
  showScenarioChoices: (scenarioName) => {
    if (storyData && storyData.scenarios && storyData.scenarios[scenarioName] && Array.isArray(storyData.scenarios[scenarioName].choices)) {
      showChoices(storyData.scenarios[scenarioName].choices);
    }
  }
};

// Initialiser le visual novel au chargement de la page
document.addEventListener("DOMContentLoaded", loadStory);

function displayScenarioDialogue() {
  console.log("displayScenarioDialogue: currentScenario=", currentScenario, "currentScenarioIndex=", currentScenarioIndex);
  const dialogueBox = document.getElementById("dialogue-box");

  if (!currentScenario || (currentScenario.texts === undefined && currentScenario.text === undefined && !currentScenario.choices)) {
    console.log("Scenario finished or not started, or invalid scenario structure.");
    if (dialogueBox) dialogueBox.classList.remove('hidden');
    if (window.ChatAppAPI) window.ChatAppAPI.hideChatApp();

    if (currentScenario && currentScenario.nextScene) {
      displayScene(currentScenario.nextScene);
      currentScenario = null; // Reset current scenario
      currentScenarioIndex = 0; // Reset scenario index
    } else {
      // If no nextScene, then truly end of scenario
      if (dialogueBox) dialogueBox.classList.remove('hidden');
    }
    return;
  }

  // Ensure scenarioTexts is always an array
  const scenarioTexts = currentScenario.texts || (currentScenario.text ? [currentScenario.text] : []);

  // Hide all scenes initially
  console.log("Before checking currentScenario.texts.length: currentScenario=", currentScenario, "currentScenario.texts=", currentScenario ? currentScenario.texts : "undefined");
  if (!currentScenario || currentScenarioIndex >= scenarioTexts.length) {
    console.log("Scenario finished or not started.");
    if (dialogueBox) dialogueBox.classList.remove('hidden'); // Show VN dialogue box
    if (window.ChatAppAPI) window.ChatAppAPI.hideChatApp(); // Hide chat app

    if (currentScenario && currentScenario.nextScene) {
      displayScene(currentScenario.nextScene);
      currentScenario = null; // Reset current scenario
      currentScenarioIndex = 0; // Reset scenario index
    } else {
      if (dialogueBox) dialogueBox.classList.remove('hidden');
    }
    return;
  }

  if (dialogueBox) dialogueBox.classList.remove('hidden');
  if (window.ChatAppAPI) window.ChatAppAPI.showChatApp();
  if (window.ChatAppAPI) {
    window.ChatAppAPI.selectContact('inconnu');
    if (!hasInjectedHeyMessage) {
      setTimeout(() => {
        window.ChatAppAPI.addMessage('Hey', 'friend');
      }, 500);
      hasInjectedHeyMessage = true;
    }
  }

  const dialogue = {
    character: currentScenario.who,
    text: scenarioTexts[currentScenarioIndex],
    avatar: currentScenario.avatar || '',
    sfx: currentScenario.audio || '',
  };

  // Display message in chat app
  if (window.ChatAppAPI) {
    // Assuming 'inconnu' is the contact ID for the unknown sender
    window.ChatAppAPI.selectContact('inconnu');
    const msgText = (dialogue.text || '').trim();
    if (!(hasInjectedHeyMessage && msgText === 'Hey')) {
      window.ChatAppAPI.addMessage(dialogue.text, dialogue.character === 'protagonist' ? 'you' : 'friend');
    }
  }

  // Manage advancing the dialogue or showing choices
  if (currentScenarioIndex < scenarioTexts.length - 1) {
    // If there are more texts in the current scenario, advance to the next text
    // We need a way to advance the chat dialogue, perhaps a click on the chat window itself
    // For now, let's just advance automatically after a short delay for demonstration
    setTimeout(() => {
      currentScenarioIndex++;
      displayScenarioDialogue();
    }, 1500); // Simulate reading time
  } else if (currentScenario.choices && currentScenario.choices.length > 0) {
    // If it's the last text and there are choices, show them in the VN dialogue box
    if (dialogueBox) dialogueBox.classList.remove('hidden'); // Show VN dialogue box for choices
    showChoices(currentScenario.choices);
  } else {
    // If it's the last text and no choices, automatically transition if nextScene is defined
    if (currentScenario.nextScene) {
      displayScene(currentScenario.nextScene);
      currentScenario = null; // Reset current scenario
      currentScenarioIndex = 0; // Reset scenario index
      if (window.ChatAppAPI) window.ChatAppAPI.hideChatApp(); // Hide chat app
    } else {
      if (window.ChatAppAPI) window.ChatAppAPI.hideChatApp();
      if (dialogueBox) dialogueBox.classList.remove('hidden');
    }
  }
}

 

// (ancienne fonction startScenario supprimée – utiliser VisualNovelAPI.startScenario)

// Function to unblock the story progression
// (ancienne fonction unblockStory supprimée – utiliser VisualNovelAPI.unblockStory)
