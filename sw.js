self.addEventListener("install", (event) => {
    console.log("Service Worker berhasil diinstal");
    // Memaksa service worker yang baru untuk langsung aktif
    self.skipWaiting(); 
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker aktif");
    // Mengambil kendali halaman segera setelah aktif
    event.waitUntil(clients.claim()); 
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Menutup pop-up notifikasi

    event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
            // Jika halaman pengguna.html sudah terbuka, fokuskan saja ke tab tersebut
            for (const client of clientList) {
                if (client.url.includes("pengguna.html") && "focus" in client) {
                    return client.focus();
                }
            }
            // Jika belum terbuka, baru buka tab baru
            if (clients.openWindow) {
                return clients.openWindow("pengguna.html");
            }
        })
    );
});
