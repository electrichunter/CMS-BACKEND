import express from 'express';
import pool from '../confg/dbconfig.js';
import { nanoid } from 'nanoid'; // 🟢 Slug oluşturma için 
 // 🟢 Slug oluşturma
    // Slug, bir içeriğin başlığından türetilen ve URL dostu hale getirilen benzersiz bir metin parçasıdır.
    // Örneğin:
    // Bir başlığın şu şekilde olduğunu düşünelim:
    // 📌 Başlık: "Merhaba Dünya! İlk Yazım"
    // 📌 Slug: merhaba-dunya-ilk-yazim
const router = express.Router();

// 🟢 İçerik Ekleme Endpointi
router.post('/', async (req, res) => {
  const { baslik, icerik, meta_baslik, meta_aciklama, yazar_id } = req.body;

  try {
    // 🔴 Zorunlu alanları kontrol et
    if (!baslik || !icerik || !yazar_id) {
      return res.status(400).json({ success: false, message: 'Zorunlu alanları doldurun' });
    }


    const slug = `${baslik.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nanoid(6)}`;

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
