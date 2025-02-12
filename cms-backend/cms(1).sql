-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Anamakine: mysql
-- Üretim Zamanı: 12 Şub 2025, 18:59:57
-- Sunucu sürümü: 5.7.41
-- PHP Sürümü: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `cms`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `icerikler`
--

CREATE TABLE `icerikler` (
  `id` int(11) NOT NULL,
  `baslik` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icerik` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_baslik` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_aciklama` text COLLATE utf8mb4_unicode_ci,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `durum` enum('taslak','yayinda','arsiv') COLLATE utf8mb4_unicode_ci DEFAULT 'taslak',
  `yazar_id` int(11) DEFAULT NULL,
  `olusturulma_tarihi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `guncelleme_tarihi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `planlanan_tarih` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `icerikler`
--

INSERT INTO `icerikler` (`id`, `baslik`, `icerik`, `meta_baslik`, `meta_aciklama`, `slug`, `durum`, `yazar_id`, `olusturulma_tarihi`, `guncelleme_tarihi`, `planlanan_tarih`) VALUES
(5, 'Test İçerik Başlığı', 'Bu, test içeriğidir. API üzerinden gönderilmektedir.', 'Test Meta Başlık', 'Bu, test içeriğinin açıklamasıdır.', 'test-icerik-basligi-3uQ-NY', 'yayinda', 1, '2025-02-12 18:41:20', '2025-02-12 18:41:28', NULL),
(6, 'Test İçerik Başlığı taslaka meta_aciklama', 'Bu, test içeriğidir. API üzerinden gönderilmektedir.', 'Test Meta Başlık taslak11', 'Bu, test içeriğinin açıklamasıdır.1.taslak', 'test-icerik-basligi-taslaka-meta-aciklama-Rs0N6T', 'taslak', 1, '2025-02-12 18:44:32', '2025-02-12 18:44:32', NULL),
(8, 'Test İçerik Başlığı taslaka meta_aciklama', 'Bu, test içeriğidir. API üzerinden gönderilmektedir.', 'Test Meta Başlık taslak11', 'Bu, test içeriğinin açıklamasıdır.1.taslak', 'test-icerik-basligi-taslaka-meta-aciklama-GfyDhQ', 'taslak', 1, '2025-02-12 18:44:43', '2025-02-12 18:44:43', NULL);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `icerik_onaylari`
--

CREATE TABLE `icerik_onaylari` (
  `id` int(11) NOT NULL,
  `icerik_id` int(11) DEFAULT NULL,
  `onaylayan_id` int(11) DEFAULT NULL,
  `durum` enum('beklemede','onaylandi','reddedildi') COLLATE utf8mb4_unicode_ci DEFAULT 'beklemede',
  `yorumlar` text COLLATE utf8mb4_unicode_ci,
  `olusturulma_tarihi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `guncelleme_tarihi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `icerik_onaylari`
--

INSERT INTO `icerik_onaylari` (`id`, `icerik_id`, `onaylayan_id`, `durum`, `yorumlar`, `olusturulma_tarihi`, `guncelleme_tarihi`) VALUES
(4, 5, NULL, 'onaylandi', NULL, '2025-02-12 18:41:20', '2025-02-12 18:41:28'),
(5, 6, NULL, 'beklemede', NULL, '2025-02-12 18:44:32', '2025-02-12 18:44:32'),
(6, 8, NULL, 'beklemede', NULL, '2025-02-12 18:44:43', '2025-02-12 18:44:43');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kullanicilar`
--

CREATE TABLE `kullanicilar` (
  `id` int(11) NOT NULL,
  `kullanici_adi` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `eposta` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sifre_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','editor') COLLATE utf8mb4_unicode_ci NOT NULL,
  `olusturulma_tarihi` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `kullanicilar`
--

INSERT INTO `kullanicilar` (`id`, `kullanici_adi`, `eposta`, `sifre_hash`, `rol`, `olusturulma_tarihi`) VALUES
(1, 'testkullanici', 'test@example.com', '$2a$10$TxJ/aHFFGdIu9mqJ9ZR97OerL/I7Sr6RFiQ1N.TUsnNAQkZCBnkse', 'editor', '2025-02-08 19:01:11');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `icerikler`
--
ALTER TABLE `icerikler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `yazar_id` (`yazar_id`);

--
-- Tablo için indeksler `icerik_onaylari`
--
ALTER TABLE `icerik_onaylari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `icerik_id` (`icerik_id`),
  ADD KEY `onaylayan_id` (`onaylayan_id`);

--
-- Tablo için indeksler `kullanicilar`
--
ALTER TABLE `kullanicilar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `eposta` (`eposta`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `icerikler`
--
ALTER TABLE `icerikler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `icerik_onaylari`
--
ALTER TABLE `icerik_onaylari`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `kullanicilar`
--
ALTER TABLE `kullanicilar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `icerikler`
--
ALTER TABLE `icerikler`
  ADD CONSTRAINT `icerikler_ibfk_1` FOREIGN KEY (`yazar_id`) REFERENCES `kullanicilar` (`id`) ON DELETE SET NULL;

--
-- Tablo kısıtlamaları `icerik_onaylari`
--
ALTER TABLE `icerik_onaylari`
  ADD CONSTRAINT `icerik_onaylari_ibfk_1` FOREIGN KEY (`icerik_id`) REFERENCES `icerikler` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `icerik_onaylari_ibfk_2` FOREIGN KEY (`onaylayan_id`) REFERENCES `kullanicilar` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
