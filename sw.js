// Hors ligne : garde l'application et ses ressources en cache.
const CACHE="convoyages-v182";
const CORE=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png",
 "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js","https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
 "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 // synchronisation en direct : jamais en cache
 try{const h=new URL(e.request.url).hostname;if(/(^|\.)(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/.test(h))return}catch(_){}
 const isPage=e.request.mode==="navigate";
 e.respondWith(isPage
  ? fetch(e.request.url,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put("./index.html",c));return r}).catch(()=>caches.match("./index.html"))
  : caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})))});
