// =====================================
// LOGIN
// =====================================

function login() {

let username = document.getElementById("username").value;
let password = document.getElementById("password").value;
let role = document.getElementById("role").value;

if (role === "admin" && username === "admin" && password === "123") {
    window.location.href = "admin.html";
}
else if (role === "user" && username === "user" && password === "123") {
    window.location.href = "pengguna.html";
}
else {
    alert("Username atau Password Salah!");
}

}

function logout() {
window.location.href = "login.html";
}

// =====================================
// STOPWATCH
// =====================================

let seconds = 0;
let interval = null;

const literPerSecond = 0.2;
const pricePerLiter = 9;

function formatTime(sec) {

let h = Math.floor(sec / 3600);
let m = Math.floor((sec % 3600) / 60);
let s = sec % 60;

return (
String(h).padStart(2, "0") + ":" +
String(m).padStart(2, "0") + ":" +
String(s).padStart(2, "0")
);

}

function startTimer() {

if (interval) return;

interval = setInterval(() => {

seconds++;

let timer = document.getElementById("timer");

if (timer) {

timer.innerHTML = formatTime(seconds);

let liter = (seconds * literPerSecond).toFixed(2);

let biaya = (liter * pricePerLiter).toFixed(0);

document.getElementById("liter").innerHTML = liter;
document.getElementById("biaya").innerHTML = biaya;

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

if (document.getElementById("timer")) {
document.getElementById("timer").innerHTML = "00:00:00";
}

if (document.getElementById("liter")) {
document.getElementById("liter").innerHTML = "0";
}

if (document.getElementById("biaya")) {
document.getElementById("biaya").innerHTML = "0";
}

}

// =====================================
// SIMPAN DATA PENGGUNA
// =====================================

function saveData() {

let namaInput = document.getElementById("namaPengguna");

if (!namaInput || namaInput.value.trim() === "") {
alert("Masukkan nama pengguna terlebih dahulu!");
return;
}

let data = {

nama: namaInput.value.trim(),

tanggal: new Date().toLocaleString(),

waktu: formatTime(seconds),

liter: document.getElementById("liter").innerHTML,

biaya: document.getElementById("biaya").innerHTML,

status: "Belum Bayar"

};

let riwayatPengguna =
JSON.parse(localStorage.getItem("riwayatPengguna")) || [];

riwayatPengguna.push(data);

localStorage.setItem(
"riwayatPengguna",
JSON.stringify(riwayatPengguna)
);

let riwayatAdmin =
JSON.parse(localStorage.getItem("riwayatAdmin")) || [];

riwayatAdmin.push(data);

localStorage.setItem(
"riwayatAdmin",
JSON.stringify(riwayatAdmin)
);

loadRiwayat();
loadRiwayatAdmin();

alert("Data berhasil disimpan");

resetTimer();

}

// =====================================
// HAPUS DATA PENGGUNA
// =====================================

function hapusDataPengguna() {

if (confirm("Hapus seluruh data pengguna?")) {

localStorage.removeItem("riwayatPengguna");

loadRiwayat();

alert("Data pengguna berhasil dihapus");

}

}

// =====================================
// RIWAYAT PENGGUNA
// =====================================

function loadRiwayat() {

let body = document.getElementById("riwayatBody");

if (!body) return;

let data =
JSON.parse(localStorage.getItem("riwayatPengguna")) || [];

let html = "";

let totalLiter = 0;
let totalBiaya = 0;

data.forEach((item, index) => {

totalLiter += parseFloat(item.liter || 0);
totalBiaya += parseFloat(item.biaya || 0);

html += `
<tr>
<td>${index + 1}</td>
<td>${item.nama}</td>
<td>${item.tanggal}</td>
<td>${item.waktu}</td>
<td>${item.liter} Liter</td>
<td>Rp ${item.biaya}</td>
<td>${item.status}</td>
</tr>
`;

});

html += `
<tr style="font-weight:bold; background:#f5f5f5;">
<td colspan="4">TOTAL</td>
<td>${totalLiter.toFixed(2)} Liter</td>
<td>Rp ${totalBiaya.toFixed(0)}</td>
<td></td>
</tr>
`;

body.innerHTML = html;

}
// =====================================
// KOMENTAR
// =====================================

function kirimKomentar() {

let isi = document.getElementById("komentar").value;

if (isi.trim() === "") {
alert("Komentar tidak boleh kosong");
return;
}

let komentar =
JSON.parse(localStorage.getItem("komentar")) || [];

komentar.push({

tanggal: new Date().toLocaleString(),

isi: isi

});

localStorage.setItem(
"komentar",
JSON.stringify(komentar)
);

document.getElementById("komentar").value = "";

alert("Komentar berhasil dikirim");

}

function loadKomentar() {

let body = document.getElementById("komentarBody");

if (!body) return;

let komentar =
JSON.parse(localStorage.getItem("komentar")) || [];

let html = "";

komentar.forEach((item, index) => {

html += `
<tr>
<td>${index + 1}</td>
<td>${item.tanggal}</td>
<td>${item.isi}</td>
<td>
<button
class="delete"
onclick="hapusKomentar(${index})">
Hapus
</button>
</td>
</tr>
`;

});

body.innerHTML = html;

let jumlah = document.getElementById("jumlahKomentar");

if (jumlah) {
jumlah.innerHTML = komentar.length;
}

}

function hapusKomentar(index) {

let komentar =
JSON.parse(localStorage.getItem("komentar")) || [];

komentar.splice(index, 1);

localStorage.setItem(
"komentar",
JSON.stringify(komentar)
);

loadKomentar();

}

// =====================================
// ADMIN RIWAYAT
// =====================================

function loadRiwayatAdmin() {

let body = document.getElementById("riwayatAdminBody");

if (!body) return;

let riwayat =
JSON.parse(localStorage.getItem("riwayatAdmin")) || [];

let html = "";

let totalLiter = 0;
let totalBiaya = 0;

riwayat.forEach((item, index) => {

totalLiter += parseFloat(item.liter || 0);
totalBiaya += parseFloat(item.biaya || 0);

html += `
<tr>

<td>${index + 1}</td>

<td>${item.nama}</td>

<td>${item.tanggal}</td>

<td>${item.waktu}</td>

<td>${item.liter} Liter</td>

<td>Rp ${item.biaya}</td>

<td>${item.status}</td>

<td>

<button
class="save"
onclick="ubahStatus(${index})">
Bayar
</button>

<button
class="delete"
onclick="hapusRiwayatAdmin(${index})">
Hapus
</button>

</td>

</tr>
`;

});

body.innerHTML = html;

let tl = document.getElementById("totalLiter");
let tb = document.getElementById("totalBiaya");

if (tl) {
tl.innerHTML = totalLiter.toFixed(2) + " Liter";
}

if (tb) {
tb.innerHTML = "Rp " + totalBiaya.toFixed(0);
}

}

// =====================================
// STATUS PEMBAYARAN
// =====================================

function ubahStatus(index) {

let riwayat =
JSON.parse(localStorage.getItem("riwayatAdmin")) || [];

riwayat[index].status = "Sudah Bayar";

localStorage.setItem(
"riwayatAdmin",
JSON.stringify(riwayat)
);

loadRiwayatAdmin();

alert("Pembayaran berhasil dikonfirmasi");

}

// =====================================
// HAPUS RIWAYAT ADMIN
// =====================================

function hapusRiwayatAdmin(index) {

let riwayat =
JSON.parse(localStorage.getItem("riwayatAdmin")) || [];

riwayat.splice(index, 1);

localStorage.setItem(
"riwayatAdmin",
JSON.stringify(riwayat)
);

loadRiwayatAdmin();

}

// =====================================
// PENCARIAN PENGGUNA
// =====================================

function cariPengguna() {

let input =
document.getElementById("cariNama");

if (!input) return;

let filter = input.value.toLowerCase();

let rows =
document.querySelectorAll("#riwayatAdminBody tr");

rows.forEach(row => {

let nama =
row.cells[1].innerText.toLowerCase();

if (nama.includes(filter)) {
row.style.display = "";
}
else {
row.style.display = "none";
}

});

}

// =====================================
// AUTO LOAD
// =====================================

window.onload = function () {

loadRiwayat();
loadKomentar();
loadRiwayatAdmin();

};