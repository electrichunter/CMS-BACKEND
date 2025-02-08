import express from 'express';
import pool from '../../config/dbConfig.js';
// import bcrypt from 'bcryptjs'; // Şimdilik yorum satırı

const router = express.Router();

// Kayıt Endpoint
router.post('/', async (req, res) => {
  const { kullanici_adi, eposta, sifre_hash, rol } = req.body;

  try {
    // Validasyon
    if (!kullanici_adi || !eposta || !sifre_hash || !rol) {
      return res.status(400).json({ success: false, message: 'Zorunlu alanları doldurun' });
    }

    // E-posta kontrolü
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

    // Şimdilik hash kullanmadan direkt kayıt
    // const hashedPassword = await bcrypt.hash(sifre_hash, 10);
    
    const [result] = await pool.query(
      `INSERT INTO kullanicilar 
      (kullanici_adi, eposta, sifre_hash, rol) 
      VALUES (?, ?, ?, ?)`,
      [kullanici_adi, eposta, sifre_hash /* hashedPassword yerine direkt sifre_hash */, rol]
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
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

// Giriş Endpoint
router.post('/login', async (req, res) => {
  const { eposta, sifre_hash } = req.body;

  try {
    // Kullanıcı sorgusu
    const [users] = await pool.query(
      'SELECT id, kullanici_adi, eposta, sifre_hash, rol FROM kullanicilar WHERE eposta = ?',
      [eposta]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Kullanıcı bulunamadı' 
      });
    }

    const user = users[0];
    
    // Şimdilik direkt string karşılaştırma
    // const isPasswordValid = await bcrypt.compare(sifre_hash, user.sifre_hash);
    const isPasswordValid = (sifre_hash === user.sifre_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Geçersiz şifre' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        kullanici_adi: user.kullanici_adi,
        eposta: user.eposta,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
});

export default router;