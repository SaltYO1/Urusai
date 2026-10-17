const V='urusai-1.0.1792276705';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(r.mode==='navigate'||u.pathname.endsWith('/index.html'))){
    // network first for the page so updates arrive, cache as fallback (offline)
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(ca=>ca.put('./index.html',c));return res}).catch(()=>caches.match('./index.html')));return;
  }
  // fonts & icons: cache first
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(ca=>ca.put(r,c))}return res})));
});
