(() => {
  const STORAGE_KEYS = {
    users: "studiox_users_v5",
    messages: "studiox_messages_v5",
    session: "studiox_session_v5",
    settings: "studiox_settings_v5",
    social: "studiox_social_v5"
  };

  const DEFAULT_SERVER = {
    name: "Studio X Community",
    description: "A verified community space for creators, moderators, and friends.",
    photo: ""
  };

  const DEFAULT_CHANNELS = [
    { id: "announcements", name: "announcements", description: "Official updates, news, and event posts.", emoji: "📣", category: "information" },
    { id: "rules", name: "rules", description: "Community standards and server etiquette.", emoji: "⚙️", category: "information" },
    { id: "general", name: "general-chat", description: "Daily conversations, questions, and casual talk.", emoji: "💬", category: "community" },
    { id: "world", name: "world-chat", description: "Broad discussion for everyone in the community.", emoji: "🌍", category: "community" },
    { id: "suggestions", name: "suggestions", description: "Feature ideas, feedback, and improvement requests.", emoji: "💡", category: "creative" },
    { id: "media", name: "media", description: "Images, clips, and showcase posts.", emoji: "🖼️", category: "creative" },
    { id: "reels", name: "reels", description: "Short videos and community highlights.", emoji: "🎬", category: "creative" }
  ];

  const DEFAULT_OWNER = {
    id: uid(),
    email: "owner@studiox.com",
    password: "@HugePasscode1",
    displayName: "PHBuilderman",
    bio: "Owner of Studio X Community.",
    role: "owner",
    verified: true,
    banned: false,
    warnings: 0,
    avatar: "",
    createdAt: Date.now()
  };

  const DEFAULT_ADMIN = {
    id: uid(),
    email: "admin@studiox.com",
    password: "@HugePasscode1",
    displayName: "PHBuildermen",
    bio: "Studio X Community admin.",
    role: "admin",
    verified: true,
    banned: false,
    warnings: 0,
    avatar: "",
    createdAt: Date.now()
  };

  const state = {
    currentUser: null,
    activeChannel: "announcements",
    authMode: "login",
    pendingMedia: null,
    pendingMediaType: "",
    pendingMediaName: "",
    profileTargetId: null,
    dmPeerId: null,
    loadingTimer: null,
    settings: {
      server: structuredClone(DEFAULT_SERVER),
      channels: structuredClone(DEFAULT_CHANNELS),
      inviteCode: "",
      readAt: {},
      prefs: {
        compact: false,
        sound: true,
        timestamps: true
      }
    },
    social: {
      users: {},
      dmThreads: {}
    }
  };

  const els = {
    body: document.body,
    authScreen: document.getElementById("authScreen"),
    authForm: document.getElementById("authForm"),
    authModeButtons: Array.from(document.querySelectorAll(".auth-switch-btn")),
    authSubmit: document.getElementById("authSubmit"),
    loginFields: Array.from(document.querySelectorAll(".auth-login-field")),
    signupFields: document.querySelector(".auth-signup-fields"),
    loginIdentity: document.getElementById("loginIdentity"),
    loginPassword: document.getElementById("loginPassword"),
    signupEmail: document.getElementById("signupEmail"),
    signupName: document.getElementById("signupName"),
    signupPassword: document.getElementById("signupPassword"),
    signupConfirm: document.getElementById("signupConfirm"),

    sidebar: document.getElementById("sidebar"),
    openSidebarBtn: document.getElementById("openSidebarBtn"),
    closeSidebarBtn: document.getElementById("closeSidebarBtn"),
    mobileBackdrop: document.getElementById("mobileBackdrop"),

    shareServerBtn: document.getElementById("shareServerBtn"),
    shareServerTopBtn: document.getElementById("shareServerRailBtn"),
    shareServerRailBtn: document.getElementById("shareServerRailBtn"),

    openSettingsBtn: document.getElementById("openSettingsBtn"),
    openSettingsRailBtn: document.getElementById("openSettingsRailBtn"),
    settingsBtn: document.getElementById("settingsBtn"),

    openProfileBtn: document.getElementById("openProfileBtn"),
    adminTopBtn: document.getElementById("adminTopBtn"),
    openAdminBtn: document.getElementById("openAdminBtn"),
    openAdminRailBtn: document.getElementById("openAdminRailBtn"),
    customizeServerBtn: document.getElementById("customizeServerBtn"),

    logoutBtn: document.getElementById("logoutBtn"),

    globalSearch: document.getElementById("globalSearch"),
    memberCountLabel: document.getElementById("peopleCount"),

    sidebarAvatar: document.getElementById("sidebarAvatar"),
    sidebarName: document.getElementById("sidebarName"),
    sidebarRole: document.getElementById("sidebarRole"),
    sidebarVerified: document.getElementById("sidebarVerified"),

    serverAvatar: document.getElementById("serverAvatar"),
    serverNameLabel: document.getElementById("serverNameLabel"),
    serverDescLabel: document.getElementById("serverDescLabel"),

    channelGroups: document.getElementById("channelGroups"),
    channelTitle: document.getElementById("channelTitle"),
    channelSubtitle: document.getElementById("channelSubtitle"),
    channelSymbol: document.getElementById("channelSymbol"),
    channelModePill: document.getElementById("channelModePill"),

    loadingLayer: document.getElementById("loadingLayer"),
    messageList: document.getElementById("messageList"),
    messageInput: document.getElementById("messageInput"),
    sendBtn: document.getElementById("sendBtn"),
    attachBtn: document.getElementById("attachBtn"),
    messageMediaInput: document.getElementById("messageMediaInput"),
    attachmentPreview: document.getElementById("attachmentPreview"),
    attachmentName: document.getElementById("attachmentName"),
    removeAttachmentBtn: document.getElementById("removeAttachmentBtn"),
    composerBar: document.getElementById("composerBar"),

    peoplePanel: document.getElementById("peoplePanel"),
    peopleBtn: document.getElementById("peopleBtn"),
    closePeopleBtn: document.getElementById("closePeopleBtn"),
    peopleSearch: document.getElementById("peopleSearch"),
    peopleList: document.getElementById("peopleList"),

    profileModal: document.getElementById("profileModal"),
    profileModalKicker: document.getElementById("profileModalKicker"),
    profileModalTitle: document.getElementById("profileModalTitle"),
    profileAvatarPreview: document.getElementById("profileAvatarPreview"),
    profilePreviewName: document.getElementById("profilePreviewName"),
    profilePreviewRole: document.getElementById("profilePreviewRole"),
    profilePreviewBio: document.getElementById("profilePreviewBio"),
    profileActionButtons: document.getElementById("profileActionButtons"),
    profileEditBlock: document.getElementById("profileEditBlock"),
    profileName: document.getElementById("profileName"),
    profileBio: document.getElementById("profileBio"),
    profileAvatarUrl: document.getElementById("profileAvatarUrl"),
    profileAvatarFile: document.getElementById("profileAvatarFile"),
    uploadAvatarBtn: document.getElementById("uploadAvatarBtn"),
    resetAvatarBtn: document.getElementById("resetAvatarBtn"),
    saveProfileBtn: document.getElementById("saveProfileBtn"),
    friendBtn: document.getElementById("friendBtn"),
    messageBtn: document.getElementById("messageBtn"),

    settingsModal: document.getElementById("settingsModal"),
    settingsAccountInfo: document.getElementById("settingsAccountInfo"),
    switchAccountBtn: document.getElementById("switchAccountBtn"),
    addAccountBtn: document.getElementById("addAccountBtn"),
    logoutFromSettingsBtn: document.getElementById("logoutFromSettingsBtn"),
    compactToggle: document.getElementById("compactToggle"),
    soundToggle: document.getElementById("soundToggle"),
    timestampToggle: document.getElementById("timestampToggle"),

    adminModal: document.getElementById("adminModal"),
    adminMembersList: document.getElementById("adminMembersList"),
    announcementText: document.getElementById("announcementText"),
    sendAnnouncementBtn: document.getElementById("sendAnnouncementBtn"),
    copyInviteBtn: document.getElementById("copyInviteBtn"),
    serverPreviewAvatar: document.getElementById("serverPreviewAvatar"),
    serverPreviewName: document.getElementById("serverPreviewName"),
    serverPreviewDesc: document.getElementById("serverPreviewDesc"),
    serverNameInput: document.getElementById("serverNameInput"),
    serverDescInput: document.getElementById("serverDescInput"),
    serverPhotoUrlInput: document.getElementById("serverPhotoUrlInput"),
    uploadServerPhotoBtn: document.getElementById("uploadServerPhotoBtn"),
    resetServerPhotoBtn: document.getElementById("resetServerPhotoBtn"),
    saveServerSettingsBtn: document.getElementById("saveServerSettingsBtn"),
    newChannelName: document.getElementById("newChannelName"),
    newChannelDesc: document.getElementById("newChannelDesc"),
    newChannelEmoji: document.getElementById("newChannelEmoji"),
    newChannelCategory: document.getElementById("newChannelCategory"),
    addChannelBtn: document.getElementById("addChannelBtn"),

    dmModal: document.getElementById("dmModal"),
    dmAvatar: document.getElementById("dmAvatar"),
    dmName: document.getElementById("dmName"),
    dmInfo: document.getElementById("dmInfo"),
    dmThread: document.getElementById("dmThread"),
    dmInput: document.getElementById("dmInput"),
    dmSendBtn: document.getElementById("dmSendBtn"),

    serverPhotoFile: document.getElementById("serverPhotoFile"),
    toastStack: document.getElementById("toastStack")
  };

  const savedUsers = loadJSON(STORAGE_KEYS.users, []);
  const savedMessages = loadJSON(STORAGE_KEYS.messages, []);
  const savedSession = loadJSON(STORAGE_KEYS.session, null);
  const savedSettings = loadJSON(STORAGE_KEYS.settings, null);
  const savedSocial = loadJSON(STORAGE_KEYS.social, null);

  let users = Array.isArray(savedUsers) ? savedUsers : [];
  let messages = Array.isArray(savedMessages) ? savedMessages : [];

  if (savedSettings && typeof savedSettings === "object") {
    state.settings = {
      server: savedSettings.server || structuredClone(DEFAULT_SERVER),
      channels: Array.isArray(savedSettings.channels) && savedSettings.channels.length ? savedSettings.channels : structuredClone(DEFAULT_CHANNELS),
      inviteCode: savedSettings.inviteCode || "",
      readAt: savedSettings.readAt || {},
      prefs: savedSettings.prefs || { compact: false, sound: true, timestamps: true }
    };
  }

  if (savedSocial && typeof savedSocial === "object") {
    state.social = {
      users: savedSocial.users || {},
      dmThreads: savedSocial.dmThreads || {}
    };
  }

  seedData();
  saveSettings();
  saveSocial();

  if (savedSession && savedSession.userId) {
    state.currentUser = users.find(u => u.id === savedSession.userId && !u.banned) || null;
    if (!state.currentUser) clearSession();
  }

  state.activeChannel = state.settings.channels.find(c => c.id === "announcements")?.id || state.settings.channels[0]?.id || "announcements";

  function uid() {
    return window.crypto?.randomUUID?.() || `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }

  function seedData() {
    const ownerExists = users.some(u => u.email?.toLowerCase() === DEFAULT_OWNER.email.toLowerCase() || u.displayName?.toLowerCase() === DEFAULT_OWNER.displayName.toLowerCase());
    const adminExists = users.some(u => u.email?.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase() || u.displayName?.toLowerCase() === DEFAULT_ADMIN.displayName.toLowerCase());

    if (!ownerExists) users.unshift({ ...DEFAULT_OWNER });
    if (!adminExists) users.splice(1, 0, { ...DEFAULT_ADMIN });

    users = users.map(u => {
      if (u.displayName === "PHBuilderman") return { ...u, role: "owner", verified: true, banned: false };
      if (u.displayName === "PHBuildermen") return { ...u, role: "admin", verified: true, banned: false };
      if (!u.role) return { ...u, role: "member", verified: false, banned: false, warnings: u.warnings || 0, bio: u.bio || "", avatar: u.avatar || "" };
      return u;
    });

    ensureSocialForAllUsers();

    if (!messages.length) {
      const owner = users.find(u => u.role === "owner");
      const admin = users.find(u => u.role === "admin");
      messages = [
        { id: uid(), channel: "announcements", userId: "system", text: "Welcome to Studio X Community. This server uses local accounts, roles, private messages, and media uploads.", createdAt: Date.now() - 1000 * 60 * 60, system: true },
        { id: uid(), channel: "announcements", userId: owner?.id || users[0].id, text: "I’m PHBuilderman, the owner of Studio X. Please keep the server clean, creative, and respectful.", createdAt: Date.now() - 1000 * 60 * 45, announcement: true },
        { id: uid(), channel: "rules", userId: "system", text: "Be respectful. No spam. No harassment. Follow staff instructions.", createdAt: Date.now() - 1000 * 60 * 35, system: true },
        { id: uid(), channel: "general", userId: admin?.id || users[1].id, text: "PHBuildermen is here to help moderate the community and keep everything organized.", createdAt: Date.now() - 1000 * 60 * 28 },
        { id: uid(), channel: "general", userId: owner?.id || users[0].id, text: "Share ideas in suggestions, and upload media in reels when you have clips or highlights.", createdAt: Date.now() - 1000 * 60 * 20 },
        { id: uid(), channel: "world", userId: users[0].id, text: "What kind of community features do you want to see next?", createdAt: Date.now() - 1000 * 60 * 18 },
        { id: uid(), channel: "suggestions", userId: users[0].id, text: "Add more channel controls, profile customization, and a cleaner mobile layout.", createdAt: Date.now() - 1000 * 60 * 14 },
        { id: uid(), channel: "media", userId: users[0].id, text: "Use media to post images, clips, or previews.", createdAt: Date.now() - 1000 * 60 * 12 },
        { id: uid(), channel: "reels", userId: users[1].id, text: "Community reel highlight goes here.", mediaType: "video", mediaSrc: sampleVideo(), createdAt: Date.now() - 1000 * 60 * 8 },
      ];
    }

    if (!state.settings.inviteCode) {
      state.settings.inviteCode = `STX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    }

    saveUsers();
    saveMessages();
  }

  function sampleVideo() {
    return "";
  }

  function ensureSocialForAllUsers() {
    users.forEach(u => ensureSocialUser(u.id));
  }

  function ensureSocialUser(userId) {
    if (!state.social.users[userId]) {
      state.social.users[userId] = { friends: [], sent: [], received: [] };
    }
    return state.social.users[userId];
  }

  function dmThreadId(a, b) {
    return [a, b].sort().join("__");
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveUsers() {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }

  function saveMessages() {
    localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
  }

  function saveSession(userId) {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ userId }));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  }

  function saveSocial() {
    localStorage.setItem(STORAGE_KEYS.social, JSON.stringify(state.social));
  }

  function getUserById(id) {
    return users.find(u => u.id === id) || null;
  }

  function getCurrentUser() {
    return state.currentUser ? getUserById(state.currentUser.id) : null;
  }

  function visibleUsers() {
    return users.filter(u => !u.banned);
  }

  function roleLabel(role) {
    return String(role || "member").replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());
  }

  function escapeHtml(str = "") {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function nl2br(str = "") {
    return String(str).replace(/\n/g, "<br>");
  }

  function initial(name) {
    return String(name || "U").trim().charAt(0).toUpperCase();
  }

  function colorFromName(name) {
    const hash = [...String(name || "U")].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue = hash % 360;
    return `linear-gradient(180deg, hsl(${hue} 72% 56%), hsl(${(hue + 18) % 360} 72% 44%))`;
  }

  function avatarMarkup(user, sizeClass = "avatar-lg") {
    if (!user) return `<div class="avatar ${sizeClass}" style="background:${colorFromName("Guest")}">G</div>`;
    if (user.avatar) return `<div class="avatar ${sizeClass}"><img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}"></div>`;
    return `<div class="avatar ${sizeClass}" style="background:${colorFromName(user.displayName)}">${escapeHtml(initial(user.displayName))}</div>`;
  }

  function showToast(title, message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`;
    els.toastStack.appendChild(node);

    setTimeout(() => {
      node.style.opacity = "0";
      node.style.transform = "translateY(8px) scale(.98)";
      node.style.transition = "all .2s ease";
      setTimeout(() => node.remove(), 220);
    }, 2600);
  }

  function showLoading(duration = 300) {
    els.loadingLayer.classList.add("show");
    clearTimeout(state.loadingTimer);
    state.loadingTimer = setTimeout(() => els.loadingLayer.classList.remove("show"), duration);
  }

  function setSidebar(open) {
    document.body.classList.toggle("sidebar-open", open);
  }

  function setPeople(open) {
    document.body.classList.toggle("people-open", open);
  }

  function openModal(modalEl) {
    modalEl.classList.add("show");
    modalEl.setAttribute("aria-hidden", "false");
  }

  function closeModal(modalEl) {
    modalEl.classList.remove("show");
    modalEl.setAttribute("aria-hidden", "true");
  }

  function shareInvite() {
    const link = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(state.settings.inviteCode)}`;
    if (navigator.share) {
      navigator.share({
        title: "Studio X Community",
        text: `Join Studio X Community using this invite link: ${link}`,
        url: link
      }).catch(() => {
        navigator.clipboard?.writeText(link);
        showToast("Invite copied", "The server invite link was copied to your clipboard.");
      });
    } else {
      navigator.clipboard?.writeText(link);
      showToast("Invite copied", "The server invite link was copied to your clipboard.");
    }
  }

  function renderClock() {
    const d = new Date();
    document.getElementById("clockLabel").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function canPostInChannel(channelId) {
    const user = getCurrentUser();
    if (!user) return false;
    const staffOnly = ["announcements", "rules"];
    const ownerAdminOnly = [];
    if (staffOnly.includes(channelId)) return ["owner", "admin", "moderator"].includes(user.role);
    if (ownerAdminOnly.includes(channelId)) return ["owner", "admin"].includes(user.role);
    return true;
  }

  function canEditServer() {
    const user = getCurrentUser();
    return !!user && ["owner", "admin"].includes(user.role);
  }

  function canCreateChannels() {
    const user = getCurrentUser();
    return !!user && ["owner", "admin"].includes(user.role);
  }

  function canOpenAdminPanel() {
    const user = getCurrentUser();
    return !!user && ["owner", "admin"].includes(user.role);
  }

  function canAssignAdminRole() {
    const user = getCurrentUser();
    return !!user && user.role === "owner";
  }

  function canManageModeration() {
    const user = getCurrentUser();
    return !!user && ["owner", "admin"].includes(user.role);
  }

  function channelMeta(channelId) {
    return state.settings.channels.find(c => c.id === channelId) || state.settings.channels[0];
  }

  function unreadCount(channelId) {
    const readAt = state.settings.readAt?.[channelId] || 0;
    const current = getCurrentUser();
    return messages.filter(m => m.channel === channelId && !m.system && m.createdAt > readAt && m.userId !== current?.id).length;
  }

  function updatePageTitle() {
    document.title = `${state.settings.server.name} (Blue Check: Verified)`;
  }

  function renderServerBrand() {
    const server = state.settings.server;
    els.serverNameLabel.textContent = server.name;
    els.serverDescLabel.textContent = server.description;
    els.serverPreviewName.textContent = server.name;
    els.serverPreviewDesc.textContent = server.description;

    if (server.photo) {
      els.serverAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(server.photo)}" alt="Server photo">`;
      els.serverPreviewAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(server.photo)}" alt="Server photo">`;
      els.serverPreviewAvatar.style.background = "transparent";
    } else {
      els.serverAvatar.textContent = initial(server.name);
      els.serverPreviewAvatar.textContent = initial(server.name);
      els.serverAvatar.style.background = colorFromName(server.name);
      els.serverPreviewAvatar.style.background = colorFromName(server.name);
    }

    updatePageTitle();
  }

  function renderSidebarUser() {
    const user = getCurrentUser();
    if (!user) return;

    els.sidebarAvatar.innerHTML = user.avatar
      ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">`
      : escapeHtml(initial(user.displayName));
    els.sidebarAvatar.style.background = user.avatar ? "transparent" : colorFromName(user.displayName);
    els.sidebarName.textContent = user.displayName;
    els.sidebarRole.textContent = roleLabel(user.role);
    els.sidebarVerified.hidden = !user.verified;
  }

  function renderChannelHeader() {
    const meta = channelMeta(state.activeChannel);
    els.channelTitle.textContent = meta?.name || "channel";
    els.channelSubtitle.textContent = meta?.description || "";
    els.channelSymbol.textContent = meta?.emoji || "#";

    const me = getCurrentUser();
    const canSpeak = canPostInChannel(state.activeChannel);
    els.messageInput.disabled = !canSpeak;
    els.attachBtn.disabled = !canSpeak;
    els.sendBtn.disabled = !canSpeak;

    if (!me) {
      els.messageInput.placeholder = "Log in to send a message";
    } else if (!canSpeak) {
      els.messageInput.placeholder = "Only staff can post in this channel";
    } else if (state.activeChannel === "reels") {
      els.messageInput.placeholder = "Share a reel, video, or clip";
    } else {
      els.messageInput.placeholder = `Message #${meta?.name || "channel"}`;
    }

    document.getElementById("channelModePill").textContent = canSpeak ? "Community online" : "Read only";
  }

  function categoryLabel(category) {
    return ({
      information: "Information",
      community: "Community",
      creative: "Creative",
      staff: "Staff"
    })[category] || "Custom";
  }

  function renderChannels() {
    const term = els.globalSearch.value.trim().toLowerCase();
    const groups = {};

    state.settings.channels.forEach(ch => {
      const hay = `${ch.name} ${ch.description} ${ch.emoji}`.toLowerCase();
      const messageHit = messages.some(m => m.channel === ch.id && `${authorName(m)} ${m.text || ""}`.toLowerCase().includes(term));
      if (term && !hay.includes(term) && !messageHit) return;
      (groups[ch.category] ||= []).push(ch);
    });

    els.channelGroups.innerHTML = Object.entries(groups).map(([category, list]) => `
      <div class="channel-group">
        <div class="group-title">
          <span>${escapeHtml(categoryLabel(category))}</span>
          <svg><use href="#icon-bell"></use></svg>
        </div>
        ${list.map(ch => `
          <button class="channel-item ${ch.id === state.activeChannel ? "active" : ""}" data-channel="${escapeHtml(ch.id)}">
            <span class="channel-left">
              <span class="channel-emoji">${escapeHtml(ch.emoji || "💬")}</span>
              <span># ${escapeHtml(ch.name)}</span>
            </span>
            <span class="unread-badge" data-unread="${escapeHtml(ch.id)}"></span>
          </button>
        `).join("")}
      </div>
    `).join("");

    els.channelGroups.querySelectorAll(".channel-item[data-channel]").forEach(btn => {
      btn.addEventListener("click", () => setActiveChannel(btn.dataset.channel));
    });

    renderUnreadBadges();
  }

  function authorName(message) {
    if (message.system) return "Studio X";
    const user = getUserById(message.userId);
    return user?.displayName || "Unknown";
  }

  function renderUnreadBadges() {
    document.querySelectorAll("[data-unread]").forEach(badge => {
      const channelId = badge.dataset.unread;
      const count = unreadCount(channelId);
      if (count > 0) {
        badge.style.display = "inline-flex";
        badge.textContent = count > 99 ? "99+" : String(count);
      } else {
        badge.style.display = "none";
        badge.textContent = "";
      }
    });
  }

  function renderMessages() {
    const channel = state.activeChannel;
    const term = els.globalSearch.value.trim().toLowerCase();
    const current = getCurrentUser();
    const canSpeak = canPostInChannel(channel);

    els.composerBar.style.opacity = current && canSpeak ? "1" : ".72";
    els.messageList.innerHTML = "";

    const channelMessages = messages.filter(m => m.channel === channel);
    const filtered = term
      ? channelMessages.filter(m => `${authorName(m)} ${m.text || ""}`.toLowerCase().includes(term))
      : channelMessages;

    if (!filtered.length) {
      els.messageList.innerHTML = `
        <div class="message message-system">
          <div class="message-body">
            <span class="system-pill">
              <svg><use href="#icon-search"></use></svg>
              No results
            </span>
            <p class="message-text">Nothing matched your current search in #${escapeHtml(channelMeta(channel)?.name || "channel")}.</p>
          </div>
        </div>
      `;
      return;
    }

    els.messageList.innerHTML = filtered.map(msg => {
      if (msg.system) {
        return `
          <article class="message message-system">
            <div class="message-body">
              <span class="system-pill">
                <svg><use href="#icon-bell"></use></svg>
                System
              </span>
              <p class="message-text">${nl2br(escapeHtml(msg.text || ""))}</p>
            </div>
          </article>
        `;
      }

      const user = getUserById(msg.userId);
      const name = user?.displayName || "Deleted user";
      const verified = user?.verified;
      const role = user?.role || "member";
      const ts = state.settings.prefs.timestamps ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

      let mediaMarkup = "";
      if (msg.mediaSrc && msg.mediaType === "image") {
        mediaMarkup = `<img class="chat-image" src="${escapeHtml(msg.mediaSrc)}" alt="Uploaded image">`;
      } else if (msg.mediaSrc && msg.mediaType === "video") {
        mediaMarkup = `<video class="chat-video" controls playsinline src="${escapeHtml(msg.mediaSrc)}"></video>`;
      }

      return `
        <article class="message ${msg.announcement ? "announcement-card" : ""}">
          <div class="avatar avatar-lg" style="background:${user ? colorFromName(user.displayName) : colorFromName("User")}">
            ${user?.avatar ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(name)}">` : escapeHtml(initial(name))}
          </div>
          <div class="message-body">
            <div class="message-head">
              <span class="message-author">${escapeHtml(name)}</span>
              ${verified ? `<span class="verified-badge" title="Verified"><svg><use href="#icon-badge-check"></use></svg></span>` : ""}
              <span class="role-pill ${escapeHtml(role)}">${escapeHtml(roleLabel(role))}</span>
              ${ts ? `<span class="message-time">${escapeHtml(ts)}</span>` : ""}
            </div>
            ${msg.announcement ? `<div class="announcement-tag"><svg><use href="#icon-megaphone"></use></svg> Announcement</div>` : ""}
            <p class="message-text">${nl2br(escapeHtml(msg.text || ""))}</p>
            ${mediaMarkup}
          </div>
        </article>
      `;
    }).join("");
  }

  function setActiveChannel(channelId) {
    if (!state.settings.channels.find(c => c.id === channelId) || state.activeChannel === channelId) return;
    state.activeChannel = channelId;
    showLoading();

    state.settings.readAt[channelId] = Date.now();
    saveSettings();

    renderChannelHeader();
    renderChannels();

    setTimeout(() => {
      renderMessages();
      renderPeopleList();
      els.messageList.scrollTop = els.messageList.scrollHeight;
    }, 220);

    if (window.innerWidth <= 900) setSidebar(false);
    if (window.innerWidth <= 1280) setPeople(false);
  }

  function renderPeopleList() {
    const me = getCurrentUser();
    const term = els.peopleSearch.value.trim().toLowerCase();

    const people = visibleUsers().filter(u => {
      const text = `${u.displayName} ${u.bio || ""} ${u.role}`.toLowerCase();
      return !term || text.includes(term);
    });

    els.memberCountLabel.textContent = `${people.length} online`;
    els.peopleList.innerHTML = people.map(user => {
      const stateLabel = user.role === "owner" ? "Owner" : user.role === "admin" ? "Admin" : user.role === "moderator" ? "Moderator" : user.role === "content_creator" ? "Content Creator" : "Member";
      return `
        <div class="person-card" data-open-profile="${escapeHtml(user.id)}">
          <div class="avatar avatar-lg" style="background:${colorFromName(user.displayName)}">
            ${user.avatar ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">` : escapeHtml(initial(user.displayName))}
          </div>
          <div class="person-meta">
            <div class="person-name-row">
              <strong>${escapeHtml(user.displayName)}</strong>
              ${user.verified ? `<span class="verified-badge" title="Verified"><svg><use href="#icon-badge-check"></use></svg></span>` : ""}
            </div>
            <p>${escapeHtml(user.bio || "No bio yet.")}</p>
            <div class="person-status">${escapeHtml(stateLabel)}${me && me.id === user.id ? " • You" : ""}</div>
          </div>
        </div>
      `;
    }).join("");

    els.peopleList.querySelectorAll("[data-open-profile]").forEach(card => {
      card.addEventListener("click", () => openProfile(card.dataset.openProfile));
    });
  }

  function friendsState(myId, targetId) {
    const me = ensureSocialUser(myId);
    ensureSocialUser(targetId);
    if (me.friends.includes(targetId)) return "friends";
    if (me.sent.includes(targetId)) return "sent";
    if (me.received.includes(targetId)) return "incoming";
    return "none";
  }

  function openProfile(userId) {
    state.profileTargetId = userId;
    renderProfileModal();
    openModal(els.profileModal);
  }

  function renderProfileModal() {
    const me = getCurrentUser();
    const target = getUserById(state.profileTargetId || me?.id);
    if (!target || !me) return;

    const isSelf = me.id === target.id;
    const fs = friendsState(me.id, target.id);
    const dmId = dmThreadId(me.id, target.id);
    const thread = state.social.dmThreads[dmId] || [];

    els.profileModalKicker.textContent = isSelf ? "Your profile" : "Member profile";
    els.profileModalTitle.textContent = isSelf ? "Edit your profile" : target.displayName;
    els.profilePreviewName.textContent = target.displayName;
    els.profilePreviewRole.textContent = roleLabel(target.role) + (target.verified ? " • Verified" : "");
    els.profilePreviewBio.textContent = target.bio || "No bio yet.";

    els.profileAvatarPreview.innerHTML = target.avatar
      ? `<img class="avatar-img" src="${escapeHtml(target.avatar)}" alt="${escapeHtml(target.displayName)}">`
      : `${escapeHtml(initial(target.displayName))}`;
    els.profileAvatarPreview.style.background = target.avatar ? "transparent" : colorFromName(target.displayName);

    els.profileEditBlock.style.display = isSelf ? "grid" : "none";
    els.profileActionButtons.style.display = isSelf ? "none" : "flex";
    els.saveProfileBtn.style.display = isSelf ? "inline-flex" : "none";

    if (isSelf) {
      els.profileName.value = target.displayName;
      els.profileBio.value = target.bio || "";
      els.profileAvatarUrl.value = target.avatar || "";
    } else {
      if (fs === "friends") {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user-check"></use></svg> Friends`;
      } else if (fs === "sent") {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user"></use></svg> Cancel request`;
      } else if (fs === "incoming") {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user-plus"></use></svg> Accept request`;
      } else {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user-plus"></use></svg> Add friend`;
      }

      els.messageBtn.innerHTML = `<svg><use href="#icon-message"></use></svg> Message`;
      els.friendBtn.onclick = () => handleFriendAction(target.id);
      els.messageBtn.onclick = () => openDM(target.id);
    }
  }

  function handleFriendAction(targetId) {
    const me = getCurrentUser();
    const target = getUserById(targetId);
    if (!me || !target || me.id === target.id) return;

    const meSocial = ensureSocialUser(me.id);
    const targetSocial = ensureSocialUser(target.id);
    const fs = friendsState(me.id, target.id);

    if (fs === "friends") {
      meSocial.friends = meSocial.friends.filter(id => id !== target.id);
      targetSocial.friends = targetSocial.friends.filter(id => id !== me.id);
      showToast("Friend removed", `You are no longer friends with ${target.displayName}.`);
    } else if (fs === "sent") {
      meSocial.sent = meSocial.sent.filter(id => id !== target.id);
      targetSocial.received = targetSocial.received.filter(id => id !== me.id);
      showToast("Request cancelled", `Friend request to ${target.displayName} was cancelled.`);
    } else if (fs === "incoming") {
      meSocial.received = meSocial.received.filter(id => id !== target.id);
      targetSocial.sent = targetSocial.sent.filter(id => id !== me.id);
      if (!meSocial.friends.includes(target.id)) meSocial.friends.push(target.id);
      if (!targetSocial.friends.includes(me.id)) targetSocial.friends.push(me.id);
      showToast("Friend request accepted", `You are now friends with ${target.displayName}.`);
    } else {
      if (!meSocial.sent.includes(target.id)) meSocial.sent.push(target.id);
      if (!targetSocial.received.includes(me.id)) targetSocial.received.push(me.id);
      showToast("Request sent", `Friend request sent to ${target.displayName}.`);
    }

    saveSocial();
    renderPeopleList();
    renderProfileModal();
  }

  function openDM(peerId) {
    const me = getCurrentUser();
    const peer = getUserById(peerId);
    if (!me || !peer) return;
    state.dmPeerId = peerId;
    renderDMModal();
    openModal(els.dmModal);
  }

  function renderDMModal() {
    const me = getCurrentUser();
    const peer = getUserById(state.dmPeerId);
    if (!me || !peer) return;

    const threadId = dmThreadId(me.id, peer.id);
    const thread = state.social.dmThreads[threadId] || [];

    els.dmAvatar.innerHTML = peer.avatar
      ? `<img class="avatar-img" src="${escapeHtml(peer.avatar)}" alt="${escapeHtml(peer.displayName)}">`
      : `${escapeHtml(initial(peer.displayName))}`;
    els.dmAvatar.style.background = peer.avatar ? "transparent" : colorFromName(peer.displayName);
    els.dmName.textContent = peer.displayName;
    els.dmInfo.textContent = `${roleLabel(peer.role)}${peer.verified ? " • Verified" : ""}`;

    els.dmThread.innerHTML = thread.length ? thread.map(m => `
      <div class="dm-message ${m.from === me.id ? "mine" : ""}">
        <p>${nl2br(escapeHtml(m.text))}</p>
        <small>${new Date(m.createdAt).toLocaleString()}</small>
      </div>
    `).join("") : `
      <div class="message message-system">
        <div class="message-body">
          <span class="system-pill"><svg><use href="#icon-message"></use></svg> Private chat</span>
          <p class="message-text">Say hello to ${escapeHtml(peer.displayName)}.</p>
        </div>
      </div>
    `;
  }

  function sendDM() {
    const me = getCurrentUser();
    const peer = getUserById(state.dmPeerId);
    const text = els.dmInput.value.trim();
    if (!me || !peer || !text) return;

    const threadId = dmThreadId(me.id, peer.id);
    const thread = state.social.dmThreads[threadId] || [];
    thread.push({ id: uid(), from: me.id, to: peer.id, text, createdAt: Date.now() });
    state.social.dmThreads[threadId] = thread;
    saveSocial();

    els.dmInput.value = "";
    renderDMModal();
    showToast("Message sent", `Private message sent to ${peer.displayName}.`);
  }

  function renderProfileViewForSelf() {
    // no-op, handled in renderProfileModal
  }

  function saveProfile() {
    const me = getCurrentUser();
    if (!me) return;

    const name = els.profileName.value.trim();
    const bio = els.profileBio.value.trim();
    const avatar = els.profileAvatarUrl.value.trim();

    if (!name) {
      showToast("Missing name", "Username cannot be empty.");
      return;
    }

    if (users.some(u => u.id !== me.id && u.displayName.toLowerCase() === name.toLowerCase())) {
      showToast("Name taken", "Another member already uses that username.");
      return;
    }

    me.displayName = name;
    me.bio = bio;
    me.avatar = avatar;
    saveUsers();
    state.currentUser = me;
    renderAll();
    openProfile(me.id);
    showToast("Profile saved", "Your profile changes were updated.");
  }

  function handleSignup() {
    const email = els.signupEmail.value.trim().toLowerCase();
    const name = els.signupName.value.trim();
    const password = els.signupPassword.value;
    const confirm = els.signupConfirm.value;

    if (!email || !name || !password || !confirm) {
      showToast("Missing fields", "Please fill in all sign up fields.");
      return;
    }

    if (password.length < 6) {
      showToast("Weak password", "Use at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      showToast("Password mismatch", "The passwords do not match.");
      return;
    }

    if (users.some(u => u.email?.toLowerCase() === email)) {
      showToast("Email used", "That email is already registered.");
      return;
    }

    if (users.some(u => u.displayName?.toLowerCase() === name.toLowerCase())) {
      showToast("Name used", "That username is already registered.");
      return;
    }

    const user = {
      id: uid(),
      email,
      password,
      displayName: name,
      bio: "",
      role: "member",
      verified: false,
      banned: false,
      warnings: 0,
      avatar: "",
      createdAt: Date.now()
    };

    users.push(user);
    ensureSocialUser(user.id);
    saveUsers();
    saveSocial();
    loginUser(user);
    showToast("Account created", "Your Studio X account is ready.");
  }

  function handleLogin() {
    const identity = els.loginIdentity.value.trim().toLowerCase();
    const password = els.loginPassword.value;

    if (!identity || !password) {
      showToast("Missing fields", "Enter your email/username and password.");
      return;
    }

    const user = users.find(u => !u.banned && u.password === password && (u.email?.toLowerCase() === identity || u.displayName?.toLowerCase() === identity));
    if (!user) {
      showToast("Login failed", "Account not found or password is incorrect.");
      return;
    }

    loginUser(user);
    showToast("Welcome back", `Logged in as ${user.displayName}.`);
  }

  function loginUser(user) {
    state.currentUser = user;
    saveSession(user.id);
    document.body.classList.add("logged-in");
    document.body.classList.remove("logged-out");
    state.settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
    renderAll();
  }

  function logout() {
    clearSession();
    state.currentUser = null;
    document.body.classList.remove("logged-in");
    document.body.classList.remove("sidebar-open");
    document.body.classList.remove("people-open");
    closeModal(els.profileModal);
    closeModal(els.settingsModal);
    closeModal(els.adminModal);
    closeModal(els.dmModal);
    openAuth("login");
    showToast("Logged out", "You have been signed out.");
  }

  function openAuth(mode = "login") {
    state.authMode = mode;
    els.authModeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.authMode === mode));
    els.signupFields.hidden = mode !== "signup";
    els.loginFields.forEach(field => field.hidden = mode !== "login");
    els.authSubmit.innerHTML = mode === "login"
      ? `<svg><use href="#icon-user"></use></svg> Log in`
      : `<svg><use href="#icon-user"></use></svg> Create account`;
  }

  function renderSettingsModal() {
    const me = getCurrentUser();
    if (!me) return;
    els.settingsAccountInfo.textContent = `${me.displayName} • ${me.email} • ${roleLabel(me.role)}${me.verified ? " • Verified" : ""}`;
    els.compactToggle.checked = !!state.settings.prefs.compact;
    els.soundToggle.checked = !!state.settings.prefs.sound;
    els.timestampToggle.checked = !!state.settings.prefs.timestamps;
  }

  function openSettings() {
    if (!getCurrentUser()) return;
    renderSettingsModal();
    openModal(els.settingsModal);
  }

  function renderAdminMembers() {
    const current = getCurrentUser();
    if (!current) return;

    const sortedUsers = [...users].sort((a, b) => {
      const order = { owner: 0, admin: 1, moderator: 2, content_creator: 3, member: 4 };
      return order[a.role] - order[b.role] || a.displayName.localeCompare(b.displayName);
    });

    els.adminMembersList.innerHTML = sortedUsers.map(user => {
      const allowRoleChange = current.role === "owner" || (current.role === "admin" && user.role !== "owner" && user.role !== "admin");
      const canModerateUser = canManageModeration() && user.role !== "owner" && user.id !== current.id;
      const roleOptions = `
        <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
        <option value="content_creator" ${user.role === "content_creator" ? "selected" : ""}>Content Creator</option>
        <option value="moderator" ${user.role === "moderator" ? "selected" : ""}>Moderator</option>
        <option value="admin" ${user.role === "admin" ? "selected" : ""} ${current.role === "owner" ? "" : "disabled"}>Admin</option>
      `;

      return `
        <div class="member-row">
          <div class="member-top">
            <div class="member-info">
              <div class="avatar avatar-lg" style="background:${colorFromName(user.displayName)}">
                ${user.avatar ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">` : escapeHtml(initial(user.displayName))}
              </div>
              <div class="member-meta">
                <div class="member-name-line">
                  <strong>${escapeHtml(user.displayName)}</strong>
                  <span class="role-pill ${escapeHtml(user.role)}">${escapeHtml(roleLabel(user.role))}</span>
                  ${user.verified ? `<span class="verified-badge" title="Verified"><svg><use href="#icon-badge-check"></use></svg></span>` : ""}
                </div>
                <p>${escapeHtml(user.email)}${user.bio ? ` • ${escapeHtml(user.bio)}` : ""}</p>
              </div>
            </div>
            <div class="member-badges">
              <span class="warning-pill">Warnings: ${user.warnings || 0}</span>
              ${user.banned ? `<span class="ban-pill">Banned</span>` : ""}
            </div>
          </div>

          <div class="member-actions">
            <select class="role-select" data-role-for="${escapeHtml(user.id)}" ${allowRoleChange ? "" : "disabled"}>
              ${roleOptions}
            </select>
            <button class="mini-btn warning" data-warn-user="${escapeHtml(user.id)}" ${canModerateUser ? "" : "disabled"}>
              <svg><use href="#icon-warning"></use></svg> Warn
            </button>
            <button class="mini-btn danger" data-ban-user="${escapeHtml(user.id)}" ${canModerateUser ? "" : "disabled"}>
              <svg><use href="${user.banned ? "#icon-user" : "#icon-ban"}"></use></svg>
              ${user.banned ? "Unban" : "Ban"}
            </button>
          </div>
        </div>
      `;
    }).join("");

    els.adminMembersList.querySelectorAll("[data-role-for]").forEach(select => {
      select.addEventListener("change", () => {
        const user = getUserById(select.dataset.roleFor);
        const me = getCurrentUser();
        if (!user || !me) return;
        if (user.id === me.id) return;

        if (user.role === "owner" && me.role !== "owner") {
          select.value = user.role;
          showToast("Not allowed", "Only the owner can manage the owner role.");
          return;
        }

        if (select.value === "admin" && !canAssignAdminRole()) {
          select.value = user.role;
          showToast("Not allowed", "Only the owner can assign the Admin role.");
          return;
        }

        user.role = select.value;
        if (["admin", "owner"].includes(user.role)) user.verified = true;
        saveUsers();
        renderAll();
        addSystemMessage("announcements", `${me.displayName} changed ${user.displayName}'s role to ${roleLabel(user.role)}.`);
        showToast("Role updated", `${user.displayName} is now ${roleLabel(user.role)}.`);
      });
    });

    els.adminMembersList.querySelectorAll("[data-warn-user]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = getUserById(btn.dataset.warnUser);
        const me = getCurrentUser();
        if (!user || !me || user.id === me.id || user.role === "owner") return;

        user.warnings = (user.warnings || 0) + 1;
        if (user.warnings >= 3) user.banned = true;
        saveUsers();
        addSystemMessage("announcements", `${me.displayName} warned ${user.displayName}. Warning count: ${user.warnings}.`);
        if (user.banned) addSystemMessage("announcements", `${user.displayName} was automatically banned after 3 warnings.`);
        renderAll();
        showToast("Moderation update", `${user.displayName} now has ${user.warnings} warning(s).`);
        if (state.currentUser && state.currentUser.id === user.id && user.banned) logout();
      });
    });

    els.adminMembersList.querySelectorAll("[data-ban-user]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = getUserById(btn.dataset.banUser);
        const me = getCurrentUser();
        if (!user || !me || user.id === me.id || user.role === "owner") return;

        user.banned = !user.banned;
        saveUsers();
        addSystemMessage("announcements", `${me.displayName} ${user.banned ? "banned" : "unbanned"} ${user.displayName}.`);
        renderAll();
        showToast(user.banned ? "User banned" : "User unbanned", `${user.displayName} is now ${user.banned ? "banned" : "active"}.`);
        if (state.currentUser && state.currentUser.id === user.id && user.banned) logout();
      });
    });
  }

  function openAdmin() {
    if (!canOpenAdminPanel()) {
      showToast("Access denied", "Only the owner and admin can open the admin panel.");
      return;
    }
    renderAdminMembers();
    renderServerSettingsFields();
    openModal(els.adminModal);
  }

  function renderServerSettingsFields() {
    const server = state.settings.server;
    const editable = canEditServer();

    els.serverNameInput.value = server.name || "";
    els.serverDescInput.value = server.description || "";
    els.serverPhotoUrlInput.value = server.photo || "";

    if (server.photo) {
      els.serverPreviewAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(server.photo)}" alt="Server photo preview">`;
      els.serverPreviewAvatar.style.background = "transparent";
    } else {
      els.serverPreviewAvatar.textContent = initial(server.name);
      els.serverPreviewAvatar.style.background = colorFromName(server.name);
    }

    els.serverNameInput.disabled = !editable;
    els.serverDescInput.disabled = !editable;
    els.serverPhotoUrlInput.disabled = !editable;
    els.uploadServerPhotoBtn.disabled = !editable;
    els.resetServerPhotoBtn.disabled = !editable;
    els.saveServerSettingsBtn.disabled = !editable;

    const channelAllowed = canCreateChannels();
    els.newChannelName.disabled = !channelAllowed;
    els.newChannelDesc.disabled = !channelAllowed;
    els.newChannelEmoji.disabled = !channelAllowed;
    els.newChannelCategory.disabled = !channelAllowed;
    els.addChannelBtn.disabled = !channelAllowed;
  }

  function saveServerSettings() {
    if (!canEditServer()) {
      showToast("Access denied", "Only the owner and admin can edit the server profile.");
      return;
    }

    const name = els.serverNameInput.value.trim();
    const description = els.serverDescInput.value.trim();
    const photo = els.serverPhotoUrlInput.value.trim();

    if (!name) {
      showToast("Missing server name", "Server name cannot be empty.");
      return;
    }

    state.settings.server.name = name;
    state.settings.server.description = description || state.settings.server.description;
    state.settings.server.photo = photo || "";
    saveSettings();

    renderServerBrand();
    renderChannelHeader();
    renderAll();
    addSystemMessage("announcements", `${getCurrentUser().displayName} updated the server profile.`);
    showToast("Server updated", "Server name, description, and photo were saved.");
  }

  function addChannel() {
    if (!canCreateChannels()) {
      showToast("Access denied", "Only the owner and admin can add channels.");
      return;
    }

    const name = els.newChannelName.value.trim().toLowerCase();
    const desc = els.newChannelDesc.value.trim();
    const emoji = (els.newChannelEmoji.value.trim() || "💬").slice(0, 4);
    const category = els.newChannelCategory.value;

    if (!name) {
      showToast("Missing channel name", "Please enter a channel name.");
      return;
    }

    const id = slugify(name);
    if (state.settings.channels.some(c => c.id === id)) {
      showToast("Channel exists", "A channel with that name already exists.");
      return;
    }

    state.settings.channels.push({
      id,
      name,
      description: desc || "New community channel.",
      emoji,
      category
    });

    saveSettings();
    els.newChannelName.value = "";
    els.newChannelDesc.value = "";
    els.newChannelEmoji.value = "";
    renderChannels();
    renderChannelHeader();
    addSystemMessage("announcements", `${getCurrentUser().displayName} created #${name}.`);
    showToast("Channel created", `#${name} has been added to the server.`);
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function handleAttachment(file) {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      showToast("Invalid file", "Please choose an image or video file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      state.pendingMedia = String(reader.result || "");
      state.pendingMediaType = file.type.startsWith("video/") ? "video" : "image";
      state.pendingMediaName = file.name;
      els.attachmentName.textContent = file.name;
      els.attachmentPreview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function clearAttachment() {
    state.pendingMedia = null;
    state.pendingMediaType = "";
    state.pendingMediaName = "";
    els.messageMediaInput.value = "";
    els.attachmentPreview.hidden = true;
    els.attachmentName.textContent = "";
  }

  function sendMessage() {
    const me = getCurrentUser();
    if (!me) return;

    if (!canPostInChannel(state.activeChannel)) {
      showToast("Read only", "You cannot post in this channel.");
      return;
    }

    const text = els.messageInput.value.trim();
    if (!text && !state.pendingMedia) return;

    messages.push({
      id: uid(),
      channel: state.activeChannel,
      userId: me.id,
      text,
      mediaType: state.pendingMediaType || "",
      mediaSrc: state.pendingMedia || "",
      createdAt: Date.now(),
      announcement: false
    });

    els.messageInput.value = "";
    clearAttachment();
    state.settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
    saveMessages();
    renderMessages();
    renderUnreadBadges();
    els.messageList.scrollTop = els.messageList.scrollHeight;
  }

  function addSystemMessage(channel, text) {
    messages.push({
      id: uid(),
      channel,
      userId: "system",
      text,
      createdAt: Date.now(),
      system: true
    });
    saveMessages();
    renderMessages();
    renderUnreadBadges();
  }

  function openPeoplePanel() {
    setPeople(true);
  }

  function renderAll() {
    const user = getCurrentUser();
    if (user) state.currentUser = user;

    if (!state.currentUser || state.currentUser.banned) {
      document.body.classList.remove("logged-in");
      if (state.currentUser?.banned) {
        showToast("Account blocked", "This account is banned.");
        logout();
      }
      return;
    }

    document.body.classList.add("logged-in");
    if (state.settings.prefs.compact) document.body.classList.add("compact-mode");
    else document.body.classList.remove("compact-mode");

    renderClock();
    renderServerBrand();
    renderSidebarUser();
    renderChannelHeader();
    renderChannels();
    renderMessages();
    renderPeopleList();
    renderAdminAccess();
    renderUnreadBadges();
    state.settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
  }

  function renderUnreadBadges() {
    document.querySelectorAll("[data-unread]").forEach(badge => {
      const channelId = badge.dataset.unread;
      const count = unreadCount(channelId);
      if (count > 0) {
        badge.style.display = "inline-flex";
        badge.textContent = count > 99 ? "99+" : String(count);
      } else {
        badge.style.display = "none";
        badge.textContent = "";
      }
    });
  }

  function renderAdminAccess() {
    const show = canOpenAdminPanel();
    document.querySelectorAll(".hidden-owneradmin").forEach(el => {
      el.hidden = !show;
    });
  }

  function openProfileSelf() {
    state.profileTargetId = getCurrentUser()?.id || null;
    renderProfileModal();
    openModal(els.profileModal);
  }

  function openSettingsModal() {
    renderSettingsModal();
    openModal(els.settingsModal);
  }

  function savePreferences() {
    state.settings.prefs.compact = !!els.compactToggle.checked;
    state.settings.prefs.sound = !!els.soundToggle.checked;
    state.settings.prefs.timestamps = !!els.timestampToggle.checked;
    saveSettings();
    renderAll();
    showToast("Settings saved", "Your preferences were updated.");
  }

  function openAuthForSwitch(mode) {
    logout();
    openAuth(mode);
  }

  function bindEvents() {
    els.authModeButtons.forEach(btn => {
      btn.addEventListener("click", () => openAuth(btn.dataset.authMode));
    });

    els.authForm.addEventListener("submit", e => {
      e.preventDefault();
      state.authMode === "login" ? handleLogin() : handleSignup();
    });

    els.openSidebarBtn.addEventListener("click", () => setSidebar(true));
    els.closeSidebarBtn.addEventListener("click", () => setSidebar(false));
    els.mobileBackdrop.addEventListener("click", () => {
      setSidebar(false);
      setPeople(false);
    });

    els.peopleBtn.addEventListener("click", openPeoplePanel);
    els.closePeopleBtn.addEventListener("click", () => setPeople(false));
    els.peopleSearch.addEventListener("input", renderPeopleList);

    els.shareServerBtn.addEventListener("click", shareInvite);
    els.shareServerTopBtn.addEventListener("click", shareInvite);
    els.shareServerRailBtn.addEventListener("click", shareInvite);

    els.openSettingsBtn.addEventListener("click", openSettingsModal);
    els.openSettingsRailBtn.addEventListener("click", openSettingsModal);
    els.settingsBtn.addEventListener("click", openSettingsModal);

    els.openProfileBtn.addEventListener("click", openProfileSelf);

    els.openAdminBtn.addEventListener("click", openAdmin);
    els.adminTopBtn.addEventListener("click", openAdmin);
    els.openAdminRailBtn.addEventListener("click", openAdmin);
    els.customizeServerBtn.addEventListener("click", openAdmin);

    els.logoutBtn.addEventListener("click", logout);

    els.globalSearch.addEventListener("input", () => {
      renderChannels();
      renderMessages();
      renderPeopleList();
    });

    els.sendBtn.addEventListener("click", sendMessage);
    els.messageInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
      if (e.key === "Escape") els.messageInput.blur();
    });

    els.attachBtn.addEventListener("click", () => {
      if (!canPostInChannel(state.activeChannel)) return;
      els.messageMediaInput.click();
    });

    els.messageMediaInput.addEventListener("change", () => {
      const file = els.messageMediaInput.files?.[0];
      handleAttachment(file);
    });

    els.removeAttachmentBtn.addEventListener("click", clearAttachment);

    els.profileAvatarFile.addEventListener("change", () => {
      const file = els.profileAvatarFile.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Invalid file", "Please choose an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        els.profileAvatarUrl.value = String(reader.result || "");
        els.profileAvatarPreview.innerHTML = `<img class="avatar-img" src="${escapeHtml(String(reader.result || ""))}" alt="Avatar preview">`;
        els.profileAvatarPreview.style.background = "transparent";
      };
      reader.readAsDataURL(file);
    });

    els.uploadAvatarBtn.addEventListener("click", () => els.profileAvatarFile.click());
    els.resetAvatarBtn.addEventListener("click", () => {
      els.profileAvatarUrl.value = "";
      const me = getCurrentUser();
      els.profileAvatarPreview.innerHTML = me?.displayName ? escapeHtml(initial(me.displayName)) : "U";
      els.profileAvatarPreview.style.background = colorFromName(me?.displayName || "U");
    });

    els.saveProfileBtn.addEventListener("click", saveProfile);

    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.closeModal;
        if (target === "profile") closeModal(els.profileModal);
        if (target === "settings") closeModal(els.settingsModal);
        if (target === "admin") closeModal(els.adminModal);
        if (target === "dm") closeModal(els.dmModal);
      });
    });

    els.profileModal.addEventListener("click", e => {
      if (e.target === els.profileModal) closeModal(els.profileModal);
    });

    els.settingsModal.addEventListener("click", e => {
      if (e.target === els.settingsModal) closeModal(els.settingsModal);
    });

    els.adminModal.addEventListener("click", e => {
      if (e.target === els.adminModal) closeModal(els.adminModal);
    });

    els.dmModal.addEventListener("click", e => {
      if (e.target === els.dmModal) closeModal(els.dmModal);
    });

    els.friendBtn.addEventListener("click", () => {
      if (state.profileTargetId) handleFriendAction(state.profileTargetId);
    });

    els.messageBtn.addEventListener("click", () => {
      if (state.profileTargetId) {
        closeModal(els.profileModal);
        openDM(state.profileTargetId);
      }
    });

    els.dmSendBtn.addEventListener("click", sendDM);
    els.dmInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendDM();
    });

    els.switchAccountBtn.addEventListener("click", () => openAuthForSwitch("login"));
    els.addAccountBtn.addEventListener("click", () => openAuthForSwitch("signup"));
    els.logoutFromSettingsBtn.addEventListener("click", logout);

    els.compactToggle.addEventListener("change", savePreferences);
    els.soundToggle.addEventListener("change", savePreferences);
    els.timestampToggle.addEventListener("change", savePreferences);

    els.uploadServerPhotoBtn.addEventListener("click", () => {
      if (!canEditServer()) return showToast("Access denied", "Only the owner and admin can upload a server photo.");
      document.getElementById("serverPhotoFile").click();
    });

    document.getElementById("serverPhotoFile").addEventListener("change", () => {
      const file = document.getElementById("serverPhotoFile").files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Invalid file", "Please choose an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        els.serverPhotoUrlInput.value = String(reader.result || "");
        els.serverPreviewAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(String(reader.result || ""))}" alt="Server preview">`;
        els.serverPreviewAvatar.style.background = "transparent";
      };
      reader.readAsDataURL(file);
    });

    els.resetServerPhotoBtn.addEventListener("click", () => {
      if (!canEditServer()) return showToast("Access denied", "Only the owner and admin can edit the server photo.");
      els.serverPhotoUrlInput.value = "";
      els.serverPreviewAvatar.textContent = initial(state.settings.server.name);
      els.serverPreviewAvatar.style.background = colorFromName(state.settings.server.name);
    });

    els.saveServerSettingsBtn.addEventListener("click", saveServerSettings);
    els.addChannelBtn.addEventListener("click", addChannel);
    els.sendAnnouncementBtn.addEventListener("click", sendAnnouncement);
    els.copyInviteBtn.addEventListener("click", shareInvite);

    els.serverNameInput.addEventListener("input", () => {
      els.serverPreviewName.textContent = els.serverNameInput.value.trim() || "Studio X Community";
    });

    els.serverDescInput.addEventListener("input", () => {
      els.serverPreviewDesc.textContent = els.serverDescInput.value.trim() || "A verified community space.";
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        setSidebar(false);
        setPeople(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) document.body.classList.remove("sidebar-open");
      if (window.innerWidth > 1280) document.body.classList.remove("people-open");
    });
  }

  function sendAnnouncement() {
    const me = getCurrentUser();
    if (!me || !canManageModeration()) {
      showToast("Access denied", "Only staff can send announcements.");
      return;
    }
    const text = els.announcementText.value.trim();
    if (!text) {
      showToast("Missing text", "Type an announcement first.");
      return;
    }

    messages.push({
      id: uid(),
      channel: "announcements",
      userId: me.id,
      text,
      createdAt: Date.now(),
      announcement: true
    });

    saveMessages();
    els.announcementText.value = "";
    state.settings.readAt.announcements = Date.now();
    saveSettings();
    renderAll();
    addSystemMessage("announcements", `${me.displayName} posted an announcement.`);
    showToast("Announcement sent", "The announcement was posted to #announcements.");
    closeModal(els.adminModal);
  }

  function renderPeopleListFromState() {
    renderPeopleList();
  }

  function renderProfileModalData() {
    renderProfileModal();
  }

  function init() {
    bindEvents();
    openAuth("login");
    renderAll();
    setInterval(renderClock, 1000);
    setInterval(() => {
      if (state.currentUser) {
        renderUnreadBadges();
        renderPeopleList();
      }
    }, 5000);
  }

  function renderPeopleList() {
    const me = getCurrentUser();
    const term = els.peopleSearch.value.trim().toLowerCase();
    const people = visibleUsers().filter(u => {
      const text = `${u.displayName} ${u.bio || ""} ${u.role}`.toLowerCase();
      return !term || text.includes(term);
    });

    els.memberCountLabel.textContent = `${visibleUsers().length} online`;
    els.peopleList.innerHTML = people.map(user => {
      const label = user.role === "owner" ? "Owner" : user.role === "admin" ? "Admin" : user.role === "moderator" ? "Moderator" : user.role === "content_creator" ? "Content Creator" : "Member";
      return `
        <div class="person-card" data-open-profile="${escapeHtml(user.id)}">
          <div class="avatar avatar-lg" style="background:${colorFromName(user.displayName)}">
            ${user.avatar ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">` : escapeHtml(initial(user.displayName))}
          </div>
          <div class="person-meta">
            <div class="person-name-row">
              <strong>${escapeHtml(user.displayName)}</strong>
              ${user.verified ? `<span class="verified-badge" title="Verified"><svg><use href="#icon-badge-check"></use></svg></span>` : ""}
            </div>
            <p>${escapeHtml(user.bio || "No bio yet.")}</p>
            <div class="person-status">${escapeHtml(label)}${me && me.id === user.id ? " • You" : ""}</div>
          </div>
        </div>
      `;
    }).join("");

    els.peopleList.querySelectorAll("[data-open-profile]").forEach(card => {
      card.addEventListener("click", () => openProfile(card.dataset.openProfile));
    });
  }

  function handleFriendAction(targetId) {
    const me = getCurrentUser();
    const target = getUserById(targetId);
    if (!me || !target || me.id === target.id) return;

    const meSocial = ensureSocialUser(me.id);
    const targetSocial = ensureSocialUser(target.id);
    const fs = friendsState(me.id, target.id);

    if (fs === "friends") {
      meSocial.friends = meSocial.friends.filter(id => id !== target.id);
      targetSocial.friends = targetSocial.friends.filter(id => id !== me.id);
      showToast("Friend removed", `You are no longer friends with ${target.displayName}.`);
    } else if (fs === "sent") {
      meSocial.sent = meSocial.sent.filter(id => id !== target.id);
      targetSocial.received = targetSocial.received.filter(id => id !== me.id);
      showToast("Request cancelled", `Friend request to ${target.displayName} was cancelled.`);
    } else if (fs === "incoming") {
      meSocial.received = meSocial.received.filter(id => id !== target.id);
      targetSocial.sent = targetSocial.sent.filter(id => id !== me.id);
      if (!meSocial.friends.includes(target.id)) meSocial.friends.push(target.id);
      if (!targetSocial.friends.includes(me.id)) targetSocial.friends.push(me.id);
      showToast("Friend request accepted", `You are now friends with ${target.displayName}.`);
    } else {
      meSocial.sent.push(target.id);
      targetSocial.received.push(me.id);
      showToast("Request sent", `Friend request sent to ${target.displayName}.`);
    }

    saveSocial();
    renderProfileModal();
    renderPeopleList();
  }

  function friendsState(myId, targetId) {
    const me = ensureSocialUser(myId);
    ensureSocialUser(targetId);
    if (me.friends.includes(targetId)) return "friends";
    if (me.sent.includes(targetId)) return "sent";
    if (me.received.includes(targetId)) return "incoming";
    return "none";
  }

  function ensureSocialUser(userId) {
    if (!state.social.users[userId]) {
      state.social.users[userId] = { friends: [], sent: [], received: [] };
    }
    return state.social.users[userId];
  }

  function renderProfileModal() {
    const me = getCurrentUser();
    const target = getUserById(state.profileTargetId || me?.id);
    if (!me || !target) return;

    const isSelf = me.id === target.id;
    const fs = friendsState(me.id, target.id);

    els.profileModalKicker.textContent = isSelf ? "Your profile" : "Member profile";
    els.profileModalTitle.textContent = isSelf ? "Edit your profile" : target.displayName;
    els.profilePreviewName.textContent = target.displayName;
    els.profilePreviewRole.textContent = `${roleLabel(target.role)}${target.verified ? " • Verified" : ""}`;
    els.profilePreviewBio.textContent = target.bio || "No bio yet.";

    els.profileAvatarPreview.innerHTML = target.avatar
      ? `<img class="avatar-img" src="${escapeHtml(target.avatar)}" alt="${escapeHtml(target.displayName)}">`
      : `${escapeHtml(initial(target.displayName))}`;
    els.profileAvatarPreview.style.background = target.avatar ? "transparent" : colorFromName(target.displayName);

    els.profileEditBlock.style.display = isSelf ? "grid" : "none";
    els.profileActionButtons.style.display = isSelf ? "none" : "flex";
    els.saveProfileBtn.style.display = isSelf ? "inline-flex" : "none";

    if (isSelf) {
      els.profileName.value = target.displayName;
      els.profileBio.value = target.bio || "";
      els.profileAvatarUrl.value = target.avatar || "";
    } else {
      if (fs === "friends") {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user-check"></use></svg> Friends`;
      } else if (fs === "sent") {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user"></use></svg> Cancel request`;
      } else if (fs === "incoming") {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user-plus"></use></svg> Accept request`;
      } else {
        els.friendBtn.innerHTML = `<svg><use href="#icon-user-plus"></use></svg> Add friend`;
      }
      els.messageBtn.innerHTML = `<svg><use href="#icon-message"></use></svg> Message`;
    }
  }

  function openProfile(id) {
    state.profileTargetId = id;
    renderProfileModal();
    openModal(els.profileModal);
  }

  function openDM(peerId) {
    const me = getCurrentUser();
    const peer = getUserById(peerId);
    if (!me || !peer) return;
    state.dmPeerId = peerId;
    renderDMModal();
    openModal(els.dmModal);
  }

  function renderDMModal() {
    const me = getCurrentUser();
    const peer = getUserById(state.dmPeerId);
    if (!me || !peer) return;

    const threadId = dmThreadId(me.id, peer.id);
    const thread = state.social.dmThreads[threadId] || [];

    els.dmAvatar.innerHTML = peer.avatar
      ? `<img class="avatar-img" src="${escapeHtml(peer.avatar)}" alt="${escapeHtml(peer.displayName)}">`
      : `${escapeHtml(initial(peer.displayName))}`;
    els.dmAvatar.style.background = peer.avatar ? "transparent" : colorFromName(peer.displayName);
    els.dmName.textContent = peer.displayName;
    els.dmInfo.textContent = `${roleLabel(peer.role)}${peer.verified ? " • Verified" : ""}`;

    els.dmThread.innerHTML = thread.length ? thread.map(m => `
      <div class="dm-message ${m.from === me.id ? "mine" : ""}">
        <p>${nl2br(escapeHtml(m.text))}</p>
        <small>${new Date(m.createdAt).toLocaleString()}</small>
      </div>
    `).join("") : `
      <div class="message message-system">
        <div class="message-body">
          <span class="system-pill"><svg><use href="#icon-message"></use></svg> Private chat</span>
          <p class="message-text">Say hello to ${escapeHtml(peer.displayName)}.</p>
        </div>
      </div>
    `;
  }

  function sendDM() {
    const me = getCurrentUser();
    const peer = getUserById(state.dmPeerId);
    const text = els.dmInput.value.trim();
    if (!me || !peer || !text) return;

    const threadId = dmThreadId(me.id, peer.id);
    const thread = state.social.dmThreads[threadId] || [];
    thread.push({ id: uid(), from: me.id, to: peer.id, text, createdAt: Date.now() });
    state.social.dmThreads[threadId] = thread;
    saveSocial();

    els.dmInput.value = "";
    renderDMModal();
    showToast("Message sent", `Private message sent to ${peer.displayName}.`);
  }

  function saveProfile() {
    const me = getCurrentUser();
    if (!me) return;

    const name = els.profileName.value.trim();
    const bio = els.profileBio.value.trim();
    const avatar = els.profileAvatarUrl.value.trim();

    if (!name) {
      showToast("Missing name", "Username cannot be empty.");
      return;
    }

    if (users.some(u => u.id !== me.id && u.displayName.toLowerCase() === name.toLowerCase())) {
      showToast("Name taken", "Another member already uses that username.");
      return;
    }

    me.displayName = name;
    me.bio = bio;
    me.avatar = avatar;
    saveUsers();
    state.currentUser = me;
    renderAll();
    showToast("Profile saved", "Your profile changes were updated.");
    closeModal(els.profileModal);
  }

  function openAuth(mode = "login") {
    state.authMode = mode;
    els.authModeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.authMode === mode));
    els.signupFields.hidden = mode !== "signup";
    els.loginFields.forEach(field => field.hidden = mode !== "login");
    els.authSubmit.innerHTML = mode === "login"
      ? `<svg><use href="#icon-user"></use></svg> Log in`
      : `<svg><use href="#icon-user"></use></svg> Create account`;
  }

  function handleSignup() {
    const email = els.signupEmail.value.trim().toLowerCase();
    const name = els.signupName.value.trim();
    const password = els.signupPassword.value;
    const confirm = els.signupConfirm.value;

    if (!email || !name || !password || !confirm) {
      showToast("Missing fields", "Please fill in all sign up fields.");
      return;
    }

    if (password.length < 6) {
      showToast("Weak password", "Use at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      showToast("Password mismatch", "The passwords do not match.");
      return;
    }

    if (users.some(u => u.email?.toLowerCase() === email)) {
      showToast("Email used", "That email is already registered.");
      return;
    }

    if (users.some(u => u.displayName?.toLowerCase() === name.toLowerCase())) {
      showToast("Name used", "That username is already registered.");
      return;
    }

    const user = {
      id: uid(),
      email,
      password,
      displayName: name,
      bio: "",
      role: "member",
      verified: false,
      banned: false,
      warnings: 0,
      avatar: "",
      createdAt: Date.now()
    };

    users.push(user);
    ensureSocialUser(user.id);
    saveUsers();
    saveSocial();
    loginUser(user);
    showToast("Account created", "Your Studio X account is ready.");
  }

  function handleLogin() {
    const identity = els.loginIdentity.value.trim().toLowerCase();
    const password = els.loginPassword.value;

    if (!identity || !password) {
      showToast("Missing fields", "Enter your email/username and password.");
      return;
    }

    const user = users.find(u => !u.banned && u.password === password && (u.email?.toLowerCase() === identity || u.displayName?.toLowerCase() === identity));
    if (!user) {
      showToast("Login failed", "Account not found or password is incorrect.");
      return;
    }

    loginUser(user);
    showToast("Welcome back", `Logged in as ${user.displayName}.`);
  }

  function loginUser(user) {
    state.currentUser = user;
    saveSession(user.id);
    document.body.classList.add("logged-in");
    document.body.classList.remove("logged-out");
    state.settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
    renderAll();
  }

  function logout() {
    clearSession();
    state.currentUser = null;
    document.body.classList.remove("logged-in");
    document.body.classList.remove("sidebar-open");
    document.body.classList.remove("people-open");
    closeModal(els.profileModal);
    closeModal(els.settingsModal);
    closeModal(els.adminModal);
    closeModal(els.dmModal);
    openAuth("login");
  }

  function savePreferences() {
    state.settings.prefs.compact = !!els.compactToggle.checked;
    state.settings.prefs.sound = !!els.soundToggle.checked;
    state.settings.prefs.timestamps = !!els.timestampToggle.checked;
    saveSettings();
    renderAll();
    showToast("Settings saved", "Your preferences were updated.");
  }

  function sendAnnouncement() {
    const me = getCurrentUser();
    if (!me || !canManageModeration()) {
      showToast("Access denied", "Only staff can send announcements.");
      return;
    }

    const text = els.announcementText.value.trim();
    if (!text) {
      showToast("Missing text", "Type an announcement first.");
      return;
    }

    messages.push({
      id: uid(),
      channel: "announcements",
      userId: me.id,
      text,
      createdAt: Date.now(),
      announcement: true
    });

    saveMessages();
    els.announcementText.value = "";
    state.settings.readAt.announcements = Date.now();
    saveSettings();
    renderAll();
    addSystemMessage("announcements", `${me.displayName} posted an announcement.`);
    showToast("Announcement sent", "The announcement was posted to #announcements.");
    closeModal(els.adminModal);
  }

  function addSystemMessage(channel, text) {
    messages.push({
      id: uid(),
      channel,
      userId: "system",
      text,
      createdAt: Date.now(),
      system: true
    });
    saveMessages();
    renderMessages();
    renderUnreadBadges();
  }

  function init() {
    bindEvents();
    openAuth("login");
    renderAll();
    renderAdminAccess();
    setInterval(renderClock, 1000);
    setInterval(() => {
      if (state.currentUser) {
        renderUnreadBadges();
        renderPeopleList();
      }
    }, 5000);
  }

  bindEvents();

  function bindEvents() {
    els.authModeButtons.forEach(btn => {
      btn.addEventListener("click", () => openAuth(btn.dataset.authMode));
    });

    els.authForm.addEventListener("submit", e => {
      e.preventDefault();
      state.authMode === "login" ? handleLogin() : handleSignup();
    });

    els.openSidebarBtn.addEventListener("click", () => setSidebar(true));
    els.closeSidebarBtn.addEventListener("click", () => setSidebar(false));

    els.peopleBtn.addEventListener("click", openPeoplePanel);
    els.closePeopleBtn.addEventListener("click", () => setPeople(false));
    els.mobileBackdrop.addEventListener("click", () => {
      setSidebar(false);
      setPeople(false);
    });

    els.shareServerBtn.addEventListener("click", shareInvite);
    els.shareServerTopBtn.addEventListener("click", shareInvite);
    els.shareServerRailBtn.addEventListener("click", shareInvite);

    els.openSettingsBtn.addEventListener("click", openSettingsModal);
    els.openSettingsRailBtn.addEventListener("click", openSettingsModal);
    els.settingsBtn.addEventListener("click", openSettingsModal);

    els.openProfileBtn.addEventListener("click", () => openProfile(getCurrentUser()?.id));
    els.openAdminBtn.addEventListener("click", openAdmin);
    els.adminTopBtn.addEventListener("click", openAdmin);
    els.openAdminRailBtn.addEventListener("click", openAdmin);
    els.customizeServerBtn.addEventListener("click", openAdmin);

    els.logoutBtn.addEventListener("click", logout);

    els.globalSearch.addEventListener("input", () => {
      renderChannels();
      renderMessages();
      renderPeopleList();
    });

    els.sendBtn.addEventListener("click", sendMessage);
    els.messageInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });

    els.attachBtn.addEventListener("click", () => {
      if (!canPostInChannel(state.activeChannel)) return;
      els.messageMediaInput.click();
    });

    els.messageMediaInput.addEventListener("change", () => {
      const file = els.messageMediaInput.files?.[0];
      handleAttachment(file);
    });

    els.removeAttachmentBtn.addEventListener("click", clearAttachment);

    els.profileAvatarFile.addEventListener("change", () => {
      const file = els.profileAvatarFile.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Invalid file", "Please choose an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        els.profileAvatarUrl.value = String(reader.result || "");
        els.profileAvatarPreview.innerHTML = `<img class="avatar-img" src="${escapeHtml(String(reader.result || ""))}" alt="Avatar preview">`;
        els.profileAvatarPreview.style.background = "transparent";
      };
      reader.readAsDataURL(file);
    });

    els.uploadAvatarBtn.addEventListener("click", () => els.profileAvatarFile.click());
    els.resetAvatarBtn.addEventListener("click", () => {
      els.profileAvatarUrl.value = "";
      const me = getCurrentUser();
      els.profileAvatarPreview.innerHTML = me?.displayName ? escapeHtml(initial(me.displayName)) : "U";
      els.profileAvatarPreview.style.background = colorFromName(me?.displayName || "U");
    });

    els.saveProfileBtn.addEventListener("click", saveProfile);

    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.closeModal;
        if (target === "profile") closeModal(els.profileModal);
        if (target === "settings") closeModal(els.settingsModal);
        if (target === "admin") closeModal(els.adminModal);
        if (target === "dm") closeModal(els.dmModal);
      });
    });

    els.profileModal.addEventListener("click", e => {
      if (e.target === els.profileModal) closeModal(els.profileModal);
    });

    els.settingsModal.addEventListener("click", e => {
      if (e.target === els.settingsModal) closeModal(els.settingsModal);
    });

    els.adminModal.addEventListener("click", e => {
      if (e.target === els.adminModal) closeModal(els.adminModal);
    });

    els.dmModal.addEventListener("click", e => {
      if (e.target === els.dmModal) closeModal(els.dmModal);
    });

    els.friendBtn.addEventListener("click", () => {
      if (state.profileTargetId) handleFriendAction(state.profileTargetId);
    });

    els.messageBtn.addEventListener("click", () => {
      if (state.profileTargetId) {
        closeModal(els.profileModal);
        openDM(state.profileTargetId);
      }
    });

    els.dmSendBtn.addEventListener("click", sendDM);
    els.dmInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendDM();
    });

    els.switchAccountBtn.addEventListener("click", () => openAuthForSwitch("login"));
    els.addAccountBtn.addEventListener("click", () => openAuthForSwitch("signup"));
    els.logoutFromSettingsBtn.addEventListener("click", logout);

    els.compactToggle.addEventListener("change", savePreferences);
    els.soundToggle.addEventListener("change", savePreferences);
    els.timestampToggle.addEventListener("change", savePreferences);

    els.serverPhotoFile.addEventListener("change", () => {
      const file = els.serverPhotoFile.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        showToast("Invalid file", "Please choose an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        els.serverPhotoUrlInput.value = String(reader.result || "");
        els.serverPreviewAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(String(reader.result || ""))}" alt="Server preview">`;
        els.serverPreviewAvatar.style.background = "transparent";
      };
      reader.readAsDataURL(file);
    });

    els.uploadServerPhotoBtn.addEventListener("click", () => {
      if (!canEditServer()) return showToast("Access denied", "Only the owner and admin can upload a server photo.");
      els.serverPhotoFile.click();
    });

    els.resetServerPhotoBtn.addEventListener("click", () => {
      if (!canEditServer()) return showToast("Access denied", "Only the owner and admin can edit the server photo.");
      els.serverPhotoUrlInput.value = "";
      els.serverPreviewAvatar.textContent = initial(state.settings.server.name);
      els.serverPreviewAvatar.style.background = colorFromName(state.settings.server.name);
    });

    els.saveServerSettingsBtn.addEventListener("click", saveServerSettings);
    els.addChannelBtn.addEventListener("click", addChannel);
    els.sendAnnouncementBtn.addEventListener("click", sendAnnouncement);
    els.copyInviteBtn.addEventListener("click", shareInvite);

    els.serverNameInput.addEventListener("input", () => {
      els.serverPreviewName.textContent = els.serverNameInput.value.trim() || "Studio X Community";
    });

    els.serverDescInput.addEventListener("input", () => {
      els.serverPreviewDesc.textContent = els.serverDescInput.value.trim() || "A verified community space.";
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        setSidebar(false);
        setPeople(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) document.body.classList.remove("sidebar-open");
      if (window.innerWidth > 1280) document.body.classList.remove("people-open");
    });
  }

  function openPeoplePanel() {
    setPeople(true);
  }

  function addChannel() {
    if (!canCreateChannels()) {
      showToast("Access denied", "Only the owner and admin can add channels.");
      return;
    }

    const name = els.newChannelName.value.trim().toLowerCase();
    const desc = els.newChannelDesc.value.trim();
    const emoji = (els.newChannelEmoji.value.trim() || "💬").slice(0, 4);
    const category = els.newChannelCategory.value;

    if (!name) {
      showToast("Missing channel name", "Please enter a channel name.");
      return;
    }

    const id = slugify(name);
    if (state.settings.channels.some(c => c.id === id)) {
      showToast("Channel exists", "A channel with that name already exists.");
      return;
    }

    state.settings.channels.push({
      id,
      name,
      description: desc || "New community channel.",
      emoji,
      category
    });

    saveSettings();
    els.newChannelName.value = "";
    els.newChannelDesc.value = "";
    els.newChannelEmoji.value = "";
    renderChannels();
    renderChannelHeader();
    addSystemMessage("announcements", `${getCurrentUser().displayName} created #${name}.`);
    showToast("Channel created", `#${name} has been added to the server.`);
  }

  function slugify(str) {
    return String(str)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function saveServerSettings() {
    if (!canEditServer()) {
      showToast("Access denied", "Only the owner and admin can edit the server profile.");
      return;
    }

    const name = els.serverNameInput.value.trim();
    const desc = els.serverDescInput.value.trim();
    const photo = els.serverPhotoUrlInput.value.trim();

    if (!name) {
      showToast("Missing server name", "Server name cannot be empty.");
      return;
    }

    state.settings.server.name = name;
    state.settings.server.description = desc || state.settings.server.description;
    state.settings.server.photo = photo || "";
    saveSettings();

    renderServerBrand();
    renderChannelHeader();
    renderAll();
    addSystemMessage("announcements", `${getCurrentUser().displayName} updated the server profile.`);
    showToast("Server updated", "Server name, description, and photo were saved.");
  }

  function dmThreadId(a, b) {
    return [a, b].sort().join("__");
  }

  function renderAdminAccess() {
    const show = canOpenAdminPanel();
    document.querySelectorAll(".hidden-owneradmin").forEach(el => {
      el.hidden = !show;
    });
  }

  function showAdminControlsIfNeeded() {
    renderAdminAccess();
  }

  function openAdminFromTop() {
    openAdmin();
  }

  function renderPeopleAndChat() {
    renderPeopleList();
    renderMessages();
  }

  function complete() {
    init();
  }

  complete();
})();
