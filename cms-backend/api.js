import express from 'express';
import user from './routes/login/login-regiser.js';
 import icerik from './routes/içerik/içerik-post.js';
 import icerikget from './routes/içerik/içerik-get.js';
const app = express();
app.use(express.json());

// Basit test endpoint'i
app.get('/a', (req, res) => {
    res.send('Merhaba Dünya');
});

// Rotaları bağlama
app.use('/user', user);

app.use('/icerik', icerik);
 
app.use('ıcerikget', icerikget);
// 404 Hatası için middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Bulunamadı.' });
});

// Sunucuyu başlatma
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu localhost:${PORT} portunda çalışıyor.`);
});