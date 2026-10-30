const CACHE_NAME = 'ayora-cache-v1';
const assetsToCache = [
  './',
  './index.html'
];

// تثبيت التطبيق وحفظ الملفات الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// تفعيل الخدمة وتنظيف التخزين القديم إن وجد
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// اعتراض الطلبات وحفظ أي صفحة أو صوت يتم فتحه تلقائياً ليعمل بدون إنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // تخزين نسخة من أي صورة أو ملف يتم طلبه تلقائياً
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // في حال انقطاع الإنترنت ولم يتم العثور على الملف في الذاكرة المؤقتة
        if (event.request.destination === 'image') {
          // يمكن وضع صورة بديلة أو تجاهل الخطأ
        }
      });
    })
  );
});
