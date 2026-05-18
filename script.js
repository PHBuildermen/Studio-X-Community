const state = {
  activeChannel: "announcements",
  searchTerm: "",
  modalMode: "create",
  loading: false,
  channels: {
    announcements: {
      title: "announcements",
      subtitle: "Official updates, news, and event posts.",
      icon: "#icon-megaphone",
      unread: 3,
      messages: [
        { type: "system", user: "Studio Lite", text: "Welcome to Studio Lite Community. Read the latest updates here." },
        { user: "Ari", time: "09:12", text: "New update posted for the community event schedule." },
        { user: "Mika", time: "09:20", text: "The new banner set looks really clean." }
      ]
    },
    rules: {
      title: "rules",
      subtitle: "Community standards and server etiquette.",
      icon: "#icon-settings",
      unread: 0,
      messages: [
        { type: "system", user: "Mod Team", text: "Be respectful, keep discussions safe, and avoid spam." },
        { user: "Nico", time: "08:43", text: "Pinned rules are easy to follow. Great layout too." }
      ]
    },
    general: {
      title: "general-chat",
      subtitle: "Daily conversations, questions, and casual talk.",
      icon: "#icon-hash",
      unread: 0,
      messages: [
        { user: "Jules", time: "10:01", text: "Anyone working on a new project today?" },
        { user: "Lena", time: "10:05", text: "I’m polishing a dashboard concept for my portfolio." },
        { user: "Kai", time: "10:11", text: "This UI feels polished already." }
      ]
    },
    world: {
      title: "world-chat",
      subtitle: "Broader discussion for everyone in the community.",
      icon: "#icon-globe",
      unread: 1,
      messages: [
        { user: "Sam", time: "Yesterday", text: "Share your favorite tools for building community sites." },
        { user: "Ivy", time: "Yesterday", text: "I love interfaces that feel calm but still energetic." }
      ]
    },
    suggestions: {
      title: "suggestions",
      subtitle: "Feature ideas, feedback, and improvement requests.",
      icon: "#icon-lightbulb",
      unread: 1,
      messages: [
        { user: "Nova", time: "11:15", text: "Could we add channel tags and better mobile spacing?" },
        { user: "Studio Lite", time: "11:16", text: "That is a great idea. Thanks for the suggestion!" }
      ]
    },
    media: {
      title: "media",
      subtitle: "Images, clips, and showcase posts.",
      icon: "#icon-image",
      unread: 0,
      messages: [
        { user: "Rae", time: "12:02", text: "Posted a mockup preview for the new landing page." },
        { user: "Mina", time: "12:09", text: "The card spacing and color balance look excellent." }
      ]
    }
  }
};

const els = {
  body: document.body,
  sidebar: document.getElementById("sidebar"),
  openSidebarBtn: document.getElementById("openSidebarBtn"),
  closeSidebarBtn: document.getElementById("closeSidebarBtn"),
  createServerBtn: document.getElementById("createServerBtn"),
  joinServerBtn: document.getElementById("joinServerBtn"),
  openCreateServerRail: document.getElementById("openCreateServerRail"),
  openJoinServerRail: document.getElementById("openJoinServerRail"),
  inviteBtn: document.getElementById("inviteBtn"),
  globalSearch: document.getElementById("globalSearch"),
  channelTitle: document.getElementById("channelTitle"),
  channelSubtitle: document.getElementById("channelSubtitle"),
  messageList: document.getElementById("messageList"),
  messageInput: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),
  loadingLayer: document.getElementById("loadingLayer"),
  channelButtons: Array.from(document.querySelectorAll(".channel-item")),
  modalOverlay: document.getElementById("modalOverlay"),
  modalTitle: document.getElementById("modalTitle"),
  modalKicker: document.getElementById("modalKicker"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  cancelModalBtn: document.getElementById("cancelModalBtn"),
  confirmModalBtn: document.getElementById("confirmModalBtn"),
  createFields: document.getElementById("createFields"),
  joinFields: document.getElementById("joinFields"),
  serverName: document.getElementById("serverName"),
  serverCode: document.getElementById("serverCode"),
  serverNote: document.getElementById("serverNote"),
  modalTabs: Array.from(document.querySelectorAll(".modal-tab")),
  toastStack: document.getElementById("toastStack"),
  attachBtn: document.getElementById("attachBtn"),
  emojiBtn: document.getElementById("emojiBtn")
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function nowTime() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function initial(name) {
  return String(name || "U").trim().charAt(0).toUpperCase();
}

function toast(title, message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
  els.toastStack.appendChild(node);

  setTimeout(() => {
    node.style.opacity = "0";
    node.style.transform = "translateY(8px) scale(.98)";
    node.style.transition = "all .2s ease";
    setTimeout(() => node.remove(), 220);
  }, 2600);
}

function setSidebar(open) {
  document.body.classList.toggle("sidebar-open", open);
}

function showLoading(duration = 320) {
  els.loadingLayer.classList.add("show");
  window.clearTimeout(state.loadingTimer);
  state.loadingTimer = window.setTimeout(() => {
    els.loadingLayer.classList.remove("show");
  }, duration);
}

function setModal(mode) {
  state.modalMode = mode;
  els.modalOverlay.classList.add("show");
  els.modalOverlay.setAttribute("aria-hidden", "false");

  els.modalTabs.forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  els.createFields.hidden = mode !== "create";
  els.joinFields.hidden = mode !== "join";

  if (mode === "create") {
    els.modalTitle.textContent = "Create Server";
    els.confirmModalBtn.innerHTML = `<svg><use href="#icon-plus"></use></svg> Create Server`;
    els.serverName.focus();
  } else {
    els.modalTitle.textContent = "Join Server";
    els.confirmModalBtn.innerHTML = `<svg><use href="#icon-join"></use></svg> Join Server`;
    els.serverCode.focus();
  }
}

function closeModal() {
  els.modalOverlay.classList.remove("show");
  els.modalOverlay.setAttribute("aria-hidden", "true");
}

function setActiveChannel(channelKey) {
  if (!state.channels[channelKey] || state.activeChannel === channelKey) return;

  state.activeChannel = channelKey;
  showLoading();

  els.channelButtons.forEach(btn => {
    const active = btn.dataset.channel === channelKey;
    btn.classList.toggle("active", active);
  });

  els.channelTitle.textContent = state.channels[channelKey].title;
  els.channelSubtitle.textContent = state.channels[channelKey].subtitle;
  els.messageInput.placeholder = `Message #${state.channels[channelKey].title}`;

  state.channels[channelKey].unread = 0;
  renderChannels();

  window.setTimeout(() => {
    renderMessages();
    els.messageList.scrollTop = els.messageList.scrollHeight;
  }, 260);

  if (window.innerWidth <= 900) setSidebar(false);
}

function channelMatchesSearch(channelKey, term) {
  const channel = state.channels[channelKey];
  const text = `${channel.title} ${channel.subtitle}`.toLowerCase();
  return text.includes(term);
}

function renderChannels() {
  const term = state.searchTerm.trim().toLowerCase();

  els.channelButtons.forEach(btn => {
    const channelKey = btn.dataset.channel;
    const channel = state.channels[channelKey];
    const visible = !term || channelMatchesSearch(channelKey, term);
    btn.style.display = visible ? "" : "none";

    const badge = btn.querySelector(".unread-badge");
    if (badge) {
      if (channel.unread > 0) {
        badge.style.display = "";
        badge.textContent = badge.classList.contains("dot") ? "" : String(channel.unread);
      } else {
        badge.style.display = "none";
      }
    }
  });
}

function renderMessages() {
  const channel = state.channels[state.activeChannel];
  const term = state.searchTerm.trim().toLowerCase();
  const messages = channel.messages.filter(msg => {
    if (!term) return true;
    return `${msg.user} ${msg.text} ${msg.time || ""}`.toLowerCase().includes(term);
  });

  if (!messages.length) {
    els.messageList.innerHTML = `
      <div class="message system">
        <div class="message-body">
          <div>
            <span class="system-pill">
              <svg><use href="#icon-search"></use></svg>
              No results
            </span>
            <p class="message-text">Nothing matched your current search in #${channel.title}.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  els.messageList.innerHTML = messages.map(msg => {
    if (msg.type === "system") {
      return `
        <article class="message system">
          <div class="message-body">
            <div>
              <span class="system-pill">
                <svg><use href="#icon-bell"></use></svg>
                System update
              </span>
              <p class="message-text"><strong>${msg.user}:</strong> ${msg.text}</p>
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="message">
        <div class="avatar">${initial(msg.user)}</div>
        <div class="message-body">
          <div class="message-head">
            <span class="message-author">${msg.user}</span>
            <span class="message-time">${msg.time || nowTime()}</span>
          </div>
          <p class="message-text">${msg.text}</p>
        </div>
      </article>
    `;
  }).join("");
}

function sendMessage() {
  const text = els.messageInput.value.trim();
  if (!text) return;

  state.channels[state.activeChannel].messages.push({
    user: "You",
    time: nowTime(),
    text
  });

  els.messageInput.value = "";
  renderMessages();
  els.messageList.scrollTop = els.messageList.scrollHeight;
}

function simulateServerAction(mode) {
  if (mode === "create") {
    const serverName = els.serverName.value.trim();
    const note = els.serverNote.value.trim();

    if (!serverName) {
      toast("Missing server name", "Please type a server name before creating it.");
      els.serverName.focus();
      return;
    }

    toast("Server created", `${serverName} is ready. ${note ? "Your note was saved as a draft." : "You can customize it later."}`);
    state.channels[state.activeChannel].messages.push({
      type: "system",
      user: serverName,
      text: `A new server draft was created successfully.`
    });
    renderMessages();
    closeModal();
    return;
  }

  const code = els.serverCode.value.trim();
  if (!code) {
    toast("Missing invite code", "Please enter a server invite code.");
    els.serverCode.focus();
    return;
  }

  toast("Joined server", `Connected with invite code ${code}.`);
  state.channels[state.activeChannel].messages.push({
    type: "system",
    user: "Join status",
    text: `Successfully joined with invite code ${code}.`
  });
  renderMessages();
  closeModal();
}

function setModalMode(mode) {
  els.modalTabs.forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  state.modalMode = mode;
  els.createFields.hidden = mode !== "create";
  els.joinFields.hidden = mode !== "join";

  els.modalTitle.textContent = mode === "create" ? "Create Server" : "Join Server";
  els.confirmModalBtn.innerHTML = mode === "create"
    ? `<svg><use href="#icon-plus"></use></svg> Create Server`
    : `<svg><use href="#icon-join"></use></svg> Join Server`;
}

function bindEvents() {
  els.channelButtons.forEach(btn => {
    btn.addEventListener("click", () => setActiveChannel(btn.dataset.channel));
  });

  els.openSidebarBtn.addEventListener("click", () => setSidebar(true));
  els.closeSidebarBtn.addEventListener("click", () => setSidebar(false));

  const openCreate = () => setModal("create");
  const openJoin = () => setModal("join");

  els.createServerBtn.addEventListener("click", openCreate);
  els.joinServerBtn.addEventListener("click", openJoin);
  els.openCreateServerRail.addEventListener("click", openCreate);
  els.openJoinServerRail.addEventListener("click", openJoin);

  els.modalTabs.forEach(tab => {
    tab.addEventListener("click", () => setModalMode(tab.dataset.mode));
  });

  els.closeModalBtn.addEventListener("click", closeModal);
  els.cancelModalBtn.addEventListener("click", closeModal);

  els.modalOverlay.addEventListener("click", (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });

  els.confirmModalBtn.addEventListener("click", () => simulateServerAction(state.modalMode));

  els.globalSearch.addEventListener("input", (e) => {
    state.searchTerm = e.target.value.trim();
    renderChannels();
    renderMessages();
  });

  els.sendBtn.addEventListener("click", sendMessage);

  els.messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
    if (e.key === "Escape") els.messageInput.blur();
  });

  els.inviteBtn.addEventListener("click", () => {
    navigator.clipboard?.writeText("StudioLite-Invite-2048").catch(() => {});
    toast("Invite copied", "StudioLite-Invite-2048 was copied to your clipboard.");
  });

  els.attachBtn.addEventListener("click", () => {
    toast("Attachment", "Attachment picker can be connected to your upload flow later.");
  });

  els.emojiBtn.addEventListener("click", () => {
    const presets = [
      "Great work on this build!",
      "This layout feels really polished.",
      "Clean UI, strong spacing, nice hierarchy.",
      "Loving the community dashboard vibe."
    ];
    els.messageInput.value = presets[Math.floor(Math.random() * presets.length)];
    els.messageInput.focus();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      setSidebar(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      document.body.classList.remove("sidebar-open");
    }
  });
}

function init() {
  bindEvents();
  renderChannels();
  renderMessages();
  els.channelTitle.textContent = state.channels[state.activeChannel].title;
  els.channelSubtitle.textContent = state.channels[state.activeChannel].subtitle;
}

init();
