// =====================================
// DAFTARKAN SERVICE WORKER & NOTIFIKASI
// =====================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => {
            console.log("Service Worker Aktif");
        })
        .catch(err => {
            console.error("Gagal mendaftarkan Service Worker:", err);
        });
}

// Meminta izin notifikasi
function mintaIzinNotifikasi() {
    if ("Notification" in window) {
        if (Notification.permission !== "granted") {
            Notification.requestPermission().then(permission => {
                console.log("Izin Notifikasi:", permission);
            });
        }
    }
}

function kirimNotifikasi() {

    bunyiAlarm();

    if (Notification.permission !== "granted") return;

    navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
            reg.showNotification("💧 Pengingat Air", {
                body: "Penggunaan air sudah mencapai batas waktu. Jangan lupa matikan keran."
            });
        }
    });
}
function kirimNotifikasi() {

    if (Notification.permission !== "granted") return;

    let audio = new Audio("audio.mp4"); // Ganti dengan nama file audio kamu
    audio.play().catch(() => {});

    navigator.serviceWorker.getRegistration().then(reg => {
        if (!reg) return;

        reg.showNotification("💧 Pengingat Air", {
            body: "Penggunaan air sudah mencapai batas waktu. Jangan lupa matikan keran.",
            vibrate: [200, 100, 200],
            requireInteraction: true
        });
    });

}

// =====================================
// LOGIN & LOGOUT
// =====================================
function login() {
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');
    let roleInput = document.getElementById('role');

    if (!usernameInput || !passwordInput || !roleInput) return;

    let username = usernameInput.value;
    let password = passwordInput.value;
    let role = roleInput.value;

    if (role === 'admin' && username === 'admin' && password === '123') {
        window.location.href = 'admin.html';
    } else if (role === 'user' && username === 'user' && password === '123') {
        window.location.href = 'pengguna.html';
    } else {
        alert('Username atau Password Salah!');
    }
}

function logout() {
    window.location.href = 'login.html';
}

// =====================================
// STOPWATCH (LOGIKA AIR)
// =====================================
let seconds = 0;
let interval = null;
const literPerSecond = 0.2; // Liter per detik
const hargaPerKubik = 9470; // Rp per m³ (1000 liter)

function formatTime(sec) {
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = sec % 60;
    return (
        String(h).padStart(2, '0') + ":" +
        String(m).padStart(2, '0') + ":" +
        String(s).padStart(2, '0')
    );
}

function startTimer() {
    mintaIzinNotifikasi();
    if (interval) return;
    interval = setInterval(() => {
        seconds++;

        // Notifikasi pemicu setiap 5 detik (5 detik)
        if (seconds % 5 === 0) {
            kirimNotifikasi();
        }

        let timer = document.getElementById('timer');
        if (timer) {
            timer.innerHTML = formatTime(seconds);
            let liter = seconds * literPerSecond;
            let kubik = liter / 1000;
            let biaya = kubik * hargaPerKubik;
            
            if (document.getElementById('liter')) {
                document.getElementById('liter').innerHTML = liter.toFixed(2);
            }
            if (document.getElementById('biaya')) {
                document.getElementById('biaya').innerHTML = biaya.toFixed(0);
            }
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}

function resetTimer() {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    if (document.getElementById('timer')) {
        document.getElementById('timer').innerHTML = "00:00:00";
    }
    if (document.getElementById('liter')) {
        document.getElementById('liter').innerHTML = "0";
    }
    if (document.getElementById('biaya')) {
        document.getElementById('biaya').innerHTML = "0";
    }
}

// =====================================
// SIMPAN & HAPUS DATA PENGGUNA
// =====================================
function saveData() {
    let namaInput = document.getElementById('namaPengguna');
    if (!namaInput || namaInput.value.trim() === "") {
        alert('Masukkan nama pengguna terlebih dahulu!');
        return;
    }

    let literValue = document.getElementById('liter') ? document.getElementById('liter').innerHTML : "0";
    let biayaValue = document.getElementById('biaya') ? document.getElementById('biaya').innerHTML : "0";

    let data = {
        nama: namaInput.value.trim(),
        tanggal: new Date().toLocaleString(),
        waktu: formatTime(seconds),
        liter: literValue,
        biaya: biayaValue,
        status: 'Belum Bayar'
    };

    let riwayatPengguna = JSON.parse(localStorage.getItem('riwayatPengguna')) || [];
    riwayatPengguna.push(data);
    localStorage.setItem('riwayatPengguna', JSON.stringify(riwayatPengguna));

    let riwayatAdmin = JSON.parse(localStorage.getItem('riwayatAdmin')) || [];
    riwayatAdmin.push(data);
    localStorage.setItem('riwayatAdmin', JSON.stringify(riwayatAdmin));

    loadRiwayat();
    loadRiwayatAdmin();
    alert('Data berhasil disimpan');
    resetTimer();
}

function hapusDataPengguna() {
    if (confirm('Hapus seluruh data pengguna?')) {
        localStorage.removeItem('riwayatPengguna');
        loadRiwayat();
        alert('Data pengguna berhasil dihapus');
    }
}

// =====================================
// RIWAYAT PENGGUNA (TABEL USER)
// =====================================
function loadRiwayat() {
    let body = document.getElementById('riwayatBody');
    if (!body) return;

    let data = JSON.parse(localStorage.getItem('riwayatPengguna')) || [];
    let html = "";
    let totalLiter = 0;
    let totalBiaya = 0;

    data.forEach((item, index) => {
        totalLiter += parseFloat(item.liter || 0);
        totalBiaya += parseFloat(item.biaya || 0);
        html += `<tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${item.liter} Liter</td>
            <td>Rp ${parseInt(item.biaya).toLocaleString('id-ID')}</td>
            <td>${item.status}</td>
        </tr>`;
    });

    html += `<tr style="font-weight:bold; background:#f5f5f5;">
        <td colspan="4">TOTAL</td>
        <td>${totalLiter.toFixed(2)} Liter</td>
        <td>Rp ${totalBiaya.toLocaleString('id-ID')}</td>
        <td></td>
    </tr>`;
    body.innerHTML = html;
}

// =====================================
// KOMENTAR
// =====================================
function kirimKomentar() {
    let komentarInput = document.getElementById('komentar');
    if (!komentarInput) return;

    let isi = komentarInput.value;
    if (isi.trim() === "") {
        alert('Komentar tidak boleh kosong');
        return;
    }

    let komentarList = JSON.parse(localStorage.getItem('komentar')) || [];
    komentarList.push({
        tanggal: new Date().toLocaleString(),
        isi: isi
    });
    localStorage.setItem('komentar', JSON.stringify(komentarList));
    komentarInput.value = "";
    alert('Komentar berhasil dikirim');
    loadKomentar();
}

function loadKomentar() {
    let body = document.getElementById('komentarBody');
    if (!body) return;

    let komentarList = JSON.parse(localStorage.getItem('komentar')) || [];
    let html = "";

    komentarList.forEach((item, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td>${item.tanggal}</td>
            <td>${item.isi}</td>
            <td>
                <button class="delete" onclick="hapusKomentar(${index})">Hapus</button>
            </td>
        </tr>`;
    });

    body.innerHTML = html;

    let jumlah = document.getElementById('jumlahKomentar');
    if (jumlah) {
        jumlah.innerHTML = komentarList.length;
    }
}

function hapusKomentar(index) {
    let komentarList = JSON.parse(localStorage.getItem('komentar')) || [];
    komentarList.splice(index, 1);
    localStorage.setItem('komentar', JSON.stringify(komentarList));
    loadKomentar();
}

// =====================================
// RIWAYAT ADMIN (TABEL ADMIN)
// =====================================
function loadRiwayatAdmin() {
    let body = document.getElementById('riwayatAdminBody');
    if (!body) return;

    let riwayat = JSON.parse(localStorage.getItem('riwayatAdmin')) || [];
    let html = "";
    let totalLiter = 0;
    let totalBiaya = 0;

    riwayat.forEach((item, index) => {
        totalLiter += parseFloat(item.liter || 0);
        totalBiaya += parseFloat(item.biaya || 0);
        html += `<tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.tanggal}</td>
            <td>${item.waktu}</td>
            <td>${item.liter} Liter</td>
            <td>Rp ${parseInt(item.biaya).toLocaleString('id-ID')}</td>
            <td>${item.status}</td>
            <td>
                <button class="save" onclick="ubahStatus(${index})">Bayar</button>
                <button class="delete" onclick="hapusRiwayatAdmin(${index})">Hapus</button>
            </td>
        </tr>`;
    });

    body.innerHTML = html;

    let tl = document.getElementById('totalLiter');
    let tb = document.getElementById('totalBiaya');
    if (tl) {
        tl.innerHTML = totalLiter.toFixed(2) + " Liter";
    }
    if (tb) {
        tb.innerHTML = "Rp " + totalBiaya.toLocaleString('id-ID');
    }
}

// =====================================
// STATUS PEMBAYARAN & MANAGEMENT ADMIN
// =====================================
function ubahStatus(index) {
    let riwayat = JSON.parse(localStorage.getItem('riwayatAdmin')) || [];
    riwayat[index].status = 'Sudah Bayar';
    localStorage.setItem('riwayatAdmin', JSON.stringify(riwayat));
    loadRiwayatAdmin();
    alert('Pembayaran berhasil dikonfirmasi');
}


window.onload = function () {

    loadRiwayatAdmin();
    loadKomentar();
    loadcaripengguna();

function loadcaripengguna(){
    
}
};
function hapusRiwayatAdmin(index) {
    if (confirm("Yakin ingin menghapus data ini?")) {

        let riwayat = JSON.parse(localStorage.getItem("riwayatAdmin")) || [];
        riwayat.splice(index, 1);
        localStorage.setItem("riwayatAdmin", JSON.stringify(riwayat));

        loadRiwayatAdmin();

        alert("Data berhasil dihapus");
    }
}