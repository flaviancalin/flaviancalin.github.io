/*
 * Scraper pentru catalinrenghea.ro, rulat ca bookmarklet în browserul clientului/agenției.
 * Strânge: API-ul WordPress (pagini, articole, media, categorii, etichete), HTML-ul tuturor
 * paginilor găsite (sitemap + linkuri interne), CSS-ul, fonturile și toate fișierele din
 * wp-content/uploads la rezoluția maximă disponibilă. Rezultatul: un singur fișier ZIP.
 * Fără dependențe externe (ZIP „store”, scris de mână), ca să meargă și cu CSP strict.
 */
(async () => {
  if (window.__crScraper) return;
  window.__crScraper = 1;

  const O = location.origin;
  const SEED = ['/', '/despre-mine/', '/contact/', '/termeni-si-conditii/', '/politica-de-confidentialitate/', '/politica-de-cookies/'];
  const MAX_PAGES = 200;
  const files = []; // { name, blob }
  const manifest = { site: O, date: new Date().toISOString(), userAgent: navigator.userAgent, pages: [], assets: [], failed: [] };

  // ---------- UI ----------
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:2147483647;background:#111;color:#fff;font:15px/1.4 system-ui,sans-serif;padding:14px 16px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.4)';
  const msg = document.createElement('div');
  const sub = document.createElement('div');
  sub.style.cssText = 'opacity:.7;font-size:13px;margin-top:4px;word-break:break-all';
  box.append(msg, sub);
  document.body.appendChild(box);
  const say = (m, s = '') => { msg.textContent = m; sub.textContent = s; };

  // ---------- utilitare ----------
  const sameOrigin = (u) => { try { return new URL(u, O).origin === O; } catch { return false; } };
  const abs = (u, base = O) => { try { const x = new URL(u, base); x.hash = ''; return x.href; } catch { return null; } };

  async function get(url, type = 'blob') {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 90000);
    try {
      const r = await fetch(url, { credentials: 'omit', signal: ctl.signal });
      if (!r.ok) return { ok: false, status: r.status, r };
      return { ok: true, r, data: await r[type]() };
    } catch (e) {
      return { ok: false, status: String(e && e.name || e) };
    } finally { clearTimeout(t); }
  }

  const addFile = (name, data) => files.push({ name, blob: data instanceof Blob ? data : new Blob([data]) });
  const pathName = (u) => { const p = new URL(u).pathname.replace(/^\/+/, ''); return decodeURIComponent(p) || 'index'; };

  // Varianta „originală” a unei imagini WordPress: fără -300x200 și fără -scaled.
  function originals(u) {
    const x = new URL(u);
    x.search = '';
    const list = [];
    const p = x.pathname;
    const noSize = p.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, '');
    const noScaled = noSize.replace(/-scaled(?=\.[a-z0-9]+$)/i, '');
    for (const q of [noScaled, noSize, p]) if (!list.includes(O + q)) list.push(O + q);
    return list;
  }

  // ---------- colectare ----------
  const assetQueue = new Map(); // cheie: cea mai bună variantă; valoare: { candidates, foundOn:Set }
  function queueAsset(raw, foundOn, base) {
    const u = abs(raw, base);
    if (!u || !sameOrigin(u)) return;
    const path = new URL(u).pathname;
    const isUpload = path.includes('/wp-content/uploads/');
    const isFont = /\.(woff2?|ttf|otf|eot)$/i.test(path);
    const isLogoOrImg = /\.(png|jpe?g|webp|gif|svg|avif|ico|pdf)$/i.test(path);
    if (!isUpload && !isFont && !isLogoOrImg) return;
    const cands = isUpload ? originals(u) : [u];
    const key = cands[0];
    const e = assetQueue.get(key) || { candidates: [], foundOn: new Set(), seenAs: new Set() };
    for (const c of cands) if (!e.candidates.includes(c)) e.candidates.push(c);
    e.seenAs.add(u);
    if (foundOn) e.foundOn.add(foundOn);
    assetQueue.set(key, e);
  }

  const cssDone = new Set();
  async function grabCss(href, foundOn) {
    const u = abs(href);
    if (!u || cssDone.has(u) || !sameOrigin(u)) return;
    cssDone.add(u);
    const res = await get(u, 'text');
    if (!res.ok) { manifest.failed.push({ url: u, status: res.status }); return; }
    addFile('css/' + pathName(u).replace(/\//g, '__'), res.data);
    for (const m of res.data.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) queueAsset(m[1], foundOn, u);
    for (const m of res.data.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]/g)) await grabCss(abs(m[1], u), foundOn);
  }

  function scanHtml(html, pageUrl, links) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const srcAttrs = ['src', 'data-src', 'data-lazy-src', 'data-orig-file', 'data-large-file', 'data-bg', 'data-background', 'poster', 'content', 'href'];
    doc.querySelectorAll('*').forEach((el) => {
      for (const a of srcAttrs) { const v = el.getAttribute(a); if (v && /\/wp-content\/|\.(png|jpe?g|webp|gif|svg|avif|ico|pdf)(\?|$)/i.test(v)) queueAsset(v, pageUrl, pageUrl); }
      for (const a of ['srcset', 'data-srcset', 'data-lazy-srcset']) {
        const v = el.getAttribute(a);
        if (v) v.split(',').forEach((s) => queueAsset(s.trim().split(/\s+/)[0], pageUrl, pageUrl));
      }
      const st = el.getAttribute('style');
      if (st) for (const m of st.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) queueAsset(m[1], pageUrl, pageUrl);
    });
    doc.querySelectorAll('style').forEach((s) => { for (const m of s.textContent.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) queueAsset(m[1], pageUrl, pageUrl); });
    const css = [...doc.querySelectorAll('link[rel~="stylesheet"][href]')].map((l) => abs(l.getAttribute('href'), pageUrl));
    doc.querySelectorAll('a[href]').forEach((a) => {
      const u = abs(a.getAttribute('href'), pageUrl);
      if (u && sameOrigin(u)) links.push(u);
    });
    return css;
  }

  const isPageUrl = (u) => {
    const x = new URL(u);
    if (x.search) return false;
    if (/^\/(wp-admin|wp-login|wp-json|xmlrpc|feed|comments\/feed|wp-content|wp-includes)/.test(x.pathname)) return false;
    if (/\/feed\/?$/.test(x.pathname)) return false;
    return !/\.[a-z0-9]{2,5}$/i.test(x.pathname) || /\.html?$/i.test(x.pathname);
  };

  // 1) API-ul WordPress
  const api = {};
  for (const t of ['pages', 'posts', 'media', 'categories', 'tags']) {
    const all = [];
    for (let p = 1; p < 50; p++) {
      say(`API WordPress: ${t}`, `pagina ${p}`);
      const res = await get(`${O}/wp-json/wp/v2/${t}?per_page=100&page=${p}`, 'text');
      if (!res.ok) { if (p === 1) manifest.failed.push({ url: `/wp-json/wp/v2/${t}`, status: res.status }); break; }
      let j; try { j = JSON.parse(res.data); } catch { break; }
      if (!Array.isArray(j) || !j.length) break;
      all.push(...j);
      if (p >= (+res.r.headers.get('X-WP-TotalPages') || 1)) break;
    }
    api[t] = all;
    addFile(`api/${t}.json`, JSON.stringify(all, null, 1));
  }
  const root = await get(`${O}/wp-json/`, 'text');
  if (root.ok) { try { const j = JSON.parse(root.data); addFile('api/site.json', JSON.stringify({ name: j.name, description: j.description, url: j.url, home: j.home }, null, 1)); } catch {} }

  for (const m of api.media || []) {
    if (!m.source_url) continue;
    queueAsset(m.source_url, m.post ? `media:${m.id} post:${m.post}` : `media:${m.id}`);
    const orig = m.media_details && m.media_details.original_image;
    if (orig) queueAsset(m.source_url.replace(/[^/]+$/, orig), `media:${m.id}`);
  }
  const queue = [...SEED.map((s) => O + s)];
  for (const t of ['pages', 'posts']) for (const p of api[t] || []) if (p.link) queue.push(p.link);

  // 2) Sitemap
  for (const sm of ['/wp-sitemap.xml', '/sitemap_index.xml', '/sitemap.xml']) {
    say('Citesc sitemap-ul', sm);
    const res = await get(O + sm, 'text');
    if (!res.ok) continue;
    addFile('sitemap/' + sm.slice(1), res.data);
    const locs = [...res.data.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
    for (const l of locs) {
      if (/\.xml(\?|$)/.test(l)) {
        const sub2 = await get(l, 'text');
        if (sub2.ok) { addFile('sitemap/' + pathName(l).replace(/\//g, '__'), sub2.data); for (const m of sub2.data.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) queue.push(m[1]); for (const m of sub2.data.matchAll(/<image:loc>\s*([^<\s]+)\s*<\/image:loc>/g)) queueAsset(m[1], 'sitemap'); }
      } else queue.push(l);
    }
    break;
  }

  // 3) Crawl HTML
  const seen = new Set();
  while (queue.length && seen.size < MAX_PAGES) {
    const u = abs(queue.shift());
    if (!u || !sameOrigin(u) || !isPageUrl(u)) continue;
    const key = u.replace(/\/$/, '');
    if (seen.has(key)) continue;
    seen.add(key);
    say(`Pagini: ${seen.size}`, u);
    const res = await get(u, 'text');
    if (!res.ok) { manifest.failed.push({ url: u, status: res.status }); continue; }
    const finalUrl = res.r.url || u;
    const name = 'html/' + (pathName(finalUrl).replace(/\/$/, '').replace(/\//g, '__') || 'index') + '.html';
    addFile(name, res.data);
    manifest.pages.push({ url: finalUrl, file: name });
    const links = [];
    const css = scanHtml(res.data, finalUrl, links);
    for (const c of css) if (c) await grabCss(c, finalUrl);
    for (const l of links) {
      if (isPageUrl(l)) queue.push(l);
      else queueAsset(l, finalUrl, finalUrl);
    }
  }

  // 4) Descărcare fișiere (4 în paralel), varianta cea mai mare disponibilă
  const entries = [...assetQueue.values()];
  const savedPaths = new Set();
  let done = 0, bytes = 0;
  async function worker() {
    while (entries.length) {
      const e = entries.shift();
      let ok = false;
      for (const c of e.candidates) {
        const res = await get(c);
        if (res.ok && res.data.size > 0 && !/text\/html/.test(res.data.type)) {
          let name = 'files/' + pathName(c);
          if (!savedPaths.has(name)) { savedPaths.add(name); addFile(name, res.data); bytes += res.data.size; }
          manifest.assets.push({ url: c, file: name, bytes: res.data.size, type: res.data.type, seenAs: [...e.seenAs], foundOn: [...e.foundOn] });
          ok = true;
          break;
        }
      }
      if (!ok) manifest.failed.push({ url: e.candidates[e.candidates.length - 1], status: 'not found' });
      done++;
      say(`Fișiere: ${done} / ${done + entries.length}`, `${(bytes / 1048576).toFixed(1)} MB descărcați`);
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()]);

  addFile('manifest.json', JSON.stringify(manifest, null, 1));

  // 5) ZIP (metoda „store”, fără compresie: pozele sunt deja comprimate)
  say('Construiesc arhiva ZIP…', `${files.length} fișiere`);
  const CRC = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c >>> 0; }
  const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const usedNames = new Set();
  for (const f of files) {
    let nm = f.name;
    for (let i = 2; usedNames.has(nm); i++) nm = f.name.replace(/(\.[^./]+)?$/, `-${i}$1`);
    usedNames.add(nm);
    const name = enc.encode(nm);
    const data = new Uint8Array(await f.blob.arrayBuffer());
    const crc = crc32(data), size = data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
    lh.setUint16(10, dosTime, true); lh.setUint16(12, dosDate, true); lh.setUint32(14, crc, true);
    lh.setUint32(18, size, true); lh.setUint32(22, size, true); lh.setUint16(26, name.length, true); lh.setUint16(28, 0, true);
    parts.push(lh.buffer, name, f.blob);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
    ch.setUint16(12, dosTime, true); ch.setUint16(14, dosDate, true); ch.setUint32(16, crc, true); ch.setUint32(20, size, true); ch.setUint32(24, size, true);
    ch.setUint16(28, name.length, true); ch.setUint32(42, offset, true);
    central.push(ch.buffer, name);
    offset += 30 + name.length + size;
  }
  const cdSize = central.reduce((s, b) => s + (b.byteLength || b.length), 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true); end.setUint32(16, offset, true);
  const zip = new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });

  const url = URL.createObjectURL(zip);
  const fname = `catalinrenghea-export-${now.toISOString().slice(0, 10)}.zip`;
  say(`Gata: ${manifest.pages.length} pagini, ${manifest.assets.length} fișiere, ${(zip.size / 1048576).toFixed(1)} MB`, manifest.failed.length ? `${manifest.failed.length} adrese n-au mers (sunt notate în manifest.json)` : 'Toate adresele au mers.');
  const btn = document.createElement('a');
  btn.href = url; btn.download = fname; btn.textContent = '⬇ Descarcă ZIP-ul';
  btn.style.cssText = 'display:block;margin-top:12px;padding:14px;border-radius:999px;background:#fff;color:#111;text-align:center;font-weight:600;text-decoration:none';
  box.appendChild(btn);
  try { btn.click(); } catch {}
})().catch((e) => { alert('Scriptul s-a oprit: ' + (e && e.message || e)); window.__crScraper = 0; });
