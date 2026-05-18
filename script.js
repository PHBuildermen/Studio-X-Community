(() => {
  const STORAGE_KEYS = {
    users: "studiox_users_v4",
    messages: "studiox_messages_v4",
    session: "studiox_session_v4",
    settings: "studiox_settings_v4"
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
    { id: "media", name: "media", description: "Images, clips, and showcase posts.", emoji: "🖼️", category: "creative" }
  ];

  const defaultOwner = {
    id: uid(),
    email: "owner@studiox.local",
    password: "Huge@Passcode1",
    displayName: "PHBuildermen",
    bio: "Owner of Studio X Community.",
    role: "owner",
    verified: true,
    banned: false,
    warnings: 0,
    avatar: "",
    createdAt: Date.now()
  };

  const defaultAdmin = {
    id: uid(),
    email: "admin@studiox.local",
    password: "@HugePasscode1",
    displayName: "PHBuilderman",
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
    pendingImage: "",
    pendingImageName: "",
    serverPhotoDraft: "",
    loadingTimer: null,
    settings: {
      server: structuredClone(DEFAULT_SERVER),
      channels: structuredClone(DEFAULT_CHANNELS),
      inviteCode: "",
      readAt: {}
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
    shareServerTopBtn: document.getElementById("shareServerTopBtn"),
    shareServerRailBtn: document.getElementById("shareServerRailBtn"),

    openProfileBtn: document.getElementById("openProfileBtn"),
    openProfileFooterBtn: document.getElementById("editProfileFooterBtn"),
    profileTopBtn: document.getElementById("profileTopBtn"),
    openProfileRailBtn: document.getElementById("openProfileRailBtn"),

    openAdminBtn: document.getElementById("openAdminBtn"),
    adminTopBtn: document.getElementById("adminTopBtn"),
    openAdminRailBtn: document.getElementById("openAdminRailBtn"),

    logoutBtn: document.getElementById("logoutBtn"),
    globalSearch: document.getElementById("globalSearch"),

    memberCountLabel: document.getElementById("memberCountLabel"),
    clockLabel: document.getElementById("clockLabel"),

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

    loadingLayer: document.getElementById("loadingLayer"),
    messageList: document.getElementById("messageList"),
    messageInput: document.getElementById("messageInput"),
    sendBtn: document.getElementById("sendBtn"),
    attachBtn: document.getElementById("attachBtn"),
    messageImageInput: document.getElementById("messageImageInput"),
    attachmentPreview: document.getElementById("attachmentPreview"),
    attachmentName: document.getElementById("attachmentName"),
    removeAttachmentBtn: document.getElementById("removeAttachmentBtn"),

    profileModal: document.getElementById("profileModal"),
    profileAvatarPreview: document.getElementById("profileAvatarPreview"),
    profilePreviewName: document.getElementById("profilePreviewName"),
    profilePreviewRole: document.getElementById("profilePreviewRole"),
    profileName: document.getElementById("profileName"),
    profileBio: document.getElementById("profileBio"),
    profileAvatarUrl: document.getElementById("profileAvatarUrl"),
    profileAvatarFile: document.getElementById("profileAvatarFile"),
    uploadAvatarBtn: document.getElementById("uploadAvatarBtn"),
    resetAvatarBtn: document.getElementById("resetAvatarBtn"),
    saveProfileBtn: document.getElementById("saveProfileBtn"),

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

    toastStack: document.getElementById("toastStack"),

    serverPhotoFile: document.createElement("input")
  };

  els.serverPhotoFile.type = "file";
  els.serverPhotoFile.accept = "image/*";
  els.serverPhotoFile.hidden = true;
  document.body.appendChild(els.serverPhotoFile);

  let users = loadJSON(STORAGE_KEYS.users, []);
  let messages = loadJSON(STORAGE_KEYS.messages, []);
  let settings = loadJSON(STORAGE_KEYS.settings, null);
  const session = loadJSON(STORAGE_KEYS.session, null);

  if (!settings || typeof settings !== "object") {
    settings = {
      server: structuredClone(DEFAULT_SERVER),
      channels: structuredClone(DEFAULT_CHANNELS),
      inviteCode: `STX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      readAt: {}
    };
  } else {
    settings.server = settings.server || structuredClone(DEFAULT_SERVER);
    settings.channels = Array.isArray(settings.channels) && settings.channels.length ? settings.channels : structuredClone(DEFAULT_CHANNELS);
    settings.inviteCode = settings.inviteCode || `STX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    settings.readAt = settings.readAt || {};
  }

  seedData();
  saveSettings();

  state.currentUser = session ? users.find(u => u.id === session.userId && !u.banned) || null : null;
  if (!state.currentUser) clearSession();

  const startChannel = settings.channels.find(c => c.id === "announcements")?.id || settings.channels[0]?.id || "announcements";
  state.activeChannel = startChannel;

  function uid() {
    return window.crypto?.randomUUID?.() || `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }

  function seedData() {
    const ownerExists = users.some(u => u.email === defaultOwner.email || u.displayName.toLowerCase() === defaultOwner.displayName.toLowerCase());
    const adminExists = users.some(u => u.email === defaultAdmin.email || u.displayName.toLowerCase() === defaultAdmin.displayName.toLowerCase());

    if (!ownerExists) users.unshift({ ...defaultOwner });
    if (!adminExists) users.splice(1, 0, { ...defaultAdmin });

    users = users.map(u => {
      if (u.displayName === "PHBuildermen") {
        return { ...u, role: "owner", verified: true, banned: false };
      }
      if (u.displayName === "PHBuilderman") {
        return { ...u, role: "admin", verified: true, banned: false };
      }
      return u;
    });

    if (!messages.length) {
      messages = [
        {
          id: uid(),
          channel: "announcements",
          userId: "system",
          text: "Welcome to Studio X Community. This server uses browser-local accounts, real roles, moderation tools, and profile settings.",
          createdAt: Date.now() - 1000 * 60 * 20,
          system: true
        },
        {
          id: uid(),
          channel: "announcements",
          userId: users.find(u => u.role === "owner")?.id || users[0].id,
          text: "I’m PHBuildermen, the owner of Studio X. Keep this community clean, creative, and respectful.",
          createdAt: Date.now() - 1000 * 60 * 12,
          announcement: true
        },
        {
          id: uid(),
          channel: "general",
          userId: users.find(u => u.displayName === "PHBuilderman")?.id || users[1].id,
          text: "PHBuilderman is now part of the admin team and ready to help moderate the server.",
          createdAt: Date.now() - 1000 * 60 * 8,
          announcement: false
        }
      ];
    }

    saveUsers();
    saveMessages();
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
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
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
    return String(role || "member").replace(/^\w/, c => c.toUpperCase()).replace(/_/g, " ");
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
    if (user.avatar) {
      return `<div class="avatar ${sizeClass}"><img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}"></div>`;
    }
    return `<div class="avatar ${sizeClass}" style="background:${colorFromName(user.displayName)}">${escapeHtml(initial(user.displayName))}</div>`;
  }

  function canModerate() {
    const user = getCurrentUser();
    return !!user && (user.role === "owner" || user.role === "admin" || user.role === "moderator");
  }

  function canEditServer() {
    const user = getCurrentUser();
    return !!user && (user.role === "owner" || user.role === "admin" || user.role === "moderator");
  }

  function canCreateChannels() {
    const user = getCurrentUser();
    return !!user && (user.role === "owner" || user.role === "admin");
  }

  function canAssignRoles() {
    const user = getCurrentUser();
    return !!user && (user.role === "owner" || user.role === "admin");
  }

  function canAssignAdminRole() {
    const user = getCurrentUser();
    return !!user && user.role === "owner";
  }

  function channelMeta(channelId) {
    return settings.channels.find(c => c.id === channelId) || settings.channels[0];
  }

  function toast(title, message) {
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

  function showLoading(duration = 320) {
    els.loadingLayer.classList.add("show");
    clearTimeout(state.loadingTimer);
    state.loadingTimer = setTimeout(() => els.loadingLayer.classList.remove("show"), duration);
  }

  function setSidebar(open) {
    document.body.classList.toggle("sidebar-open", open);
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
    const link = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(settings.inviteCode)}`;
    if (navigator.share) {
      navigator.share({
        title: "Studio X Community",
        text: `Join Studio X Community using this invite link: ${link}`,
        url: link
      }).catch(() => {
        navigator.clipboard?.writeText(link);
        toast("Invite copied", "The server invite link was copied to your clipboard.");
      });
    } else {
      navigator.clipboard?.writeText(link);
      toast("Invite copied", "The server invite link was copied to your clipboard.");
    }
  }

  function renderClock() {
    const d = new Date();
    els.clockLabel.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function unreadCount(channelId) {
    const readAt = settings.readAt?.[channelId] || 0;
    return messages.filter(m => m.channel === channelId && !m.system && m.createdAt > readAt && m.userId !== getCurrentUser()?.id).length;
  }

  function updatePageTitle() {
    document.title = `${settings.server.name} (Blue Check: Verified)`;
  }

  function renderServerBrand() {
    const server = settings.server;
    els.serverNameLabel.textContent = server.name;
    els.serverDescLabel.textContent = server.description;
    els.serverPreviewName.textContent = server.name;
    els.serverPreviewDesc.textContent = server.description;

    if (server.photo) {
      els.serverAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(server.photo)}" alt="Server photo">`;
      els.serverPreviewAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(server.photo)}" alt="Server photo">`;
      els.serverPreviewAvatar.style.background = "transparent";
    } else {
      const first = initial(server.name);
      els.serverAvatar.textContent = first;
      els.serverPreviewAvatar.textContent = first;
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
    els.messageInput.placeholder = `Message #${meta?.name || "channel"}`;
  }

  function categoryLabel(cat) {
    return ({
      information: "Information",
      community: "Community",
      creative: "Creative",
      staff: "Staff"
    })[cat] || "Custom";
  }

  function renderChannels() {
    const term = els.globalSearch.value.trim().toLowerCase();
    const groups = {};

    settings.channels.forEach(ch => {
      if (term) {
        const hay = `${ch.name} ${ch.description} ${ch.emoji}`.toLowerCase();
        const messageHit = messages.some(m => m.channel === ch.id && `${authorName(m)} ${m.text || ""}`.toLowerCase().includes(term));
        if (!hay.includes(term) && !messageHit) return;
      }
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
              <span class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            ${msg.announcement ? `<div class="announcement-tag"><svg><use href="#icon-megaphone"></use></svg> Announcement</div>` : ""}
            <p class="message-text">${nl2br(escapeHtml(msg.text || ""))}</p>
            ${msg.image ? `<img class="chat-image" src="${escapeHtml(msg.image)}" alt="Uploaded image">` : ""}
          </div>
        </article>
      `;
    }).join("");
  }

  function setActiveChannel(channelId) {
    if (!settings.channels.find(c => c.id === channelId) || state.activeChannel === channelId) return;
    state.activeChannel = channelId;
    showLoading();

    settings.readAt[channelId] = Date.now();
    saveSettings();

    renderChannelHeader();
    renderChannels();
    setTimeout(() => {
      renderMessages();
      els.messageList.scrollTop = els.messageList.scrollHeight;
    }, 250);

    if (window.innerWidth <= 900) setSidebar(false);
  }

  function renderMemberCount() {
    els.memberCountLabel.textContent = `${visibleUsers().length} members online`;
  }

  function renderAdminAccess() {
    const user = getCurrentUser();
    const show = !!user && (user.role === "owner" || user.role === "admin" || user.role === "moderator");
    document.querySelectorAll(".hidden-admin").forEach(el => {
      el.hidden = !show;
    });
  }

  function renderProfileModal() {
    const user = getCurrentUser();
    if (!user) return;

    els.profilePreviewName.textContent = user.displayName;
    els.profilePreviewRole.textContent = roleLabel(user.role);
    els.profileName.value = user.displayName || "";
    els.profileBio.value = user.bio || "";
    els.profileAvatarUrl.value = user.avatar || "";
    els.profileAvatarPreview.innerHTML = user.avatar
      ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="Avatar preview">`
      : `${escapeHtml(initial(user.displayName))}`;
    els.profileAvatarPreview.style.background = user.avatar ? "transparent" : colorFromName(user.displayName);
  }

  function openProfileModal() {
    renderProfileModal();
    openModal(els.profileModal);
  }

  function renderAdminMembers() {
    const current = getCurrentUser();
    if (!current) return;

    const sortedUsers = [...users].sort((a, b) => {
      const order = { owner: 0, admin: 1, moderator: 2, content_creator: 3, member: 4 };
      return order[a.role] - order[b.role] || a.displayName.localeCompare(b.displayName);
    });

    els.adminMembersList.innerHTML = sortedUsers.map(user => {
      const canRoleChange = canAssignRoles() && user.id !== current.id;
      const canModerateUser = canModerate() && user.role !== "owner" && user.id !== current.id;
      const canChangeToAdmin = canAssignAdminRole();

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
            <select class="role-select" data-role-for="${escapeHtml(user.id)}" ${canRoleChange ? "" : "disabled"}>
              <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
              <option value="content_creator" ${user.role === "content_creator" ? "selected" : ""}>Content Creator</option>
              <option value="moderator" ${user.role === "moderator" ? "selected" : ""}>Moderator</option>
              <option value="admin" ${user.role === "admin" ? "selected" : ""} ${canChangeToAdmin ? "" : "disabled"}>Admin</option>
              <option value="owner" ${user.role === "owner" ? "selected" : ""} disabled>Owner</option>
            </select>
            <button class="mini-btn warning" data-warn-user="${escapeHtml(user.id)}" ${canModerateUser ? "" : "disabled"}>
              <svg><use href="#icon-warning"></use></svg>
              Warn
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
        if (!canAssignRoles()) {
          select.value = getUserById(select.dataset.roleFor)?.role || "member";
          return;
        }

        const user = getUserById(select.dataset.roleFor);
        if (!user || user.id === getCurrentUser().id) return;

        const nextRole = select.value;

        if (nextRole === "admin" && !canAssignAdminRole()) {
          select.value = user.role;
          toast("Not allowed", "Only the owner can assign the Admin role.");
          return;
        }

        user.role = nextRole;
        if (nextRole === "admin" || nextRole === "owner") user.verified = true;
        saveUsers();
        renderAll();
        addSystemMessage("announcements", `${getCurrentUser().displayName} changed ${user.displayName}'s role to ${roleLabel(nextRole)}.`);
        toast("Role updated", `${user.displayName} is now ${roleLabel(nextRole)}.`);
      });
    });

    els.adminMembersList.querySelectorAll("[data-warn-user]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = getUserById(btn.dataset.warnUser);
        if (!user || user.role === "owner" || user.id === getCurrentUser().id) return;

        user.warnings = (user.warnings || 0) + 1;
        saveUsers();
        addSystemMessage("announcements", `${getCurrentUser().displayName} warned ${user.displayName}. Warning count: ${user.warnings}.`);

        if (user.warnings >= 3) {
          user.banned = true;
          addSystemMessage("announcements", `${user.displayName} was automatically banned after 3 warnings.`);
          toast("Banned", `${user.displayName} reached 3 warnings and was banned.`);
        } else {
          toast("Warning issued", `${user.displayName} now has ${user.warnings} warning(s).`);
        }

        saveUsers();
        renderAll();

        if (state.currentUser && state.currentUser.id === user.id && user.banned) logout();
      });
    });

    els.adminMembersList.querySelectorAll("[data-ban-user]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = getUserById(btn.dataset.banUser);
        if (!user || user.role === "owner" || user.id === getCurrentUser().id) return;

        user.banned = !user.banned;
        saveUsers();
        addSystemMessage("announcements", `${getCurrentUser().displayName} ${user.banned ? "banned" : "unbanned"} ${user.displayName}.`);
        toast(user.banned ? "User banned" : "User unbanned", `${user.displayName} is now ${user.banned ? "banned" : "active"}.`);
        renderAll();

        if (state.currentUser && state.currentUser.id === user.id && user.banned) logout();
      });
    });
  }

  function openAdminModal() {
    if (!canModerate()) {
      toast("Access denied", "Only staff can open the admin panel.");
      return;
    }
    renderAdminMembers();
    renderServerSettingsFields();
    openModal(els.adminModal);
  }

  function renderServerSettingsFields() {
    const server = settings.server;
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

    const editable = canEditServer();
    els.serverNameInput.disabled = !editable;
    els.serverDescInput.disabled = !editable;
    els.serverPhotoUrlInput.disabled = !editable;
    els.uploadServerPhotoBtn.disabled = !editable;
    els.resetServerPhotoBtn.disabled = !editable;
    els.saveServerSettingsBtn.disabled = !editable;

    const createAllowed = canCreateChannels();
    els.newChannelName.disabled = !createAllowed;
    els.newChannelDesc.disabled = !createAllowed;
    els.newChannelEmoji.disabled = !createAllowed;
    els.newChannelCategory.disabled = !createAllowed;
    els.addChannelBtn.disabled = !createAllowed;
  }

  function saveProfile() {
    const user = getCurrentUser();
    if (!user) return;

    const name = els.profileName.value.trim();
    const bio = els.profileBio.value.trim();
    const avatar = els.profileAvatarUrl.value.trim();

    if (!name) {
      toast("Missing name", "Username cannot be empty.");
      return;
    }

    const duplicate = users.some(u => u.id !== user.id && u.displayName.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      toast("Name taken", "Another member already uses that username.");
      return;
    }

    user.displayName = name;
    user.bio = bio;
    user.avatar = avatar;
    saveUsers();
    state.currentUser = user;
    renderAll();
    renderProfileModal();
    toast("Profile saved", "Your profile changes were updated.");
    closeModal(els.profileModal);
  }

  function handleSignup() {
    const email = els.signupEmail.value.trim().toLowerCase();
    const name = els.signupName.value.trim();
    const password = els.signupPassword.value;
    const confirm = els.signupConfirm.value;

    if (!email || !name || !password || !confirm) {
      toast("Missing fields", "Please fill in all sign up fields.");
      return;
    }

    if (password.length < 6) {
      toast("Weak password", "Use at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      toast("Password mismatch", "The passwords do not match.");
      return;
    }

    if (users.some(u => u.email.toLowerCase() === email)) {
      toast("Email used", "That email is already registered.");
      return;
    }

    if (users.some(u => u.displayName.toLowerCase() === name.toLowerCase())) {
      toast("Name used", "That username is already registered.");
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
    saveUsers();
    loginUser(user);
    toast("Account created", "Your Studio X account is ready.");
  }

  function handleLogin() {
    const identity = els.loginIdentity.value.trim().toLowerCase();
    const password = els.loginPassword.value;

    if (!identity || !password) {
      toast("Missing fields", "Enter your email/username and password.");
      return;
    }

    const user = users.find(u => !u.banned && u.password === password && (u.email.toLowerCase() === identity || u.displayName.toLowerCase() === identity));
    if (!user) {
      toast("Login failed", "Account not found or password is incorrect.");
      return;
    }

    loginUser(user);
    toast("Welcome back", `Logged in as ${user.displayName}.`);
  }

  function loginUser(user) {
    state.currentUser = user;
    saveSession(user.id);
    document.body.classList.add("logged-in");
    state.settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
    renderAll();
  }

  function logout() {
    clearSession();
    state.currentUser = null;
    document.body.classList.remove("logged-in");
    setSidebar(false);
    closeModal(els.profileModal);
    closeModal(els.adminModal);
    toast("Logged out", "You have been signed out.");
  }

  function toggleAuthMode(mode) {
    state.authMode = mode;
    els.authModeButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.authMode === mode));
    els.signupFields.hidden = mode !== "signup";
    els.loginFields.forEach(field => field.hidden = mode !== "login");
    els.authSubmit.innerHTML = mode === "login"
      ? `<svg><use href="#icon-user"></use></svg> Log in`
      : `<svg><use href="#icon-user"></use></svg> Create account`;
  }

  function renderProfileModal() {
    const user = getCurrentUser();
    if (!user) return;

    els.profilePreviewName.textContent = user.displayName;
    els.profilePreviewRole.textContent = roleLabel(user.role);
    els.profileName.value = user.displayName || "";
    els.profileBio.value = user.bio || "";
    els.profileAvatarUrl.value = user.avatar || "";
    els.profileAvatarPreview.innerHTML = user.avatar
      ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="Avatar preview">`
      : `${escapeHtml(initial(user.displayName))}`;
    els.profileAvatarPreview.style.background = user.avatar ? "transparent" : colorFromName(user.displayName);
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

  function sendMessage() {
    const user = getCurrentUser();
    if (!user) return;

    const text = els.messageInput.value.trim();
    const image = state.pendingImage;
    if (!text && !image) return;

    messages.push({
      id: uid(),
      channel: state.activeChannel,
      userId: user.id,
      text,
      image,
      createdAt: Date.now(),
      announcement: false
    });

    els.messageInput.value = "";
    clearAttachment();
    settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
    saveMessages();
    renderMessages();
    renderUnreadBadges();
    els.messageList.scrollTop = els.messageList.scrollHeight;
  }

  function clearAttachment() {
    state.pendingImage = "";
    state.pendingImageName = "";
    els.messageImageInput.value = "";
    els.attachmentPreview.hidden = true;
    els.attachmentName.textContent = "";
  }

  function handleAttachment(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Invalid file", "Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      state.pendingImage = String(reader.result || "");
      state.pendingImageName = file.name;
      els.attachmentName.textContent = file.name;
      els.attachmentPreview.hidden = false;
    };
    reader.readAsDataURL(file);
  }

  function saveServerSettings() {
    if (!canEditServer()) {
      toast("Access denied", "Only staff can edit server settings.");
      return;
    }

    const name = els.serverNameInput.value.trim();
    const description = els.serverDescInput.value.trim();
    const photo = els.serverPhotoUrlInput.value.trim() || state.serverPhotoDraft || "";

    if (!name) {
      toast("Missing server name", "Server name cannot be empty.");
      return;
    }

    settings.server.name = name;
    settings.server.description = description || settings.server.description;
    settings.server.photo = photo;
    saveSettings();
    state.serverPhotoDraft = "";
    renderServerBrand();
    renderChannelHeader();
    renderSidebarUser();
    renderAll();
    addSystemMessage("announcements", `${getCurrentUser().displayName} updated the server profile.`);
    toast("Server updated", "Server name, description, and photo were saved.");
  }

  function addChannel() {
    if (!canCreateChannels()) {
      toast("Access denied", "Only owner/admin can add channels.");
      return;
    }

    const name = els.newChannelName.value.trim().toLowerCase();
    const desc = els.newChannelDesc.value.trim();
    const emoji = (els.newChannelEmoji.value.trim() || "💬").slice(0, 4);
    const category = els.newChannelCategory.value;

    if (!name) {
      toast("Missing channel name", "Please enter a channel name.");
      return;
    }

    const id = slugify(name);
    if (settings.channels.some(c => c.id === id)) {
      toast("Channel exists", "A channel with that name already exists.");
      return;
    }

    settings.channels.push({
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
    toast("Channel created", `#${name} has been added to the server.`);
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

  function renderAll() {
    const user = getCurrentUser();
    if (user) state.currentUser = user;

    if (!state.currentUser || state.currentUser.banned) {
      document.body.classList.remove("logged-in");
      if (state.currentUser?.banned) {
        toast("Account blocked", "This account is banned.");
        logout();
      }
      return;
    }

    document.body.classList.add("logged-in");
    renderClock();
    renderServerBrand();
    renderSidebarUser();
    renderChannelHeader();
    renderChannels();
    renderMessages();
    renderMemberCount();
    renderAdminAccess();
    settings.readAt[state.activeChannel] = Date.now();
    saveSettings();
    renderUnreadBadges();
  }

  function bindEvents() {
    els.authModeButtons.forEach(btn => {
      btn.addEventListener("click", () => toggleAuthMode(btn.dataset.authMode));
    });

    els.authForm.addEventListener("submit", e => {
      e.preventDefault();
      state.authMode === "login" ? handleLogin() : handleSignup();
    });

    els.openSidebarBtn.addEventListener("click", () => setSidebar(true));
    els.closeSidebarBtn.addEventListener("click", () => setSidebar(false));
    els.mobileBackdrop.addEventListener("click", () => setSidebar(false));

    [els.shareServerBtn, els.shareServerTopBtn, els.shareServerRailBtn, els.copyInviteBtn].forEach(btn => {
      btn.addEventListener("click", shareInvite);
    });

    [els.openProfileBtn, els.openProfileFooterBtn, els.profileTopBtn, els.openProfileRailBtn].forEach(btn => {
      btn.addEventListener("click", openProfileModal);
    });

    [els.openAdminBtn, els.adminTopBtn, els.openAdminRailBtn].forEach(btn => {
      btn.addEventListener("click", openAdminModal);
    });

    els.logoutBtn.addEventListener("click", logout);

    els.globalSearch.addEventListener("input", () => {
      renderChannels();
      renderMessages();
    });

    els.sendBtn.addEventListener("click", sendMessage);
    els.messageInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
      if (e.key === "Escape") els.messageInput.blur();
    });

    els.attachBtn.addEventListener("click", () => els.messageImageInput.click());
    els.messageImageInput.addEventListener("change", () => {
      const file = els.messageImageInput.files?.[0];
      handleAttachment(file);
    });

    els.removeAttachmentBtn.addEventListener("click", clearAttachment);

    els.profileAvatarFile.addEventListener("change", () => {
      const file = els.profileAvatarFile.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast("Invalid file", "Please choose an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        state.serverPhotoDraft = "";
        els.profileAvatarUrl.value = String(reader.result || "");
        els.profileAvatarPreview.innerHTML = `<img class="avatar-img" src="${escapeHtml(String(reader.result || ""))}" alt="Avatar preview">`;
      };
      reader.readAsDataURL(file);
    });

    els.uploadAvatarBtn.addEventListener("click", () => els.profileAvatarFile.click());
    els.resetAvatarBtn.addEventListener("click", () => {
      els.profileAvatarUrl.value = "";
      const user = getCurrentUser();
      els.profileAvatarPreview.innerHTML = user?.displayName
        ? `${escapeHtml(initial(user.displayName))}`
        : "U";
      els.profileAvatarPreview.style.background = colorFromName(user?.displayName || "U");
    });

    els.saveProfileBtn.addEventListener("click", saveProfile);

    els.serverPhotoFile.addEventListener("change", () => {
      const file = els.serverPhotoFile.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast("Invalid file", "Please choose an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        state.serverPhotoDraft = String(reader.result || "");
        els.serverPhotoUrlInput.value = state.serverPhotoDraft;
        els.serverPreviewAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(state.serverPhotoDraft)}" alt="Server preview">`;
        els.serverPreviewAvatar.style.background = "transparent";
      };
      reader.readAsDataURL(file);
    });

    els.uploadServerPhotoBtn.addEventListener("click", () => {
      if (!canEditServer()) return toast("Access denied", "Only staff can upload a server photo.");
      els.serverPhotoFile.click();
    });

    els.resetServerPhotoBtn.addEventListener("click", () => {
      if (!canEditServer()) return toast("Access denied", "Only staff can edit the server photo.");
      state.serverPhotoDraft = "";
      els.serverPhotoUrlInput.value = "";
      els.serverPreviewAvatar.textContent = initial(settings.server.name);
      els.serverPreviewAvatar.style.background = colorFromName(settings.server.name);
    });

    els.saveServerSettingsBtn.addEventListener("click", saveServerSettings);
    els.addChannelBtn.addEventListener("click", addChannel);

    els.sendAnnouncementBtn.addEventListener("click", () => {
      const user = getCurrentUser();
      if (!user || !canModerate()) {
        toast("Access denied", "Only staff can send announcements.");
        return;
      }

      const text = els.announcementText.value.trim();
      if (!text) {
        toast("Missing text", "Type an announcement first.");
        return;
      }

      messages.push({
        id: uid(),
        channel: "announcements",
        userId: user.id,
        text,
        createdAt: Date.now(),
        announcement: true
      });

      saveMessages();
      els.announcementText.value = "";
      settings.readAt.announcements = Date.now();
      saveSettings();
      renderAll();
      addSystemMessage("announcements", `${user.displayName} posted an announcement.`);
      toast("Announcement sent", "The announcement was posted to #announcements.");
      closeModal(els.adminModal);
    });

    document.querySelectorAll("[data-close-modal]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.dataset.closeModal === "profile") closeModal(els.profileModal);
        if (btn.dataset.closeModal === "admin") closeModal(els.adminModal);
      });
    });

    els.profileModal.addEventListener("click", e => {
      if (e.target === els.profileModal) closeModal(els.profileModal);
    });

    els.adminModal.addEventListener("click", e => {
      if (e.target === els.adminModal) closeModal(els.adminModal);
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        setSidebar(false);
        closeModal(els.profileModal);
        closeModal(els.adminModal);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) document.body.classList.remove("sidebar-open");
    });
  }

  function init() {
    bindEvents();
    toggleAuthMode("login");
    renderAll();
    setInterval(renderClock, 1000);
    setInterval(() => {
      if (state.currentUser) {
        renderMemberCount();
        renderUnreadBadges();
      }
    }, 5000);
  }

  init();
})();
