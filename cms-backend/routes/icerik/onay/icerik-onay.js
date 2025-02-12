import express from 'express';
import pool from '../../confg/dbconfig.js'; // Veritabanı bağlantısı

const router = express.Router();

router.put('/onayla/:id', async (req, res) => {
    const { id } = req.params;
    const { onaylayan_id, yorumlar } = req.body;

    try {
        const updateQuery = `
            UPDATE icerik_onaylari
            SET durum = 'onaylandi', onaylayan_id = ?, yorumlar = ?, guncelleme_tarihi = NOW()
            WHERE id = ?
        `;
        const updateValues = [onaylayan_id, yorumlar, id];

        const [updateResult] = await pool.query(updateQuery, updateValues);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'İçerik onayı bulunamadı.' });
        }

        // Güncellenen satırı almak için SELECT sorgusu yap
        const selectQuery = `SELECT * FROM icerik_onaylari WHERE id = ?`;
        const [rows] = await pool.query(selectQuery, [id]);

        res.status(200).json({ message: 'İçerik onayı başarıyla güncellendi.', data: rows[0] });
    } catch (error) {
        console.error('İçerik onayı güncellenirken hata oluştu:', error);
        res.status(500).json({ message: 'İçerik onayı güncellenirken bir hata oluştu.' });
    }
});

export default router;