import express from 'express';
import registerRoutes from './login/login-regiser';
 
const app = express();
app.use(express.json());

// Basit test endpoint'i
app.get('/a', (req, res) => {
    res.send('Merhaba Dünya');
});

// Rotaları bağlama
app.use('/register', registerRoutes);
 
// 404 Hatası için middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Bulunamadı.' });
});

// Sunucuyu başlatma
const PORT = 3333;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
});