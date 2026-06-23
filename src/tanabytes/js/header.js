document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('header-container');
    if (!container) return;

    fetch('components/header_tanabytes.html')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(data => {
            container.innerHTML = data;

            // Trigger translation update if language script is ready
            if (typeof window.setLanguage === 'function') {
                const currentLang = localStorage.getItem('site_lang') || 'en';
                window.setLanguage(currentLang);
                if (typeof window.attachLangHandlers === 'function') {
                    window.attachLangHandlers();
                }
            }
        })
        .catch(err => {
            console.error('Error loading header:', err);
        });
});
