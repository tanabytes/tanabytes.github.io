/*
  Traduzioni delle landing (italiano / inglese), senza fetch: funziona anche aprendo i file in locale.
  La pagina definisce window.TB_I18N = { it: {...}, en: {...} } prima di caricare questo script.
  - data-i18n="chiave"              -> innerHTML
  - data-i18n-attr="alt:chiave;src:chiave2" -> attributi
  - data-lang-set="it"              -> pulsante che cambia lingua
  Ogni cambio di lingua lancia l'evento "langchange" su document.
*/
(function () {
  var dict = window.TB_I18N || {};
  var KEY = 'site_lang';

  function initial() {
    try {
      var saved = localStorage.getItem(KEY) || localStorage.getItem('daygood_lang');
      if (saved && dict[saved]) return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return nav === 'it' ? 'it' : 'en';
  }

  function apply(lang) {
    var t = dict[lang];
    if (!t) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t[el.getAttribute('data-i18n')];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        if (t[p[1]] != null) el.setAttribute(p[0], t[p[1]]);
      });
    });
    document.querySelectorAll('[data-lang-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-set') === lang));
    });
    if (t.page_title) document.title = t.page_title;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang-set]');
    if (b) apply(b.getAttribute('data-lang-set'));
  });

  window.tbLang = { apply: apply, current: function () { return document.documentElement.lang; } };
  apply(initial());
})();
