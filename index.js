const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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

let qrStartTime;
let timerInterval;

// --- [BAGIAN 1: LOGIKA QR & TIMER] ---
client.on('qr', (qr) => {
    qrStartTime = new Date();
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - qrStartTime) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;

        console.clear();
        console.log('=============================================');
        console.log('       🚀 QR CODE KAYAME FOOD ACTIVE        ');
        console.log(`       Dibuat pada: ${qrStartTime.toLocaleTimeString()}`);
        console.log('=============================================');
        qrcode.generate(qr, {small: true});
        console.log('---------------------------------------------');
        console.log(`⏳ Durasi QR Aktif: ${minutes} Menit ${seconds} Detik`);
        console.log('---------------------------------------------');
    }, 1000);
});

// --- [BAGIAN 2: STATUS READY] ---
client.on('ready', () => {
    if (timerInterval) clearInterval(timerInterval);
    console.clear();
    console.log('✅ BERHASIL! Bot Kayame Food sudah Online!');
});

// --- [BAGIAN 3: RESPON PESAN (WAJIB ADA)] ---
client.on('message', msg => {
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('pong! Bot Kayame Food aktif dan siap melayani.');
    }
});

// --- [BAGIAN 4: INITIALIZE & KEEP-ALIVE] ---
client.initialize();

setInterval(() => {
    // Ini agar Termux tidak dianggap menganggur oleh Android
    console.log(`💓 [${new Date().toLocaleTimeString()}] Bot sedang bernafas...`);
}, 60000);
