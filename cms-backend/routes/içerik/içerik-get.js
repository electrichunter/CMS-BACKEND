import express from 'express';
import pool from '../confg/dbconfig.js'; // Veritabanı bağlantısı

const router = express.Router();

// 🔵 Tüm içerikleri getir
router.get('/f', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM icerikler');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Tüm içerikleri getirme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

// 🟢 Belirli bir içeriği getir
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT * FROM icerikler WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'İçerik bulunamadı' });
        }

        res.status(200).json({ success: true, data: rows[0] });

    } catch (error) {
        console.error('İçerik getirme hatası:', error);
        res.status(500).json({ success: false, message: 'Sunucu hatası' });
    }
});

export default router;
