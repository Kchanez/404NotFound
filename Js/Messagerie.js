
// Ouvrir le chat en cliquant sur l'icône Mail
document.getElementById('mail-icon').addEventListener('click', function() {
    if (this.classList.contains('disabled')) return; // inactif
    const chat = document.getElementById('chat-widget');
    chat.classList.remove('hidden');
    chat.setAttribute('aria-hidden', 'false');
    chatMessages.innerHTML = '';
    chatInput.value = '';
    chatMailIndex = 0;
    pushNextFriendMessage();
});

// Fermer le chat
document.getElementById('close-chat').addEventListener('click', function() {
    const chat = document.getElementById('chat-widget');
    chat.classList.add('hidden');
    chat.setAttribute('aria-hidden', 'true');
});

// Logique simple de messagerie
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

function getAvatarSrc(who, avatarKey) {
    try {
        if (!window.storyData || !storyData.characters) return null;
        const charKey = who === 'you' ? 'protagonist' : 'ami';
        const avatars = storyData.characters[charKey]?.avatars || {};
        const key = avatarKey && avatars[avatarKey] ? avatarKey : 'default';
        return avatars[key] || null;
    } catch (_) { return null; }
}

function addMessage(text, who = 'you', avatarKey = null) {
    const row = document.createElement('div');
    row.className = 'message-row ' + (who === 'you' ? 'you' : 'friend');
    const avatarSrc = getAvatarSrc(who, avatarKey);
    if (avatarSrc) {
        const img = document.createElement('img');
        img.className = 'message-avatar';
        img.src = avatarSrc;
        img.alt = who === 'you' ? 'Vous' : 'Ami';
        row.appendChild(img);
    }
    const bubble = document.createElement('div');
    bubble.className = 'message ' + (who === 'you' ? 'you' : 'friend');
    bubble.textContent = text;
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

let chatMailIndex = 0;
function pushNextFriendMessage() {
    if (!window.storyData || !storyData.scenes || !storyData.scenes.mail) {
        const replies = [
            "Salut, j'avais besoin de toi.",
            "Tu as vu le message?",
            "On doit agir vite.",
            "Je t'explique tout, reste en ligne."
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        setTimeout(() => addMessage(reply, 'friend'), 800);
        return;
    }
    const mailScene = storyData.scenes.mail;
    if (chatMailIndex >= mailScene.dialogue.length) return;
    const msg = mailScene.dialogue[chatMailIndex++];
    const avatarKey = msg.avatar || 'default';
    setTimeout(() => addMessage(msg.text, 'friend', avatarKey), 600);
}

chatSend.addEventListener('click', function() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, 'you');
    chatInput.value = '';
    pushNextFriendMessage();
});

chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        chatSend.click();
    }
});
