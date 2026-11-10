const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

function workerSource(version, assets) {
  return `/* Generated app assets only. No trip data or runtime responses cached. */
const CACHE = ${JSON.stringify('travel-like-andy-shell-' + version)};
const ASSETS = ${JSON.stringify(assets)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS.map(url => new Request(url, { credentials: 'omit' })))));
});
// Do not skipWaiting: existing tabs keep their matching bundle until closed.
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('travel-like-andy-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate' && ['/', '/create-trip', '/explore', '/concierge', '/components', '/brand-samples'].includes(url.pathname)) {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE);
      const shell = await cache.match('/index.html');
      if (!shell) throw new Error('Offline app files are unavailable.');
      return shell;
    }));
    return;
  }
  if (url.search || !ASSETS.includes(url.pathname)) return;
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(url.pathname)) || fetch(request)));
});
`;
}

async function build(root = path.resolve(__dirname, '../dist-web')) {
  const index = path.join(root, 'index.html');
  let html = await fs.readFile(index, 'utf8');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>AndyGo by Travel Like Andy — The world, your way.</title>');
  // Remove Expo's favicon link before adding one coherent generated icon set.
  html = html.replace(/<link\b[^>]*rel="(?:icon|shortcut icon|apple-touch-icon|manifest)"[^>]*>/gi, '');
  html = html.replace(/<meta\b[^>]*name="(?:description|theme-color|apple-mobile-web-app-title)"[^>]*>/gi, '');
  html = html.replace(/<link\b[^>]*href="\/brand\/tokens.css"[^>]*>/gi, '');
  html = html.replace('</head>', `<meta name="description" content="The world, your way. AndyGo is a travel planning prototype by Travel Like Andy; name pending clearance."/>
<meta name="theme-color" content="#075E68"/>
<meta name="apple-mobile-web-app-title" content="AndyGo"/>
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48"/>
<link rel="icon" type="image/svg+xml" href="/brand/andygo-favicon.svg" sizes="any"/>
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180"/>
<link rel="manifest" href="/site.webmanifest"/>
<link rel="stylesheet" href="/brand/tokens.css"/>
</head>`);
  await fs.writeFile(index, html);
  const files = [];
  async function walk(directory) {
    for (const item of await fs.readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, item.name);
      if (item.isDirectory()) await walk(filename);
      else if (item.isFile() && /\.(html|js|css|wasm|png|jpe?g|ico|svg|ttf|woff2?|webmanifest)$/.test(item.name) && item.name !== 'sw.js') files.push(filename);
    }
  }
  await walk(root);
  files.sort();
  const digest = crypto.createHash('sha256');
  const assets = [];
  for (const filename of files) {
    const url = '/' + path.relative(root, filename).split(path.sep).join('/');
    assets.push(url); digest.update(url); digest.update(await fs.readFile(filename));
  }
  if (!assets.includes('/index.html')) throw Error('Export the web app before generating offline assets.');
  const version = digest.digest('hex').slice(0, 20);
  await fs.writeFile(path.join(root, 'sw.js'), workerSource(version, assets));
  console.log('Generated optional offline worker for ' + assets.length + ' app files.');
}

module.exports = { workerSource, build };
if (require.main === module) build().catch(error => { console.error(error.message); process.exitCode = 1; });
