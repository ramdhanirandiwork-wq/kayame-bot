const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios'); // Untuk cek IP & Lokasi

const chromePath = process.env.PREFIX 
    ? process.env.PREFIX + '/bin/chromium-browser' 
    : '/usr/bin/google-chrome';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: chromePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process']
    }
});

const OWNER_NUMBER = '6283109862325@c.us'; // Nomor Anda

// --- [FUNGSI MONITORING] ---
async function sendSystemOnNotification() {
    try {
        // Ambil data IP dan Lokasi
        const response = await axios.get('https://ipapi.co/json/');
        const { ip, city, region, country_name } = response.data;
        
        const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        
        const pesan = `
🖥️ 🟢 SYSTEM ON 🟢 🖥️
---------------------------------------------
🌐 IP Server: ${ip}
📍 Lokasi: ${city}, ${region} - ${country_name}
📅 Waktu: ${waktu}
---------------------------------------------
🚀 Bot Kayame Food Siap Beroperasi!
        `.trim();

        await client.sendMessage(OWNER_NUMBER, pesan);
        console.log('✅ Laporan System ON telah dikirim ke Owner.');
    } catch (error) {
        console.error('❌ Gagal mengirim laporan system on:', error);
    }
}

// --- [LOGIKA QR & TIMER] ---
let qrStartTime;
let timerInterval;

client.on('qr', (qr) => {
    qrStartTime = new Date();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - qrStartTime) / 1000);
        console.clear();
        console.log('🚀 QR CODE ACTIVE - SILAKAN SCAN');
        qrcode.generate(qr, {small: true});
        console.log(`⏳ Durasi: ${Math.floor(diff/60)}m ${diff%60}s`);
    }, 1000);
});

// --- [STATUS READY] ---
client.on('ready', () => {
    if (timerInterval) clearInterval(timerInterval);
    console.clear();
    console.log('✅ BERHASIL! Bot Kayame Food Online!');
    
    // Kirim notifikasi otomatis ke nomor Anda
    sendSystemOnNotification();
});

// --- [RESPON PESAN] ---
client.on('message', msg => {
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('pong! Bot aktif.');
    }
});

client.initialize();

// Heartbeat
setInterval(() => {
    console.log(`💓 [${new Date().toLocaleTimeString()}] Heartbeat: Active`);
}, 60000);
