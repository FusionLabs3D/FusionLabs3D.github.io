/**
 * FusionLabs3D — Anti-Scraper Contact Shield
 * Protects personal contact details from web crawlers, text harvesters, and regex scrapers.
 */
(function() {
  // Obfuscated contact endpoint stored as char codes to avoid raw phone digits in code
  var _cc = [57, 49, 56, 57, 52, 57, 51, 51, 48, 52, 53, 48];
  
  function getTarget() {
    return String.fromCharCode.apply(null, _cc);
  }

  function getWhatsAppUrl(msg) {
    var text = encodeURIComponent(msg || 'Hi, I have a 3D printing inquiry');
    return 'https://wa.me/' + getTarget() + '?text=' + text;
  }

  function launchWhatsApp(msg) {
    var url = getWhatsAppUrl(msg);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function setupTriggers() {
    var triggers = document.querySelectorAll('[data-wa]');
    triggers.forEach(function(el) {
      el.setAttribute('href', '#');
      el.setAttribute('rel', 'nofollow noopener noreferrer');
      
      // Update href dynamically on user interaction so right-click/long-press works seamlessly
      function attachDynamicHref() {
        var msg = el.getAttribute('data-wa-msg') || 'Hi, I have a 3D printing inquiry';
        el.href = getWhatsAppUrl(msg);
      }

      el.addEventListener('mouseenter', attachDynamicHref);
      el.addEventListener('focus', attachDynamicHref);
      el.addEventListener('touchstart', attachDynamicHref, { passive: true });

      // Click handler ensures instant redirect on both desktop and mobile
      el.addEventListener('click', function(e) {
        var msg = el.getAttribute('data-wa-msg') || 'Hi, I have a 3D printing inquiry';
        attachDynamicHref();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTriggers);
  } else {
    setupTriggers();
  }

  window.fusionLabsContact = {
    chat: launchWhatsApp
  };
})();
