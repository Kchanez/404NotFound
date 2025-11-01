// Script pour le Visual Novel
let storyData = null;
let currentScene = 'start';

// Charger l'histoire depuis le fichier JSON
function loadStory() {
    console.log('Chargement du scénario...');
    fetch('./story.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors du chargement du scénario');
            }
            console.log('Réponse reçue:', response);
            return response.json();
        })
        .then(data => {
            console.log('Données chargées:', data);
            storyData = data;
            // Commencer par la scène de départ
            if (storyData && storyData.scenes && storyData.scenes.start) {
                displayScene('start');
            } else {
                throw new Error('Structure de données incorrecte');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            document.getElementById('dialogue-text').textContent = 'Erreur lors du chargement du scénario: ' + error.message;
            document.getElementById('dialogue-text').style.display = 'block';
        });
}

// Afficher une scène
function displayScene(sceneId) {
    if (!storyData || !storyData.scenes[sceneId]) {
        console.error('Scène non trouvée:', sceneId);
        return;
    }

    const scene = storyData.scenes[sceneId];
    currentScene = sceneId;
    
    // Récupérer les éléments du DOM
    const container = document.getElementById('novel-container');
    const dialogueBox = document.getElementById('dialogue-box');
    const characterName = document.getElementById('character-name');
    const dialogueText = document.getElementById('dialogue-text');
    const choicesContainer = document.getElementById('choices-container');
    
    // Recréer les éléments pour éviter les problèmes
    dialogueBox.innerHTML = `
        <div id="character-name"></div>
        <div id="dialogue-text"></div>
        <div id="choices-container"></div>
    `;
    
    // Récupérer à nouveau les références après reconstruction
    const characterNameElement = document.getElementById('character-name');
    const dialogueTextElement = document.getElementById('dialogue-text');
    const choicesContainerElement = document.getElementById('choices-container');
    
    // Changer l'arrière-plan si spécifié
    if (scene.background && storyData.backgrounds[scene.background]) {
        container.style.backgroundImage = `url('${storyData.backgrounds[scene.background]}')`;
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
        // Fin des dialogues, afficher les choix
        showChoices(choices);
        return;
    }
    
    const dialogue = dialogues[index];
    const characterName = document.getElementById('character-name');
    const dialogueText = document.getElementById('dialogue-text');
    
    // S'assurer que le texte est visible
    dialogueText.style.display = 'block';
    
    // Créer l'élément d'image du personnage s'il n'existe pas
    let characterImage = document.getElementById('character-image');
    if (!characterImage) {
        characterImage = document.createElement('img');
        characterImage.id = 'character-image';
        document.getElementById('novel-container').appendChild(characterImage);
    }
    
    // Jouer un effet sonore si spécifié
    if (dialogue.sfx && storyData.audio.sfx[dialogue.sfx]) {
        playAudio(storyData.audio.sfx[dialogue.sfx], false);
    }
    
    // Afficher le nom du personnage
    if (dialogue.character && storyData.characters[dialogue.character]) {
        characterName.textContent = storyData.characters[dialogue.character].name;
        characterName.style.display = 'block';
        
        // Afficher l'avatar du personnage si spécifié
        if (dialogue.avatar && storyData.characters[dialogue.character].avatars[dialogue.avatar]) {
            characterImage.src = storyData.characters[dialogue.character].avatars[dialogue.avatar];
            characterImage.style.display = 'block';
        } else {
            characterImage.style.display = 'none';
        }
    } else {
        characterName.style.display = 'none';
        characterImage.style.display = 'none';
    }
    
    // Afficher le texte avec effet de machine à écrire
    typewriterEffect(dialogueText, dialogue.text, () => {
        // Attendre que l'utilisateur clique pour continuer
        document.getElementById('dialogue-box').onclick = () => {
            showDialogue(dialogues, index + 1, choices);
        };
    });
}

// Effet de machine à écrire pour le texte
function typewriterEffect(element, text, callback, speed = 30) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    
    type();
}

// Afficher les choix
function showChoices(choices) {
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    if (!choices || choices.length === 0) {
        // S'il n'y a pas de choix, ajouter un bouton pour continuer
        const button = document.createElement('button');
        button.textContent = 'Continuer';
        button.onclick = () => {
            // Fin de l'histoire ou redirection vers une autre page
            alert('Fin de cette partie de l\'histoire.');
        };
        choicesContainer.appendChild(button);
        return;
    }
    
    // Créer un bouton pour chaque choix
    choices.forEach(choice => {
        const button = document.createElement('button');
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
    audio.play().catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
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
document.addEventListener('DOMContentLoaded', loadStory);