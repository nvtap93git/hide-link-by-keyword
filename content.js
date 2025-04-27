function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function hideBadElements(bannedKeywords) {
    // Select both <a> and <p> tags
    const elements = document.querySelectorAll('a, p');

    elements.forEach(element => {
        const elementText = normalizeText(element.textContent);
        const elementHref = element.href ? normalizeText(element.href) : '';

        for (const keyword of bannedKeywords) {
            const normalizedKeyword = normalizeText(keyword);

            // If either text or href (for <a>) contains banned word
            if (elementText.includes(normalizedKeyword) || elementHref.includes(normalizedKeyword)) {
                element.style.display = 'none'; // Hide the element
                break;
            }
        }
    });
}

// Fetch banned keywords from Chrome Storage
function loadKeywordsAndHide() {
    chrome.storage.local.get({ bannedKeywords: [] }, (result) => {
        hideBadElements(result.bannedKeywords);
    });
}

// Run when the page loads
window.addEventListener('load', loadKeywordsAndHide);
