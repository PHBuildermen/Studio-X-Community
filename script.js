(() => {
  const STORAGE_KEYS = {
    users: "studiox_users_v2",
    messages: "studiox_messages_v2",
    session: "studiox_session_v2",
    settings: "studiox_settings_v2"
  };

  const CHANNELS = {
    announcements: {
      title: "announcements",
      subtitle: "Official updates, news, and event posts.",
      icon: "#icon-megaphone"
    },
    rules: {
      title: "rules",
      subtitle: "Community standards and server etiquette.",
      icon: "#icon-settings"
    },
    general: {
      title: "general-chat",
      subtitle: "Daily conversations, questions, and casual talk.",
      icon: "#icon-hash"
    },
    world: {
      title: "world-chat",
      subtitle: "Broad discussion for everyone in the community.",
      icon: "#icon-globe"
    },
    suggestions: {
      title: "suggestions",
      subtitle: "Feature ideas, feedback, and improvement requests.",
      icon: "#icon-lightbulb"
    },
    media: {
      title: "media",
      subtitle: "Images, clips, and showcase posts.",
      icon: "#icon-image"
    }
  };

  const defaultOwner = {
    id: uid(),
    email: "phbuilderman@studiox.local",
    password: "admin123",
    displayName: "PHBuilderman",
    bio: "Owner of Studio X Community.",
    role: "owner",
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
    profileDraftAvatar: "",
    adminTab: "members",
    loadingTimer: null,
    settings: {
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

    channelTitle: document.getElementById("channelTitle"),
    channelSubtitle: document.getElementById("channelSubtitle"),
    channelButtons: Array.from(document.querySelectorAll(".channel-item[data-channel]")),
    unreadBadges: Array.from(document.querySelectorAll("[data-unread]")),

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

    toastStack: document.getElementById("toastStack")
  };

  const currentSession = loadJSON(STORAGE_KEYS.session, null);
  const savedUsers = loadJSON(STORAGE_KEYS.users, null);
  const savedMessages = loadJSON(STORAGE_KEYS.messages, null);
  const savedSettings = loadJSON(STORAGE_KEYS.settings, null);

  let users = Array.isArray(savedUsers) ? savedUsers : [];
  let messages = Array.isArray(savedMessages) ? savedMessages : [];
  state.settings = savedSettings && typeof savedSettings === "object"
    ? { inviteCode: savedSettings.inviteCode || "", readAt: savedSettings.readAt || {} }
    : { inviteCode: "", readAt: {} };

  seedData();
  state.currentUser = currentSession ? users.find(u => u.id === currentSession.userId && !u.banned) || null : null;

  if (!state.currentUser) {
    clearSession();
  }

  if (!state.settings.inviteCode) {
    state.settings.inviteCode = `STX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    saveSettings();
  }

  if (state.currentUser) {
    document.body.classList.add("logged-in");
    document.body.classList.remove("logged-out");
  } else {
    document.body.classList.remove("logged-in");
    document.body.classList.add("logged-out");
  }

  function seedData() {
    const ownerExists = users.some(u => u.email === defaultOwner.email || u.displayName.toLowerCase() === defaultOwner.displayName.toLowerCase());
    if (!ownerExists) {
      users.unshift({ ...defaultOwner });
    } else {
      users = users.map(u => {
        if (u.email === defaultOwner.email || u.displayName.toLowerCase() === defaultOwner.displayName.toLowerCase()) {
          return {
            ...u,
            role: "owner",
            verified: true,
            banned: false
          };
        }
        return u;
      });
    }

    if (!messages.length) {
      messages = [
        {
          id: uid(),
          channel: "announcements",
          userId: "system",
          text: "Welcome to Studio X Community. This server uses real local accounts, roles, moderation tools, and profile settings.",
          createdAt: Date.now() - 1000 * 60 * 20,
          system: true
        },
        {
          id: uid(),
          channel: "announcements",
          userId: users.find(u => u.role === "owner")?.id || users[0].id,
          text: "I’m PHBuilderman, the owner of Studio X. Keep the space clean, creative, and respectful.",
          createdAt: Date.now() - 1000 * 60 * 12,
          announcement: true
        }
      ];
    }

    saveUsers();
    saveMessages();
    saveSettings();
  }

  function uid() {
    return window.crypto?.randomUUID?.() || `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
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

  function getUserById(id) {
    return users.find(u => u.id === id) || null;
  }

  function getVisibleUsers() {
    return users.filter(u => !u.banned);
  }

  function getCurrentUser() {
    return state.currentUser ? getUserById(state.currentUser.id) : null;
  }

  function canModerate() {
    const user = getCurrentUser();
    return user && (user.role === "owner" || user.role === "admin");
  }

  function canManageRoles() {
    const user = getCurrentUser();
    return user && user.role === "owner";
  }

  function channelMeta(channel) {
    return CHANNELS[channel] || CHANNELS.general;
  }

  function colorFromName(name) {
    const chars = [...String(name || "U")];
    const hash = chars.reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const hue = hash % 360;
    return `linear-gradient(180deg, hsl(${hue} 72% 56%), hsl(${(hue + 18) % 360} 72% 44%))`;
  }

  function avatarMarkup(user, sizeClass = "avatar-lg") {
    if (!user) {
      return `<div class="avatar ${sizeClass}" style="background:${colorFromName("Guest")}">G</div>`;
    }

    const safeAvatar = user.avatar ? escapeHtml(user.avatar) : "";
    const base = user.displayName ? escapeHtml(user.displayName[0].toUpperCase()) : "U";

    if (safeAvatar) {
      return `<div class="avatar ${sizeClass}"><img class="avatar-img" src="${safeAvatar}" alt="${escapeHtml(user.displayName)}"></div>`;
    }

    return `<div class="avatar ${sizeClass}" style="background:${colorFromName(user.displayName)}">${base}</div>`;
  }

  function roleLabel(role) {
    return String(role || "member").replace(/^\w/, c => c.toUpperCase());
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

  function showLoading(duration = 320) {
    els.loadingLayer.classList.add("show");
    clearTimeout(state.loadingTimer);
    state.loadingTimer = setTimeout(() => {
      els.loadingLayer.classList.remove("show");
    }, duration);
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
    const link = `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(state.settings.inviteCode)}`;
    const text = `Join Studio X Community using this invite link: ${link}`;

    if (navigator.share) {
      navigator.share({ title: "Studio X Community", text, url: link }).catch(() => {
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
    els.clockLabel.textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function unreadCount(channel) {
    const readAt = state.settings.readAt?.[channel] || 0;
    return messages.filter(m => m.channel === channel && !m.system && m.createdAt > readAt && m.userId !== getCurrentUser()?.id).length;
  }

  function renderUnreadBadges() {
    els.unreadBadges.forEach(badge => {
      const channel = badge.dataset.unread;
      const count = unreadCount(channel);
      if (count > 0) {
        badge.style.display = "inline-flex";
        badge.textContent = count > 99 ? "99+" : String(count);
      } else {
        badge.style.display = "none";
        badge.textContent = "";
      }
    });
  }

  function renderSidebarUser() {
    const user = getCurrentUser();
    if (!user) return;

    els.sidebarAvatar.innerHTML = avatarMarkup(user, "avatar-lg").replace(/^<div class="avatar avatar-lg">/, "").replace(/<\/div>$/, "");
    els.sidebarAvatar.style.background = user.avatar ? "transparent" : colorFromName(user.displayName);
    if (user.avatar) {
      els.sidebarAvatar.innerHTML = `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">`;
    } else {
      els.sidebarAvatar.textContent = user.displayName ? user.displayName[0].toUpperCase() : "U";
    }

    els.sidebarName.textContent = user.displayName;
    els.sidebarRole.textContent = roleLabel(user.role);
    els.sidebarVerified.hidden = !user.verified;
  }

  function renderChannelHeader() {
    const meta = channelMeta(state.activeChannel);
    els.channelTitle.textContent = meta.title;
    els.channelSubtitle.textContent = meta.subtitle;
    els.messageInput.placeholder = `Message #${meta.title}`;
  }

  function renderChannels() {
    const term = els.globalSearch.value.trim().toLowerCase();

    els.channelButtons.forEach(btn => {
      const channel = btn.dataset.channel;
      const meta = channelMeta(channel);
      const visible = !term || `${meta.title} ${meta.subtitle}`.toLowerCase().includes(term) || messages.some(m => m.channel === channel && `${authorName(m)} ${m.text || ""}`.toLowerCase().includes(term));
      btn.style.display = visible ? "" : "none";
      btn.classList.toggle("active", channel === state.activeChannel);
    });

    renderUnreadBadges();
  }

  function authorName(message) {
    if (message.system) return "Studio X";
    const user = getUserById(message.userId);
    return user?.displayName || "Unknown";
  }

  function renderMessages() {
    const channel = state.activeChannel;
    const term = els.globalSearch.value.trim().toLowerCase();

    const channelMessages = messages.filter(m => m.channel === channel);
    const filtered = term
      ? channelMessages.filter(m => {
          const text = `${authorName(m)} ${m.text || ""}`.toLowerCase();
          return text.includes(term);
        })
      : channelMessages;

    if (!filtered.length) {
      els.messageList.innerHTML = `
        <div class="message message-system">
          <div class="message-body">
            <span class="system-pill">
              <svg><use href="#icon-search"></use></svg>
              No results
            </span>
            <p class="message-text">Nothing matched your current search in #${escapeHtml(channelMeta(channel).title)}.</p>
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
            ${user?.avatar ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(name)}">` : escapeHtml(name[0]?.toUpperCase() || "U")}
          </div>
          <div class="message-body">
            <div class="message-head">
              <span class="message-author">${escapeHtml(name)}</span>
              ${verified ? `<span class="verified-badge" title="Verified owner"><svg><use href="#icon-badge-check"></use></svg></span>` : ""}
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

  function setActiveChannel(channel) {
    if (!CHANNELS[channel] || state.activeChannel === channel) return;
    state.activeChannel = channel;
    showLoading();

    state.settings.readAt[channel] = Date.now();
    saveSettings();

    renderChannelHeader();
    renderChannels();

    setTimeout(() => {
      renderMessages();
      els.messageList.scrollTop = els.messageList.scrollHeight;
    }, 250);

    if (window.innerWidth <= 900) {
      setSidebar(false);
    }
  }

  function renderMemberCount() {
    const total = getVisibleUsers().length;
    const online = total;
    els.memberCountLabel.textContent = `${online} members online`;
  }

  function renderAdminAccess() {
    const user = getCurrentUser();
    const show = !!user && (user.role === "owner" || user.role === "admin");
    document.querySelectorAll(".hidden-admin").forEach(el => {
      el.hidden = !show;
    });
  }

  function renderAdminMembers() {
    const current = getCurrentUser();
    if (!current) return;

    const sortedUsers = [...users].sort((a, b) => {
      const order = { owner: 0, admin: 1, moderator: 2, member: 3 };
      return order[a.role] - order[b.role] || a.displayName.localeCompare(b.displayName);
    });

    els.adminMembersList.innerHTML = sortedUsers.map(user => {
      const canRoleChange = canManageRoles() && user.id !== current.id;
      const canModerateUser = canModerate() && user.role !== "owner" && user.id !== current.id;
      const roleSelect = `
        <select class="role-select" data-role-for="${user.id}" ${canRoleChange ? "" : "disabled"}>
          <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
          <option value="moderator" ${user.role === "moderator" ? "selected" : ""}>Moderator</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
          <option value="owner" ${user.role === "owner" ? "selected" : ""} ${user.id === current.id ? "" : "disabled"}>Owner</option>
        </select>
      `;

      return `
        <div class="member-row">
          <div class="member-top">
            <div class="member-info">
              <div class="avatar avatar-lg" style="background:${colorFromName(user.displayName)}">
                ${user.avatar ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">` : escapeHtml(user.displayName[0].toUpperCase())}
              </div>
              <div class="member-meta">
                <div class="member-name-line">
                  <strong>${escapeHtml(user.displayName)}</strong>
                  <span class="role-pill ${escapeHtml(user.role)}">${escapeHtml(roleLabel(user.role))}</span>
                  ${user.verified ? `<span class="verified-badge" title="Verified owner"><svg><use href="#icon-badge-check"></use></svg></span>` : ""}
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
            ${roleSelect}
            <button class="mini-btn warning" data-warn-user="${user.id}" ${canModerateUser ? "" : "disabled"}>
              <svg><use href="#icon-warning"></use></svg>
              Warn
            </button>
            <button class="mini-btn danger" data-ban-user="${user.id}" ${canModerateUser ? "" : "disabled"}>
              <svg><use href="${user.banned ? "#icon-user" : "#icon-ban"}"></use></svg>
              ${user.banned ? "Unban" : "Ban"}
            </button>
          </div>
        </div>
      `;
    }).join("");

    els.adminMembersList.querySelectorAll("[data-role-for]").forEach(select => {
      select.addEventListener("change", () => {
        if (!canManageRoles()) {
          select.value = getUserById(select.dataset.roleFor)?.role || "member";
          return;
        }

        const user = getUserById(select.dataset.roleFor);
        if (!user || user.id === getCurrentUser().id) return;

        const nextRole = select.value;
        if (nextRole === "owner") {
          select.value = user.role;
          showToast("Not allowed", "Owner role can only be kept on the current owner account.");
          return;
        }

        user.role = nextRole;
        if (nextRole === "owner") user.verified = true;
        saveUsers();
        renderAll();
        addSystemMessage("announcements", `${getCurrentUser().displayName} changed ${user.displayName}'s role to ${roleLabel(nextRole)}.`);
        showToast("Role updated", `${user.displayName} is now ${roleLabel(nextRole)}.`);
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
          showToast("Banned", `${user.displayName} reached 3 warnings and was banned.`);
        } else {
          showToast("Warning issued", `${user.displayName} now has ${user.warnings} warning(s).`);
        }

        saveUsers();
        renderAll();

        if (state.currentUser && state.currentUser.id === user.id && user.banned) {
          logout();
        }
      });
    });

    els.adminMembersList.querySelectorAll("[data-ban-user]").forEach(btn => {
      btn.addEventListener("click", () => {
        const user = getUserById(btn.dataset.banUser);
        if (!user || user.role === "owner" || user.id === getCurrentUser().id) return;

        user.banned = !user.banned;
        saveUsers();
        addSystemMessage("announcements", `${getCurrentUser().displayName} ${user.banned ? "banned" : "unbanned"} ${user.displayName}.`);
        showToast(user.banned ? "User banned" : "User unbanned", `${user.displayName} is now ${user.banned ? "banned" : "active"}.`);
        renderAll();

        if (state.currentUser && state.currentUser.id === user.id && user.banned) {
          logout();
        }
      });
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
      ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">`
      : `${escapeHtml(user.displayName[0]?.toUpperCase() || "U")}`;
    els.profileAvatarPreview.style.background = user.avatar ? "transparent" : colorFromName(user.displayName);
  }

  function openProfileModal() {
    renderProfileModal();
    openModal(els.profileModal);
  }

  function openAdminModal() {
    if (!canModerate()) {
      showToast("Access denied", "Only the owner or staff can open the admin panel.");
      return;
    }
    renderAdminMembers();
    els.announcementText.value = "";
    openModal(els.adminModal);
  }

  function renderAll() {
    const user = getCurrentUser();
    if (user) {
      state.currentUser = user;
    }

    if (!state.currentUser) {
      document.body.classList.remove("logged-in");
      return;
    }

    if (state.currentUser.banned) {
      showToast("Account blocked", "This account is banned.");
      logout();
      return;
    }

    document.body.classList.add("logged-in");
    document.body.classList.remove("logged-out");

    renderClock();
    renderSidebarUser();
    renderChannelHeader();
    renderChannels();
    renderMessages();
    renderMemberCount();
    renderAdminAccess();

    if (state.activeChannel) {
      state.settings.readAt[state.activeChannel] = Date.now();
      saveSettings();
      renderUnreadBadges();
    }
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
    state.settings.readAt[state.activeChannel] = Date.now();
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
      showToast("Invalid file", "Please choose an image file.");
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

  function saveProfile() {
    const user = getCurrentUser();
    if (!user) return;

    const name = els.profileName.value.trim();
    const bio = els.profileBio.value.trim();
    const avatar = els.profileAvatarUrl.value.trim();

    if (!name) {
      showToast("Missing name", "Display name cannot be empty.");
      return;
    }

    const duplicate = users.some(u => u.id !== user.id && u.displayName.toLowerCase() === name.toLowerCase());
    if (duplicate) {
      showToast("Name taken", "Another member already uses that display name.");
      return;
    }

    user.displayName = name;
    user.bio = bio;
    user.avatar = avatar;
    saveUsers();

    state.currentUser = user;
    renderAll();
    renderProfileModal();
    showToast("Profile saved", "Your profile changes were updated.");
    closeModal(els.profileModal);
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

    if (users.some(u => u.email.toLowerCase() === email)) {
      showToast("Email used", "That email is already registered.");
      return;
    }

    if (users.some(u => u.displayName.toLowerCase() === name.toLowerCase())) {
      showToast("Name used", "That display name is already registered.");
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
    showToast("Account created", "Your Studio X account is ready.");
  }

  function handleLogin() {
    const identity = els.loginIdentity.value.trim().toLowerCase();
    const password = els.loginPassword.value;

    if (!identity || !password) {
      showToast("Missing fields", "Enter your email/username and password.");
      return;
    }

    const user = users.find(u => !u.banned && u.password === password && (u.email.toLowerCase() === identity || u.displayName.toLowerCase() === identity));
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
    document.body.classList.add("logged-out");
    setSidebar(false);
    closeModal(els.profileModal);
    closeModal(els.adminModal);
    showToast("Logged out", "You have been signed out.");
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

  function bindEvents() {
    els.authModeButtons.forEach(btn => {
      btn.addEventListener("click", () => toggleAuthMode(btn.dataset.authMode));
    });

    els.authForm.addEventListener("submit", e => {
      e.preventDefault();
      if (state.authMode === "login") handleLogin();
      else handleSignup();
    });

    els.channelButtons.forEach(btn => {
      btn.addEventListener("click", () => setActiveChannel(btn.dataset.channel));
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
        showToast("Invalid file", "Please choose an image file.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        state.profileDraftAvatar = String(reader.result || "");
        els.profileAvatarUrl.value = state.profileDraftAvatar;
        els.profileAvatarPreview.innerHTML = `<img class="avatar-img" src="${escapeHtml(state.profileDraftAvatar)}" alt="Avatar preview">`;
      };
      reader.readAsDataURL(file);
    });

    els.uploadAvatarBtn.addEventListener("click", () => els.profileAvatarFile.click());
    els.resetAvatarBtn.addEventListener("click", () => {
      els.profileAvatarUrl.value = "";
      state.profileDraftAvatar = "";
      const user = getCurrentUser();
      els.profileAvatarPreview.style.background = colorFromName(user?.displayName || "U");
      els.profileAvatarPreview.textContent = user?.displayName?.[0]?.toUpperCase() || "U";
      els.profileAvatarPreview.innerHTML = user?.avatar
        ? `<img class="avatar-img" src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.displayName)}">`
        : (user?.displayName?.[0]?.toUpperCase() || "U");
    });

    els.saveProfileBtn.addEventListener("click", saveProfile);

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

    els.sendAnnouncementBtn.addEventListener("click", () => {
      const user = getCurrentUser();
      if (!user || !canModerate()) {
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
        userId: user.id,
        text,
        createdAt: Date.now(),
        announcement: true
      });

      saveMessages();
      els.announcementText.value = "";
      state.settings.readAt.announcements = Date.now();
      saveSettings();
      renderAll();
      addSystemMessage("announcements", `${user.displayName} posted an announcement.`);
      showToast("Announcement sent", "The announcement was posted to #announcements.");
      closeModal(els.adminModal);
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        setSidebar(false);
        closeModal(els.profileModal);
        closeModal(els.adminModal);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        document.body.classList.remove("sidebar-open");
      }
    });
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
    toggleAuthMode("login");
    renderClock();
    renderAll();

    if (!state.currentUser) {
      document.body.classList.add("logged-out");
      document.body.classList.remove("logged-in");
    } else {
      state.settings.readAt[state.activeChannel] = Date.now();
      saveSettings();
      renderUnreadBadges();
      renderMemberCount();
    }

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
