import express from 'express';
import pool from '../../confg/dbconfig.js'; // Veritabanı bağlantısı

const router = express.Router();

router.put('/onayla/:id', async (req, res) => {
    const { id } = req.params;
    const { onaylayan_id, yorumlar } = req.body;

    try {
        const conn = await pool.getConnection();
        await conn.beginTransaction();

        // 📌 İçerik onay tablosunu güncelle
        const updateQuery = `
            UPDATE icerik_onaylari
            SET durum = 'onaylandi', onaylayan_id = ?, yorumlar = ?, guncelleme_tarihi = NOW()
            WHERE id = ?
        `;
        const updateValues = [onaylayan_id, yorumlar, id];

        const [updateResult] = await conn.query(updateQuery, updateValues);

        if (updateResult.affectedRows === 0) {
            await conn.rollback();
            conn.release();
            return res.status(404).json({ message: 'İçerik onayı bulunamadı.' });
        }

        // 📌 İçeriği "yayında" olarak güncelle
        const contentUpdateQuery = `
            UPDATE icerikler 
            SET durum = 'yayinda' 
            WHERE id = (SELECT icerik_id FROM icerik_onaylari WHERE id = ?)
        `;
        await conn.query(contentUpdateQuery, [id]);

        await conn.commit();
        conn.release();

        // Güncellenen içeriği çek
        const [rows] = await pool.query(`SELECT * FROM icerik_onaylari WHERE id = ?`, [id]);

        res.status(200).json({ message: 'İçerik onayı başarıyla güncellendi ve içerik yayına alındı.', data: rows[0] });
    } catch (error) {
        console.error('İçerik onayı güncellenirken hata oluştu:', error);
        res.status(500).json({ message: 'İçerik onayı güncellenirken bir hata oluştu.' });
    }
});

export default router;
