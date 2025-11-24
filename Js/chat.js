document.addEventListener('DOMContentLoaded', function() {

// Chat fonctionnel, séparé, basé sur CHAT_CONTACTS / CHAT_THREADS

(function() {
  const contactsEl = document.getElementById('contact-list');
  const messagesEl = document.getElementById('messages');
  const nameEl = document.getElementById('current-name');
  const statusEl = document.getElementById('current-status');
  const avatarEl = document.getElementById('current-avatar');
  const addBtn = document.getElementById('toggle-contact');
  // inputEl, sendBtn, mainChatComposer sont supprimés
  const mainChatCtaBtn = document.getElementById('main-chat-cta-btn');
  const mainChatCta = document.getElementById('main-chat-cta');
  const privateChatApp = document.getElementById('private-chat-app');
  const hackedScreen = document.getElementById('hacked-screen');

  // Persistance simple via localStorage
  const STORAGE_KEY = 'chat_threads_v1';
  let threads = loadThreads();
  let contacts = JSON.parse(JSON.stringify(CHAT_CONTACTS));
  let currentId = contacts[0].id; // par défaut: inconnu

  function loadThreads() {
    return JSON.parse(JSON.stringify(CHAT_THREADS));
  }
  function saveThreads() {}

  function renderContacts() {
    contactsEl.innerHTML = '';
    contacts.forEach(c => {
      const li = document.createElement('li');
      li.className = 'contact-item';
      li.dataset.id = c.id;
      const img = document.createElement('img');
      img.className = 'avatar';
      img.src = c.avatar;
      img.alt = c.name;
      const info = document.createElement('div');
      const name = document.createElement('div');
      name.className = 'contact-name';
      name.textContent = c.name;
      const preview = document.createElement('div');
      preview.className = 'contact-preview';
      const last = threads[c.id] && threads[c.id].length ? threads[c.id][threads[c.id].length - 1].text : '';
      preview.textContent = `Dernier message ${last ? '— ' + truncate(last, 22) : '…'}`;
      info.appendChild(name);
      info.appendChild(preview);
      li.appendChild(img);
      li.appendChild(info);
      li.addEventListener('click', () => selectContact(c.id));
      contactsEl.appendChild(li);
    });
  }

  function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function selectContact(id) {
    if (currentId !== id) { // Only clear if switching to a different contact
      messagesEl.innerHTML = '';
      currentId = id;
      const c = contacts.find(x => x.id === id);
      nameEl.textContent = c.name;
      avatarEl.src = c.avatar;
      statusEl.textContent = c.inContacts ? 'Dans vos contacts' : 'Ce compte ne fait pas partie de votre liste de contacts';
      addBtn.textContent = c.inContacts ? '−' : '+';
      renderThread();
    } else {
      // If the same contact is selected, just ensure the display is correct without clearing
      currentId = id;
      const c = contacts.find(x => x.id === id);
      nameEl.textContent = c.name;
      avatarEl.src = c.avatar;
      statusEl.textContent = c.inContacts ? 'Dans vos contacts' : 'Ce compte ne fait pas partie de votre liste de contacts';
      addBtn.textContent = c.inContacts ? '−' : '+';
      // No need to call renderThread() or clear messagesEl.innerHTML here
    }
  }

  function renderThread() {
    // messagesEl.innerHTML = ''; // This line is removed to prevent clearing messages
    const arr = threads[currentId] || [];
    arr.forEach(m => addMessage(m.text, m.who));
    // Se placer en bas pour voir les plus récents (ancien style WhatsApp)
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(text, who, image = null) {
    const row = document.createElement('div');
    row.className = 'msg-row ' + (who === 'you' ? 'you' : 'friend');
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + (who === 'you' ? 'you' : 'friend');

    if (image) {
      const imgElement = document.createElement('img');
      imgElement.src = image;
      imgElement.style.maxWidth = '100%';
      imgElement.style.borderRadius = '8px';
      imgElement.style.marginTop = '5px';
      bubble.appendChild(imgElement);
    }

    if (text) {
      const textNode = document.createTextNode(text);
      bubble.appendChild(textNode);
    }

    row.appendChild(bubble);
    messagesEl.appendChild(row);
    // Auto-scroll pour voir le message le plus récent
    setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 0);

    // Enregistrer le message dans le thread actuel
    const arr = threads[currentId] || (threads[currentId] = []);
    arr.push({ who, text, image });
    saveThreads();
  }

  // send fonction est supprimée

  function autoReply(id) {
    const replies = (CHAT_AUTO_REPLIES[id] || CHAT_AUTO_REPLIES.default);
    const reply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      const arr = threads[id] || (threads[id] = []);
      arr.push({ who: 'friend', text: reply });
      if (id === currentId) {
        addMessage(reply, 'friend');
        // S'assure que l'auto-réponse reste visible même si le contenu charge après coup
        setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 0);
      }
      saveThreads();
      renderContacts();
      const notif = document.getElementById('notification-sound');
      if (notif) { try { notif.currentTime = 0; notif.play(); } catch(_) {} }
    }, 700);
  }

  function toggleContact() {
    const c = contacts.find(x => x.id === currentId);
    c.inContacts = !c.inContacts;
    statusEl.textContent = c.inContacts ? 'Dans vos contacts' : 'Ce compte ne fait pas partie de votre liste de contacts';
    addBtn.textContent = c.inContacts ? '−' : '+';
  }

  addBtn.addEventListener('click', toggleContact);

  let isHackedShowing = false;
  function openHacked() {
    if (isHackedShowing) return;
    hackedScreen.classList.remove('hidden');
    isHackedShowing = true;

    // Jouer le son "errorWindows.mp3"
    const errorSound = new Audio("./Audios/windowsError.mp3");
    errorSound.play();
  }
  mainChatCtaBtn.addEventListener('click', () => {
    openHacked();
    setTimeout(() => {
      if (window.VisualNovelAPI && window.VisualNovelAPI.showScenarioChoices) {
        window.VisualNovelAPI.showScenarioChoices('start');
      }
      if (window.VisualNovelAPI) {
        window.VisualNovelAPI.unblockStory();
      }
    }, 180);
  });
  document.addEventListener('hackedScreenClosed', () => { isHackedShowing = false; });
  // Les écouteurs d'événements pour mainChatCtaBtn, sendBtn, inputEl sont supprimés

  // initialisation
  renderContacts();
  selectContact(currentId);

  // Exposer l'API du chat pour le visual novel
  window.ChatAppAPI = {
    addMessage: addMessage,
    selectContact: selectContact,
    showChatApp: () => {
      const chatApp = document.getElementById('chat-app');
      if (chatApp) {
        chatApp.classList.remove('hidden');
        chatApp.removeAttribute('inert');
        chatApp.removeAttribute('aria-hidden');
        chatApp.style.display = 'flex';
      }
    },
    hideChatApp: () => {
      const chatApp = document.getElementById('chat-app');
      if (chatApp) {
        chatApp.classList.add('hidden');
        chatApp.setAttribute('inert', '');
        chatApp.setAttribute('aria-hidden', 'true');
        chatApp.style.display = 'none';
      }
    }
  };
})();

});