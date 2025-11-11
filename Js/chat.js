// Chat fonctionnel, séparé, basé sur CHAT_CONTACTS / CHAT_THREADS

(function() {
  const contactsEl = document.getElementById('contact-list');
  const messagesEl = document.getElementById('messages');
  const nameEl = document.getElementById('current-name');
  const statusEl = document.getElementById('current-status');
  const avatarEl = document.getElementById('current-avatar');
  const addBtn = document.getElementById('toggle-contact');
  const inputEl = document.getElementById('composer-input');
  const sendBtn = document.getElementById('composer-send');
  const closeBtn = document.getElementById('close-window');

  // Persistance simple via localStorage
  const STORAGE_KEY = 'chat_threads_v1';
  let threads = loadThreads();
  let contacts = JSON.parse(JSON.stringify(CHAT_CONTACTS));
  let currentId = contacts[0].id; // par défaut: inconnu

  function loadThreads() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(CHAT_THREADS));
      const parsed = JSON.parse(raw);
      return Object.assign({}, CHAT_THREADS, parsed);
    } catch(_) {
      return JSON.parse(JSON.stringify(CHAT_THREADS));
    }
  }
  function saveThreads() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(threads)); } catch(_) {}
  }

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
    currentId = id;
    const c = contacts.find(x => x.id === id);
    nameEl.textContent = c.name;
    avatarEl.src = c.avatar;
    statusEl.textContent = c.inContacts ? 'Dans vos contacts' : 'Ce compte ne fait pas partie de votre liste de contacts';
    addBtn.textContent = c.inContacts ? '−' : '+';
    renderThread();
  }

  function renderThread() {
    messagesEl.innerHTML = '';
    const arr = threads[currentId] || [];
    arr.forEach(m => addMessage(m.text, m.who));
    // Se placer en bas pour voir les plus récents (ancien style WhatsApp)
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(text, who) {
    const row = document.createElement('div');
    row.className = 'msg-row ' + (who === 'you' ? 'you' : 'friend');
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + (who === 'you' ? 'you' : 'friend');
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    // Auto-scroll pour voir le message le plus récent
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    const arr = threads[currentId] || (threads[currentId] = []);
    arr.push({ who: 'you', text });
    addMessage(text, 'you');
    saveThreads();
    autoReply(currentId);
    renderContacts(); // met à jour l'aperçu du dernier message
  }

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

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
  addBtn.addEventListener('click', toggleContact);
  closeBtn.addEventListener('click', () => { window.location.href = 'index.html'; });

  // initialisation
  renderContacts();
  selectContact(currentId);
})();