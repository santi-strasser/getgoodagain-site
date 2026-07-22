(function () {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var BASE = 100;
  var MIN_PX = 22;
  var MAX_PX = 320;

  function linesOf(el) {
    var clone = el.cloneNode(true);
    var svgs = clone.querySelectorAll('svg');
    for (var i = 0; i < svgs.length; i++) svgs[i].remove();
    var html = clone.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    var text = html.replace(/<[^>]+>/g, '');
    var div = document.createElement('div');
    div.innerHTML = text;
    var decoded = div.textContent || '';
    return decoded.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
  }

  function availableWidth(el) {
    var parent = el.parentElement;
    var pcs = getComputedStyle(parent);
    var width = parent.clientWidth - parseFloat(pcs.paddingLeft || 0) - parseFloat(pcs.paddingRight || 0);

    var isRowFlex = (pcs.display === 'flex' || pcs.display === 'inline-flex') &&
      (pcs.flexDirection === 'row' || pcs.flexDirection === 'row-reverse');

    if (isRowFlex) {
      var siblings = Array.prototype.filter.call(parent.children, function (c) { return c !== el; });
      var gap = parseFloat(pcs.columnGap || pcs.gap || 0) || 0;
      siblings.forEach(function (sib) {
        width -= sib.getBoundingClientRect().width;
      });
      width -= gap * (parent.children.length - 1);
    }

    var elCs = getComputedStyle(el);
    var ownMax = parseFloat(elCs.maxWidth);
    if (!isNaN(ownMax) && ownMax < width) width = ownMax;

    return width;
  }

  function fit(el) {
    var available = availableWidth(el);
    if (!available || available <= 0) return;

    var elCs = getComputedStyle(el);
    var upper = elCs.textTransform === 'uppercase';
    var letterSpacing = parseFloat(elCs.letterSpacing) || 0;

    ctx.font = elCs.fontWeight + ' ' + BASE + 'px ' + elCs.fontFamily;
    if ('letterSpacing' in ctx) ctx.letterSpacing = (letterSpacing * (BASE / parseFloat(elCs.fontSize))) + 'px';

    var lines = linesOf(el);
    if (!lines.length) return;

    var maxWidth = 0;
    lines.forEach(function (line) {
      var t = upper ? line.toUpperCase() : line;
      var w = ctx.measureText(t).width;
      if (w > maxWidth) maxWidth = w;
    });
    if (!maxWidth) return;

    var SAFETY = 0.96;
    var newSize = (available / maxWidth) * BASE * SAFETY;
    newSize = Math.max(MIN_PX, Math.min(MAX_PX, newSize));
    el.style.fontSize = newSize + 'px';
  }

  function fitAll() {
    document.querySelectorAll('.fit-text').forEach(fit);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitAll);
  }
  window.addEventListener('DOMContentLoaded', fitAll);
  window.addEventListener('load', fitAll);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(fitAll, 100);
  });
})();
