// Chat privé fonctionnel: rendu des anciens messages, CTA répondre, envoi et auto-réponse
(function() {
  const messagesEl = document.getElementById('pc-messages');
  const ctaEl = document.getElementById('pc-cta');
  const ctaBtn = document.getElementById('pc-cta-btn');
  const composerEl = document.getElementById('pc-composer');
  const inputEl = document.getElementById('pc-input');
  const sendBtn = document.getElementById('pc-send');

  const STORAGE_KEY = 'private_chat_thread_v1';
  let thread = loadThread();

  function loadThread() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return PRIVATE_CHAT_DATA.thread.slice();
      return JSON.parse(raw);
    } catch(_) { return PRIVATE_CHAT_DATA.thread.slice(); }
  }
  function saveThread() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(thread)); } catch(_) {}
  }

  function render() {
    messagesEl.innerHTML = '';
    thread.forEach(m => {
      if (m.who === 'date') { addDateSep(m.text); }
      else { addBubble(m.text, m.who); }
    });
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBubble(text, who) {
    const row = document.createElement('div');
    row.className = 'row ' + (who === 'you' ? 'you' : 'friend');
    const bubble = document.createElement('div');
    bubble.className = 'bubble ' + (who === 'you' ? 'you' : 'friend') + ' shadow';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesEl.appendChild(row);
    // Auto-scroll pour garder le dernier message visible
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addDateSep(text) {
    const sep = document.createElement('div');
    sep.className = 'date-sep';
    sep.textContent = text;
    messagesEl.appendChild(sep);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showComposer() {
    ctaEl.classList.add('hidden');
    composerEl.classList.remove('hidden');
    inputEl.focus();
  }

  function send() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    thread.push({ who: 'you', text });
    saveThread();
    render();
    autoReply();
  }

  function autoReply() {
    const reply = PRIVATE_CHAT_REPLIES[Math.floor(Math.random() * PRIVATE_CHAT_REPLIES.length)];
    setTimeout(() => {
      thread.push({ who: 'friend', text: reply });
      saveThread();
      render();
      // Protection supplémentaire si des assets se chargent après coup
      setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 0);
    }, 800);
  }

  ctaBtn.addEventListener('click', showComposer);
  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  render();
})();