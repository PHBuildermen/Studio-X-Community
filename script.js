// Mock Database Context Store for Dynamic Channel Population
const channelMockData = {
    announcements: {
        title: "announcements",
        icon: "fa-bullhorn",
        desc: "Official news and updates regarding Studio Lite.",
        messages: [
            { author: "System_Admin", avatarColor: "#6366f1", text: "Welcome to the launch of **Studio Lite Community** platform! This design uses pure vanilla technology architectures.", isCard: false },
            { author: "Design_Lead", avatarColor: "#ec4899", text: "Check out our newest framework roadmap down below.", isCard: true, cardTitle: "Production Release Status", cardBody: "Version 1.0 architecture is complete. Fully responsive layouts optimized for mobile displays are now active globally." }
        ]
    },
    rules: {
        title: "rules-and-info",
        icon: "fa-gavel",
        desc: "The code of conduct for our collaborative environment.",
        messages: [
            { author: "System_Admin", avatarColor: "#6366f1", text: "1. Be respectful to all members.\n2. No spam or unauthorized promotional materials.\n3. Keep topics matching room parameters.", isCard: false }
        ]
    },
    general: {
        title: "general-chat",
        icon: "fa-hashtag",
        desc: "Casual conversation sandbox for verified profiles.",
        messages: [
            { author: "User_Alpha", avatarColor: "#14b8a6", text: "Hey folks! Is anyone currently working on CSS grid deployments?", isCard: false },
            { author: "Dev_Beta", avatarColor: "#f59e0b", text: "Yeah! It pairs incredibly well with vanilla variables layout properties.", isCard: false }
        ]
    },
    media: {
        title: "media-share",
        icon: "fa-camera",
        desc: "Post design inspiration snapshots here.",
        messages: [
            { author: "UI_Explorer", avatarColor: "#a855f7", text: "Just posted a clean UI palette on my personal production dashboard profile.", isCard: false }
        ]
    },
    suggestions: {
        title: "suggestions",
        icon: "fa-lightbulb",
        desc: "Leave platform feature iterations here.",
        messages: [
            { author: "User_Alpha", avatarColor: "#14b8a6", text: "Suggestion: Add an integrated dark-mode code block presentation engine.", isCard: false }
        ]
    },
    world: {
        title: "world-chat",
        icon: "fa-globe",
        desc: "Global space connecting developers from around the cosmos.",
        messages: [
            { author: "Global_Node", avatarColor: "#ef4444", text: "Hello from Tokyo! Weather is perfect for coding today.", isCard: false }
        ]
    }
};

// Application State Management
let currentChannelId = "announcements";

// DOM Node Selectors
const appContainer = document.querySelector('.app-container');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const channelItems = document.querySelectorAll('.channel-item');
const chatViewport = document.getElementById('chatViewport');
const messageForm = document.getElementById('messageForm');
const messageInputField = document.getElementById('messageInputField');

// Channel Presentation Elements
const currentChannelIcon = document.getElementById('currentChannelIcon');
const currentChannelTitle = document.getElementById('currentChannelTitle');
const currentChannelDesc = document.getElementById('currentChannelDesc');

// Modal Elements
const createServerModal = document.getElementById('createServerModal');
const openCreateModalBtn = document.getElementById('openCreateModal');
const closeCreateModalBtn = document.getElementById('closeCreateModal');
const cancelCreateModalBtn = document.getElementById('cancelCreateModal');
const submitCreateModalBtn = document.getElementById('submitCreateModal');
const joinServerBtn = document.getElementById('joinServerBtn');
const mobileJoinBtn = document.getElementById('mobileJoinBtn');

// App Initialization Logic
document.addEventListener("DOMContentLoaded", () => {
    loadChannelData(currentChannelId);
    setupEventListeners();
});

// Primary Event Coordination Configuration
function setupEventListeners() {
    // Mobile Drawer Interactions Toggle Mechanism
    mobileMenuBtn.addEventListener('click', () => appContainer.classList.toggle('nav-open'));
    sidebarOverlay.addEventListener('click', () => appContainer.classList.remove('nav-open'));

    // Dynamic Navigation Content Processing
    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            channelItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            currentChannelId = item.getAttribute('data-channel');
            loadChannelData(currentChannelId);
            
            // Auto close drawer menu components on mobile viewports
            appContainer.classList.remove('nav-open');
        });
    });

    // Message Forwarding Simulator Handling
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msgText = messageInputField.value.trim();
        if (!msgText) return;

        // Push element variables block arrays onto local mock context
        const newMsg = { author: "Guest_User", avatarColor: "#6366f1", text: msgText, isCard: false };
        channelMockData[currentChannelId].messages.push(newMsg);
        
        appendMessageElement(newMsg);
        messageInputField.value = "";
        scrollToChatBottom();
    });

    // Modular Window Management Operations Trigger Hooks
    openCreateModalBtn.addEventListener('click', () => createServerModal.classList.add('open'));
    closeCreateModalBtn.addEventListener('click', () => createServerModal.classList.remove('open'));
    cancelCreateModalBtn.addEventListener('click', () => createServerModal.classList.remove('open'));
    
    submitCreateModalBtn.addEventListener('click', () => {
        alert("Success! Your Studio Community Server instance has been generated.");
        createServerModal.classList.remove('open');
    });

    // Global Interactive Action Handlers
    const handleJoinAction = () => alert("Initiating connection handshake protocol to server cluster...");
    joinServerBtn.addEventListener('click', handleJoinAction);
    mobileJoinBtn.addEventListener('click', handleJoinAction);
}

// UI Thread Renderer Actions Engine
function loadChannelData(channelId) {
    const data = channelMockData[channelId];
    if (!data) return;

    // Redraw Context Node Elements Structural Mapping
    currentChannelIcon.className = `fa-solid ${data.icon} channel-header-icon`;
    currentChannelTitle.textContent = data.title;
    currentChannelDesc.textContent = data.desc;
    messageInputField.placeholder = `Message #${data.title}`;

    // Clear feed container elements and map new array data elements
    chatViewport.innerHTML = "";
    data.messages.forEach(msg => appendMessageElement(msg));
    scrollToChatBottom();
}

function appendMessageElement(msg) {
    const cardMarkup = msg.isCard ? `
        <div class="announcement-card">
            <h3>${msg.cardTitle}</h3>
            <p>${msg.cardBody}</p>
        </div>
    ` : '';

    const messageHtml = `
        <div class="message-card">
            <div class="msg-avatar" style="background-color: ${msg.avatarColor}">
                ${msg.author.charAt(0).toUpperCase()}
            </div>
            <div class="msg-content-wrapper">
                <div class="msg-metadata">
                    <span class="msg-author">${msg.author}</span>
                    <span class="msg-timestamp">Today at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="msg-body">
                    ${msg.text.replace(/\n/g, '<br>')}
                    ${cardMarkup}
                </div>
            </div>
        </div>
    `;
    chatViewport.insertAdjacentHTML('beforeend', messageHtml);
}

function scrollToChatBottom() {
    chatViewport.scrollTop = chatViewport.scrollHeight;
}
