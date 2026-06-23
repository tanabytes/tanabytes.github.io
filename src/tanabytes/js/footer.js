document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    fetch('components/footer_tanabytes.html')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(data => {
            container.innerHTML = data;
            
            // Re-trigger translation for footer elements
            if (typeof window.setLanguage === 'function') {
                const currentLang = localStorage.getItem('site_lang') || 'en';
                window.setLanguage(currentLang);
            }
        })
        .catch(err => {
            console.error('Error loading footer:', err);
        });
});
