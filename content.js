function normalizeText(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function hideBadElements(bannedKeywords = []) {
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

    // Hide <img> tags with alt attribute containing banned keyword
    const images = document.querySelectorAll('img[alt]');
    images.forEach(img => {
        const altText = normalizeText(img.getAttribute('alt') || '');
        for (const keyword of bannedKeywords) {
            const normalizedKeyword = normalizeText(keyword);
            // Use includes for each word in the keyword
            if (normalizedKeyword.split(' ').every(word => word && altText.includes(word))) {
                img.style.display = 'none';
                break;
            }
        }
    });

    // Hide elements with class 'message-user' on voz.vn
    if (window.location.hostname.includes('voz.vn')) {
        const messageUserElements = document.querySelectorAll('.message-avatar');
        messageUserElements.forEach(element => {
            element.style.visibility = 'hidden';
        });
    }
}

// Fetch banned keywords from Chrome Storage
function loadKeywordsAndHide() {
    // Check if chrome.storage is available
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get({ bannedKeywords: [] }, (result) => {
            hideBadElements(result.bannedKeywords);
        });
    } else {
        // Just hide the elements with class 'message-avatar' on voz.vn without keywords
        hideBadElements([]);
    }
}

// Run when the page loads
window.addEventListener('load', loadKeywordsAndHide);

// Also run on DOM content loaded to catch dynamic content
document.addEventListener('DOMContentLoaded', loadKeywordsAndHide);

// Handle dynamic content by periodically checking
const observer = new MutationObserver(() => {
    loadKeywordsAndHide();
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

