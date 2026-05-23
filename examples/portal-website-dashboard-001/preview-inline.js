/**
 * preview-inline.js — open any template HTML directly in a browser and see
 * populated content, instead of literal {{SLOT}} placeholders.
 *
 * Drop a copy of this file next to your HTML pages. Add this line at the
 * bottom of each page (just before </body>):
 *
 *   <script src="preview-inline.js" defer></script>
 *
 * Then create a `_preview-data.json` next to it with the shape:
 *
 *   {
 *     "copy":      { "HERO_HEADLINE": "Sentences worth keeping", ... },
 *     "photoUrls": { "hero-image": "https://images.unsplash.com/..." },
 *     "photoAlts": { "AUTHOR_PHOTO_ALT": "Lina at her writing desk" }
 *   }
 *
 * When you open the page (file:// or any http server) the script fetches
 * the JSON and substitutes:
 *   - text nodes containing {{SLOT}}            → data.copy[SLOT]
 *   - <img src="{{photo:slot}}">                → data.photoUrls[slot]
 *   - style="background-image:url('{{photo:slot}}')" → same
 *   - <img alt="{{ALT_SLOT}}">                  → data.photoAlts[SLOT] OR data.copy[SLOT]
 *
 * Production note: Vincia's runtime fills slots BEFORE serving, so this
 * script finds no {{}} patterns at production time and is effectively a
 * no-op. It's purely a developer convenience for previewing locally.
 *
 * Failure modes:
 *   - JSON file missing → small banner at top of page, slots stay literal
 *   - JSON parse error → same banner, error logged to console
 *   - Slot in HTML not in data → that slot stays literal (visible miss)
 *   - file:// + Chrome → fetch() of local files may be blocked. Run a tiny
 *     local server instead:
 *       python -m http.server -d <your-folder> 8000
 *       open http://localhost:8000/index.html
 */

(function () {
  'use strict';

  const COPY_RE = /\{\{([A-Z][A-Z0-9_]*)\}\}/g;
  const PHOTO_RE = /\{\{photo:([a-z0-9_-]+)\}\}/g;

  function showBanner(message, kind) {
    const b = document.createElement('div');
    b.id = '__preview_inline_banner';
    b.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:999999',
      'padding:8px 12px', 'font:13px/1.4 system-ui,sans-serif',
      'border-bottom:1px solid rgba(0,0,0,.08)',
      kind === 'error' ? 'background:#fde7e7;color:#7f1d1d' : 'background:#f4ede1;color:#3a2c22',
    ].join(';');
    b.textContent = message;
    document.body.insertBefore(b, document.body.firstChild);
    document.body.style.paddingTop = '40px';
  }

  function fillTextNodes(root, copyMap, photoUrls, photoAlts, missing) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.nodeValue) return NodeFilter.FILTER_REJECT;
        // Skip <script>, <style>, <noscript> — text nodes inside those aren't user-visible content
        const p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName ? p.nodeName.toLowerCase() : '';
        if (tag === 'script' || tag === 'style' || tag === 'noscript') return NodeFilter.FILTER_REJECT;
        if (!COPY_RE.test(n.nodeValue) && !PHOTO_RE.test(n.nodeValue)) {
          // Reset regex lastIndex (since /g) before next call
          COPY_RE.lastIndex = 0;
          PHOTO_RE.lastIndex = 0;
          return NodeFilter.FILTER_REJECT;
        }
        COPY_RE.lastIndex = 0;
        PHOTO_RE.lastIndex = 0;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      let v = node.nodeValue;
      v = v.replace(COPY_RE, (m, slot) => {
        if (copyMap[slot] !== undefined) return String(copyMap[slot]);
        missing.copy.add(slot);
        return m;
      });
      // photo:slot in text node is unusual but possible (e.g. inline mention) — leave literal if missing
      v = v.replace(PHOTO_RE, (m, slot) => {
        if (photoUrls[slot] !== undefined) return String(photoUrls[slot]);
        return m;
      });
      node.nodeValue = v;
    }
  }

  function fillAttributes(root, copyMap, photoUrls, photoAlts, missing) {
    // Walk every element with attribute candidates. We touch:
    //   src, href, style, alt, title, placeholder, content, value
    const ATTRS = ['src', 'href', 'style', 'alt', 'title', 'placeholder', 'content', 'value'];
    const all = root.querySelectorAll('*');
    for (const el of all) {
      for (const attr of ATTRS) {
        if (!el.hasAttribute(attr)) continue;
        const orig = el.getAttribute(attr);
        if (!orig) continue;
        if (!orig.includes('{{')) continue;
        let v = orig;
        v = v.replace(PHOTO_RE, (m, slot) => {
          if (photoUrls[slot] !== undefined) return String(photoUrls[slot]);
          missing.photo.add(slot);
          return m;
        });
        v = v.replace(COPY_RE, (m, slot) => {
          // For alt attr, check photoAlts first (semantically nicer), fall through to copy
          if (attr === 'alt' && photoAlts[slot] !== undefined) return String(photoAlts[slot]);
          if (copyMap[slot] !== undefined) return String(copyMap[slot]);
          missing.copy.add(slot);
          return m;
        });
        if (v !== orig) el.setAttribute(attr, v);
      }
    }
  }

  function fillTitle(copyMap) {
    if (!document.title.includes('{{')) return;
    document.title = document.title
      .replace(PHOTO_RE, (m, slot) => m)
      .replace(COPY_RE, (m, slot) => (copyMap[slot] !== undefined ? String(copyMap[slot]) : m));
  }

  async function main() {
    let data;
    try {
      const res = await fetch('_preview-data.json', { cache: 'no-store' });
      if (!res.ok) {
        showBanner(
          'preview-inline: _preview-data.json not found (HTTP ' +
            res.status +
            '). Slots will appear literal. See preview-inline.js for setup.',
          'info'
        );
        return;
      }
      data = await res.json();
    } catch (e) {
      showBanner(
        'preview-inline: could not load _preview-data.json — ' +
          (e && e.message ? e.message : String(e)) +
          '. Open this file via a local server: `python -m http.server` from the template folder.',
        'error'
      );
      return;
    }

    const copyMap = (data && data.copy) || {};
    const photoUrls = (data && data.photoUrls) || {};
    const photoAlts = (data && data.photoAlts) || {};
    const missing = { copy: new Set(), photo: new Set() };

    fillAttributes(document.body, copyMap, photoUrls, photoAlts, missing);
    fillTextNodes(document.body, copyMap, photoUrls, photoAlts, missing);
    fillTitle(copyMap);

    if (missing.copy.size > 0 || missing.photo.size > 0) {
      const parts = [];
      if (missing.copy.size > 0)
        parts.push(missing.copy.size + ' copy slot(s) unfilled: ' + [...missing.copy].slice(0, 5).join(', ') + (missing.copy.size > 5 ? '…' : ''));
      if (missing.photo.size > 0)
        parts.push(missing.photo.size + ' photo slot(s) unfilled: ' + [...missing.photo].slice(0, 5).join(', '));
      showBanner('preview-inline: ' + parts.join(' · ') + ' (add to _preview-data.json)', 'info');
    } else {
      // Soft confirmation banner — auto-dismiss after 2s
      const b = document.createElement('div');
      b.style.cssText =
        'position:fixed;top:0;left:0;right:0;z-index:999999;padding:6px 12px;font:12px/1.4 system-ui,sans-serif;background:#1c2611;color:#d6f0a3;text-align:center;';
      b.textContent = 'preview-inline · slots filled · this banner won\'t appear in production';
      document.body.insertBefore(b, document.body.firstChild);
      document.body.style.paddingTop = '32px';
      setTimeout(() => {
        b.style.transition = 'opacity 300ms';
        b.style.opacity = '0';
        setTimeout(() => {
          b.remove();
          document.body.style.paddingTop = '';
        }, 300);
      }, 2000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
