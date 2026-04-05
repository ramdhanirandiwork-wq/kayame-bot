const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Logika cerdas: Deteksi apakah sedang di Termux atau di Cloud
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

client.on('qr', (qr) => {
    console.clear();
    console.log('--- SCAN QR KAYAME FOOD ---');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('✅ Bot Kayame Food sudah Online!');
});

client.on('message', msg => {
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('pong! Bot aktif.');
    }
});

client.initialize();
