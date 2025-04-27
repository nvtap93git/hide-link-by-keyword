const input = document.getElementById('keywordInput');
const addBtn = document.getElementById('addBtn');
const keywordsList = document.getElementById('keywordsList');

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

addBtn.addEventListener('click', addKeyword);

// Load when popup opened
loadKeywords();
