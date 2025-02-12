import express from 'express';
import pool from '../confg/dbconfig.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// Slug Türkçe karakterleri dönüştürme fonksiyonu
const turkceKarakterleriDonustur = (text) => {
  const harfMap = {
    'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
    'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c'
  };

  return text
    .split('')
    .map(harf => harfMap[harf] || harf) // Türkçe karakterleri değiştir
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Geçersiz karakterleri "-" ile değiştir
    .replace(/^-+|-+$/g, ''); // Başta ve sonda "-" kalmasını önle
};

// 🟢 İçerik Ekleme Endpointi
router.post('/', async (req, res) => {
  const { baslik, icerik, meta_baslik, meta_aciklama, yazar_id } = req.body;

  try {
    // 🔴 Zorunlu alanları kontrol et
    if (!baslik || !icerik || !yazar_id) {
      return res.status(400).json({ success: false, message: 'Zorunlu alanları doldurun' });
    }

    // 🟢 Slug oluşturma
    const slug = `${turkceKarakterleriDonustur(baslik)}-${nanoid(6)}`;

    // 📌 TRANSACTION başlat (iki tabloya güvenli ekleme yapmak için)
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // 📌 İçeriği veritabanına ekle
      const [result] = await conn.query(
        `INSERT INTO icerikler (baslik, icerik, meta_baslik, meta_aciklama, slug, yazar_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [baslik, icerik, meta_baslik, meta_aciklama, slug, yazar_id]
      );

      const icerik_id = result.insertId;

      // 📌 İçeriği "onay" tablosuna ekle (varsayılan olarak 'beklemede' durumu ile)
      await conn.query(
        `INSERT INTO icerik_onaylari (icerik_id, durum) VALUES (?, ?)`,
        [icerik_id, 'beklemede']
      );

      // 🟢 İşlemi tamamla
      await conn.commit();
      conn.release();

      res.status(201).json({
        success: true,
        message: 'İçerik başarıyla eklendi ve onay için gönderildi.',
        contentId: icerik_id,
        slug
      });

    } catch (error) {
      await conn.rollback(); // Hata olursa işlemi geri al
      conn.release();
      throw error;
    }

  } catch (error) {
    console.error('İçerik ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası, lütfen tekrar deneyin.'
    });
  }
});

export default router;
