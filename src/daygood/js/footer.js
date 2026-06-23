document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    fetch('components/footer_daygood.html')
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(data => {
            // Replace constants
            let html = data.replace('{{androidLink}}', DAYGOOD_CONSTANTS.androidLink || '#');
            html = html.replace('{{iosLink}}', DAYGOOD_CONSTANTS.iosLink || '#');
            html = html.replace('{{contactEmail}}', DAYGOOD_CONSTANTS.contactEmail || '');
            
            container.innerHTML = html;

            // Trigger translation update if language script is ready
            if (typeof window.setLanguage === 'function') {
                const currentLang = localStorage.getItem('daygood_lang') || 'en';
                window.setLanguage(currentLang);
            }
        })
        .catch(err => {
            console.error('Error loading footer:', err);
            container.innerHTML = '<p style="text-align:center; padding:20px;">[Footer cannot be previewed directly from file:// protocol. Use a local server.]</p>';
        });
});
