import express from 'express';
import pool from '../confg/dbconfig.js';
import { nanoid } from 'nanoid';

const router = express.Router();

// slug Türkçe karakterleri dönüştürme fonksiyonu
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

    // 🟢 Slug oluşturma (Türkçe karakter düzeltmesi ile)
    const slug = `${turkceKarakterleriDonustur(baslik)}-${nanoid(6)}`;

    // 📌 İçeriği veritabanına ekle
    const [result] = await pool.query(
      `INSERT INTO icerikler (baslik, icerik, meta_baslik, meta_aciklama, slug, yazar_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [baslik, icerik, meta_baslik, meta_aciklama, slug, yazar_id]
    );

    res.status(201).json({
      success: true,
      message: 'İçerik başarıyla eklendi',
      contentId: result.insertId,
      slug
    });

  } catch (error) {
    console.error('İçerik ekleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası, lütfen tekrar deneyin.'
    });
  }
});

export default router;
