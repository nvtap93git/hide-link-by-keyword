const input = document.getElementById('keywordInput');
const addBtn = document.getElementById('addBtn');
const keywordsList = document.getElementById('keywordsList');
const manageTab = document.getElementById('manageTab');
const addTab = document.getElementById('addTab');
const manageTabContent = document.getElementById('manageTabContent');
const addTabContent = document.getElementById('addTabContent');

// Elements for URL blocking
const blockUrlTab = document.getElementById('blockUrlTab');
const manageUrlTab = document.getElementById('manageUrlTab');
const blockUrlTabContent = document.getElementById('blockUrlTabContent');
const manageUrlTabContent = document.getElementById('manageUrlTabContent');
const blockUrlInput = document.getElementById('blockUrlInput');
const redirectUrlInput = document.getElementById('redirectUrlInput');
const addUrlBtn = document.getElementById('addUrlBtn');
const blockedUrlsList = document.getElementById('blockedUrlsList');

// Load the saved redirect URL when opening popup
function loadRedirectUrl() {
    chrome.storage.local.get({ redirectUrl: '' }, (result) => {
        redirectUrlInput.value = result.redirectUrl || '';
    });
}

// Save redirect URL when it changes
function saveRedirectUrl() {
    const redirectUrl = redirectUrlInput.value.trim();
    chrome.storage.local.set({ redirectUrl });
}

function renderKeywords(keywords) {
    keywordsList.innerHTML = '';
    keywords.forEach((keyword, index) => {
        const li = document.createElement('li');
        li.textContent = keyword;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => removeKeyword(index));
        keywordsList.appendChild(li);
    });
}

function loadKeywords() {
    chrome.storage.local.get({ bannedKeywords: [] }, (result) => {
        renderKeywords(result.bannedKeywords);
    });
}

function addKeyword() {
    const newKeyword = input.value.trim();
    if (newKeyword === '') return;

    chrome.storage.local.get({ bannedKeywords: [] }, (result) => {
        const keywords = result.bannedKeywords;
        keywords.push(newKeyword.toLowerCase());
        chrome.storage.local.set({ bannedKeywords: keywords }, () => {
            input.value = '';
            loadKeywords();
        });
    });
}

function removeKeyword(index) {
    chrome.storage.local.get({ bannedKeywords: [] }, (result) => {
        const keywords = result.bannedKeywords;
        keywords.splice(index, 1); // Remove 1 item at index
        chrome.storage.local.set({ bannedKeywords: keywords }, () => {
            loadKeywords();
        });
    });
}

// Functions for URL blocking
function renderBlockedUrls(blockedUrls) {
    blockedUrlsList.innerHTML = '';
    blockedUrls.forEach((url, index) => {
        const li = document.createElement('li');
        li.className = 'url-entry';

        const urlInfo = document.createElement('div');
        urlInfo.innerHTML = `<strong>${url}</strong>`;
        li.appendChild(urlInfo);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => removeBlockedUrl(index));
        li.appendChild(deleteBtn);

        blockedUrlsList.appendChild(li);
    });
}

function loadBlockedUrls() {
    chrome.storage.local.get({ blockedUrls: [] }, (result) => {
        renderBlockedUrls(result.blockedUrls);
    });
}

function addBlockedUrl() {
    const newUrl = blockUrlInput.value.trim();
    if (newUrl === '') return;

    chrome.storage.local.get({ blockedUrls: [] }, (result) => {
        const blockedUrls = result.blockedUrls;
        blockedUrls.push(newUrl);
        chrome.storage.local.set({ blockedUrls }, () => {
            blockUrlInput.value = '';
            loadBlockedUrls();
        });
    });
}

function removeBlockedUrl(index) {
    chrome.storage.local.get({ blockedUrls: [] }, (result) => {
        const blockedUrls = result.blockedUrls;
        blockedUrls.splice(index, 1);
        chrome.storage.local.set({ blockedUrls }, () => {
            loadBlockedUrls();
        });
    });
}

function switchTab(tab) {
    // Hide all tabs and content
    [addTab, manageTab, blockUrlTab, manageUrlTab].forEach(t => t.classList.remove('active'));
    [addTabContent, manageTabContent, blockUrlTabContent, manageUrlTabContent].forEach(c => c.classList.remove('active'));

    // Activate the selected tab
    switch(tab) {
        case 'add':
            addTab.classList.add('active');
            addTabContent.classList.add('active');
            break;
        case 'manage':
            manageTab.classList.add('active');
            manageTabContent.classList.add('active');
            loadKeywords();
            break;
        case 'blockUrl':
            blockUrlTab.classList.add('active');
            blockUrlTabContent.classList.add('active');
            break;
        case 'manageUrl':
            manageUrlTab.classList.add('active');
            manageUrlTabContent.classList.add('active');
            loadBlockedUrls();
            loadRedirectUrl();
            break;
    }
}

addBtn.addEventListener('click', addKeyword);
input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addKeyword();
    }
});

// Event listeners for URL blocking
addUrlBtn.addEventListener('click', addBlockedUrl);
blockUrlInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addBlockedUrl();
    }
});

// Save redirect URL when it changes
redirectUrlInput.addEventListener('change', saveRedirectUrl);
redirectUrlInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        saveRedirectUrl();
    }
});

// Tab switching event listeners
addTab.addEventListener('click', () => switchTab('add'));
manageTab.addEventListener('click', () => switchTab('manage'));
blockUrlTab.addEventListener('click', () => switchTab('blockUrl'));
manageUrlTab.addEventListener('click', () => switchTab('manageUrl'));

// Load when popup opened
loadKeywords();
