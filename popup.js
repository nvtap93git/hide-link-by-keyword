const input = document.getElementById('keywordInput');
const addBtn = document.getElementById('addBtn');
const keywordsList = document.getElementById('keywordsList');
const manageTab = document.getElementById('manageTab');
const addTab = document.getElementById('addTab');
const manageTabContent = document.getElementById('manageTabContent');
const addTabContent = document.getElementById('addTabContent');

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

function switchTab(tab) {
    if (tab === 'add') {
        addTab.classList.add('active');
        manageTab.classList.remove('active');
        addTabContent.classList.add('active');
        manageTabContent.classList.remove('active');
    } else {
        addTab.classList.remove('active');
        manageTab.classList.add('active');
        addTabContent.classList.remove('active');
        manageTabContent.classList.add('active');
        loadKeywords(); // Refresh list when switching to manage tab
    }
}

addBtn.addEventListener('click', addKeyword);
input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addKeyword();
    }
});
addTab.addEventListener('click', () => switchTab('add'));
manageTab.addEventListener('click', () => switchTab('manage'));

// Load when popup opened
loadKeywords();
