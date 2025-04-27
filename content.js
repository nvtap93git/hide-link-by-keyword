function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function hideBadLinks(bannedKeywords) {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        const linkText = normalizeText(link.textContent);
        const linkHref = normalizeText(link.href);
        for (const keyword of bannedKeywords) {
            const normalizedKeyword = normalizeText(keyword);
            if (linkText.includes(normalizedKeyword) || linkHref.includes(normalizedKeyword)) {
                link.style.display = 'none';
                break;
            }
        }
    });
}

// Fetch banned keywords from Chrome Storage
function loadKeywordsAndHide() {
    chrome.storage.local.get({ bannedKeywords: [] }, (result) => {
        hideBadLinks(result.bannedKeywords);
    });
}

// Run when the page loads
window.addEventListener('load', loadKeywordsAndHide);
