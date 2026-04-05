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

client.on('qr', (qr) => {
    qrStartTime = new Date(); // Catat waktu QR dibuat
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now - qrStartTime) / 1000); // Hitung selisih detik
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
        console.log('Tips: QR biasanya expired dalam 1-2 menit.');
    }, 1000); // Update setiap 1 detik
});

client.on('ready', () => {
    if (timerInterval) clearInterval(timerInterval);
    console.clear();
    console.log('✅ BERHASIL! Bot Kayame Food sudah Online!');
});

client.initialize();
