const CACHE_NAME = 'shinee-tracker-v2'; // ここを v2 に変えるだけで、次回から古いキャッシュが消えるよ！

// 1. インストール時：古いキャッシュを掃除する準備
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('古いキャッシュを削除します:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 2. Fetch（通信）は今まで通り
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response;

            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});