const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const serverName = document.getElementById("serverName");
const activeChannelTitle = document.getElementById("activeChannelTitle");
const activeChannelSubtitle = document.getElementById("activeChannelSubtitle");
const searchInput = document.getElementById("searchInput");

const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalForm = document.getElementById("modalForm");
const modalEyebrow = document.getElementById("modalEyebrow");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalActionBtn = document.getElementById("modalActionBtn");
const serverInput = document.getElementById("serverInput");
const descriptionInput = document.getElementById("descriptionInput");

const createServerBtn = document.getElementById("createServerBtn");
const createServerTopBtn = document.getElementById("createServerTopBtn");
const quickCreateBtn = document.getElementById("quickCreateBtn");
const openCreateServerBtn = document.getElementById("openCreateServerBtn");

const joinServerBtn = document.getElementById("joinServerBtn");
const joinServerTopBtn = document.getElementById("joinServerTopBtn");
const quickJoinBtn = document.getElementById("quickJoinBtn");

const tabButtons = document.querySelectorAll(".tab-btn");
const panelContents = document.querySelectorAll(".panel-content");
const channelButtons = document.querySelectorAll(".channel-btn");
const miniLinks = document.querySelectorAll(".mini-link");
const serverIcons = document.querySelectorAll(".server-icon");

const searchableItems = document.querySelectorAll("[data-searchable]");
const toast = document.createElement("div");
toast.className = "toast";
document.body.appendChild(toast);

let modalMode = "create";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openModal(mode = "create") {
  modalMode = mode;

  if (mode === "create") {
    modalEyebrow.textContent = "Create a Server";
    modalTitle.textContent = "Build your community";
    modalText.textContent = "Create a new community space for your members, channels, and announcements.";
    modalActionBtn.textContent = "Create Now";
    serverInput.placeholder = "Enter server name";
    descriptionInput.placeholder = "Write a short description";
  } else {
    modalEyebrow.textContent = "Join a Server";
    modalTitle.textContent = "Enter an invite code";
    modalText.textContent = "Join an existing community with a server code or invite link.";
    modalActionBtn.textContent = "Join Now";
    serverInput.placeholder = "Enter invite code";
    descriptionInput.placeholder = "Optional note";
  }

  modalBackdrop.classList.add("show");
  modalBackdrop.setAttribute("aria-hidden", "false");
  setTimeout(() => serverInput.focus(), 50);
}

function closeModal() {
  modalBackdrop.classList.remove("show");
  modalBackdrop.setAttribute("aria-hidden", "true");
}

function setActiveTab(tabName) {
  tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tabName));
  panelContents.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === tabName));
  channelButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.channel === tabName));
  miniLinks.forEach((link) => link.classList.toggle("active", link.dataset.panel === tabName));

  const labels = {
    announcements: {
      title: "# announcements",
      subtitle: "Latest updates, featured posts, and community highlights",
    },
    general: {
      title: "# general chat",
      subtitle: "Talk with members in the main community space",
    },
    media: {
      title: "# media",
      subtitle: "Share screenshots, artwork, and creative previews",
    },
    suggestions: {
      title: "# suggestions",
      subtitle: "Vote on ideas and help improve the community",
    },
    world: {
      title: "# world chat",
      subtitle: "Chat with members across the community",
    },
  };

  const active = labels[tabName] || labels.announcements;
  activeChannelTitle.textContent = active.title;
  activeChannelSubtitle.textContent = active.subtitle;

  applySearchFilter(searchInput.value.trim().toLowerCase());
}

function applySearchFilter(query) {
  searchableItems.forEach((item) => {
    const text = item.dataset.searchable || item.textContent || "";
    const match = text.toLowerCase().includes(query);
    item.classList.toggle("hidden", query.length > 0 && !match);
  });
}

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  const clickedInsideSidebar = sidebar.contains(event.target) || menuToggle.contains(event.target);
  const clickedInsideModal = modalBackdrop.contains(event.target) && !event.target.classList.contains("modal-backdrop");

  if (!clickedInsideSidebar && window.innerWidth <= 920) {
    sidebar.classList.remove("open");
  }

  if (event.target === modalBackdrop) {
    closeModal();
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

channelButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.channel));
});

miniLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveTab(link.dataset.panel));
});

serverIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    serverIcons.forEach((btn) => btn.classList.remove("active"));
    icon.classList.add("active");
    serverName.textContent = icon.dataset.server;
    showToast(`Switched to ${icon.dataset.server}`);
  });
});

searchInput.addEventListener("input", (e) => {
  applySearchFilter(e.target.value.trim().toLowerCase());
});

createServerBtn.addEventListener("click", () => openModal("create"));
createServerTopBtn.addEventListener("click", () => openModal("create"));
quickCreateBtn.addEventListener("click", () => openModal("create"));
openCreateServerBtn.addEventListener("click", () => openModal("create"));

joinServerBtn.addEventListener("click", () => openModal("join"));
joinServerTopBtn.addEventListener("click", () => openModal("join"));
quickJoinBtn.addEventListener("click", () => openModal("join"));

closeModalBtn.addEventListener("click", closeModal);

modalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameValue = serverInput.value.trim();
  const descriptionValue = descriptionInput.value.trim();

  if (!nameValue) {
    showToast(modalMode === "create" ? "Please enter a server name." : "Please enter an invite code.");
    serverInput.focus();
    return;
  }

  if (modalMode === "create") {
    showToast(`Server "${nameValue}" created successfully.`);
    serverName.textContent = nameValue;
  } else {
    showToast(`Joined server using invite: ${nameValue}`);
    serverName.textContent = "Studio Lite Community";
  }

  if (descriptionValue) {
    console.log("Description:", descriptionValue);
  }

  serverInput.value = "";
  descriptionInput.value = "";
  closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    sidebar.classList.remove("open");
  }
});

setActiveTab("announcements");
applySearchFilter("");
