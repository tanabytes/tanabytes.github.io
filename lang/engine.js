(async function() {
    // Determine the base URL for the locales directory based on the engine.js script path
    const engineScript = document.currentScript;
    let engineUrl = '';
    if (engineScript && engineScript.src) {
        engineUrl = engineScript.src;
    } else {
        // Fallback for browsers that don't support document.currentScript well
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf('lang/engine.js') !== -1) {
                engineUrl = scripts[i].src;
                break;
            }
        }
    }
    
    // If we couldn't find the path, fallback to a relative path
    const localesBaseUrl = engineUrl ? engineUrl.replace('engine.js', 'locales/') : '../../lang/locales/';

    window.translations = window.translations || {};

    async function loadLanguage(lang) {
        if (!window.translations[lang]) {
            try {
                const response = await fetch(localesBaseUrl + lang + '.json');
                if (!response.ok) throw new Error("Network response was not ok");
                window.translations[lang] = await response.json();
            } catch (err) {
                console.error("Failed to load translation for " + lang, err);
                return false;
            }
        }
        return true;
    }

    window.setLanguage = async function(lang) {
        const loaded = await loadLanguage(lang);
        if (!loaded) return;

        // Update all translatable elements based on data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            const key = el.getAttribute('data-i18n');
            let text = window.translations[lang][key];
            if (text) {
                // Replace constants if any
                if (text.includes('{{contactEmail}}')) {
                    const email = (typeof DAYGOOD_CONSTANTS !== 'undefined' && DAYGOOD_CONSTANTS.contactEmail) ? DAYGOOD_CONSTANTS.contactEmail : 'support@tanabytes.com';
                    text = text.replace(/\{\{contactEmail\}\}/g, email);
                }

                if (el.tagName === 'TITLE') {
                    el.textContent = text;
                } else {
                    el.innerHTML = text;
                }
            }
        });

        // Update html lang attribute
        const htmlRoot = document.getElementById('html-root') || document.documentElement;
        if (htmlRoot) htmlRoot.setAttribute('lang', lang);

        // Update active button state
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector('.lang-btn[data-lang="' + lang + '"]');
        if (activeBtn) activeBtn.classList.add('active');

        // Persist choice (we use 'site_lang' globally)
        try { 
            localStorage.setItem('site_lang', lang); 
            // Also keep 'daygood_lang' in sync for backwards compatibility
            localStorage.setItem('daygood_lang', lang); 
        } catch(e) {}
    }

    // Function to attach handlers
    window.attachLangHandlers = function() {
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            if (!btn.dataset.langAttached) {
                btn.addEventListener('click', function() {
                    window.setLanguage(this.getAttribute('data-lang'));
                });
                btn.dataset.langAttached = 'true';
            }
        });
    };

    // Attach immediately in case DOM is already parsed
    window.attachLangHandlers();
    // Also attach on DOMContentLoaded in case script is loaded in head
    document.addEventListener("DOMContentLoaded", window.attachLangHandlers);

    // Initialize: load saved language or detect browser language
    let savedLang;
    try { savedLang = localStorage.getItem('site_lang') || localStorage.getItem('daygood_lang'); } catch(e) {}
    
    if (!savedLang) {
        const browserLang = (navigator.language || navigator.userLanguage || 'en').substring(0, 2).toLowerCase();
        savedLang = (browserLang === 'it') ? 'it' : 'en';
    }
    
    await window.setLanguage(savedLang);
})();
