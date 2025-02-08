import express from 'express';
import pool from '../confg/dbconfig.js'; //  

import bcrypt from 'bcryptjs';

const router = express.Router();

// 🟢 Kayıt Endpoint
router.post('/', async (req, res) => {
  const { kullanici_adi, eposta, sifre, rol } = req.body;

  try {
    // 🔴 Zorunlu alanları kontrol et
    if (!kullanici_adi || !eposta || !sifre || !rol) {
      return res.status(400).json({ success: false, message: 'Zorunlu alanları doldurun' });
    }

    // 🔵 E-posta kontrolü
    const [existingUsers] = await pool.query(
      'SELECT id FROM kullanicilar WHERE eposta = ?',
      [eposta]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false,
        message: 'Bu e-posta zaten kayıtlı'
      });
    }

    // 🟢 Şifreyi hashle
    const hashedPassword = await bcrypt.hash(sifre, 10);
    
    // Kullanıcıyı ekle
    const [result] = await pool.query(
      `INSERT INTO kullanicilar 
      (kullanici_adi, eposta, sifre_hash, rol) 
      VALUES (?, ?, ?, ?)`,
      [kullanici_adi, eposta, hashedPassword, rol]
    );

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla kaydedildi',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası, lütfen tekrar deneyin.'
    });
  }
});

// 🟢 Giriş Endpoint
router.post('/login', async (req, res) => {
  const { eposta, sifre } = req.body;

  try {
    // 🔵 Kullanıcı sorgusu
    const [users] = await pool.query(
      'SELECT id, sifre_hash FROM kullanicilar WHERE eposta = ?',
      [eposta]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Kullanıcı bulunamadı' 
      });
    }

    const user = users[0];
    
    // 🟢 Şifre doğrulama
    const isPasswordValid = await bcrypt.compare(sifre, user.sifre_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Geçersiz şifre' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      userId: user.id
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası, lütfen tekrar deneyin.'
    });
  }
});

export default router;

