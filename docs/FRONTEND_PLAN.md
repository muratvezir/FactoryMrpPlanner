# 🏭 Factory MRP Planner - Frontend Geliştirme Planı

Bu döküman, Factory MRP Planner projesinin frontend arayüzü için gerekli olan sayfaları, özellikleri ve geliştirme yol haritasını içerir.

## 📅 Milestones

### 1. Temel Malzeme Yönetimi (v1.1)
Malzeme kartlarının oluşturulması, listelenmesi ve Reçete (BOM) yapısının görsel olarak yönetilmesi.

### 2. Sipariş Yönetimi (v1.2)
Müşteri siparişlerinin sisteme girilmesi ve takibi.

### 3. MRP & Planlama (v1.3)
Malzeme İhtiyaç Planlaması (MRP) motorunun tetiklenmesi ve oluşan Satınalma/Üretim emirlerinin görüntülenmesi.

---

## 📝 Sayfa Listesi ve Gereksinimler

### 1. Dashboard (`/`)
- **Durum:** ✅ Mevcut (Geliştirilecek)
- **Özellikler:**
  - Toplam malzeme, sipariş ve üretim durumu özet kartları.
  - Son aktiviteler akışı.
  - Kritik stok uyarıları.

### 2. Malzeme Yönetimi (`/materials`)
#### a. Malzeme Listesi (`/materials`)
- **Durum:** 🚧 Geliştirme Aşamasında
- **Özellikler:**
  - Tüm malzemelerin tablo görünümü.
  - Arama (Kod/İsim) ve Filtreleme (Tip: Hammadde/Yarı Mamul/Mamul).
  - Stok durumu ve birim bilgileri.
  - "Yeni Malzeme Ekle" butonu.

#### b. Malzeme Detayı ve BOM (`/materials/:code`)
- **Durum:** ❌ Eksik
- **Özellikler:**
  - Malzeme genel bilgileri (Stok, Temin Süresi, vb.) düzenleme formu.
  - **BOM (Reçete) Ağacı:** Bu ürünün alt bileşenlerini ağaç yapısında gösterme ve düzenleme.
  - Alt bileşen ekleme/çıkarma.

### 3. Sipariş Yönetimi (`/orders`)
#### a. Sipariş Listesi (`/orders`)
- **Durum:** ❌ Eksik
- **Özellikler:**
  - Müşteri siparişlerinin listesi.
  - Durum filtresi (Açık/Kapalı/Üretimde).
  - Teslim tarihi takibi.

#### b. Sipariş Detayı (`/orders/:id`)
- **Durum:** ❌ Eksik
- **Özellikler:**
  - Sipariş kalemleri ve miktarları.
  - Müşteri bilgileri.

### 4. Planlama (`/planning`)
#### a. Planlama Paneli (`/planning`)
- **Durum:** 🚧 Taslak Mevcut
- **Özellikler:**
  - MRP motorunu çalıştırma butonu.
  - Planlama parametreleri (Başlangıç tarihi, ufuk, vb.).
  - Son hesaplama özeti.

#### b. Planlama Sonuçları (`/planning/results`)
- **Durum:** ❌ Eksik
- **Özellikler:**
  - **Satınalma Önerileri:** Hammadde ihtiyaçları listesi.
  - **Üretim Emirleri:** Yarı mamul ve mamul üretim planı.
  - Gantt şeması veya zaman çizelgesi (Opsiyonel).

### 5. Ayarlar (`/settings`)
- **Durum:** ❌ Eksik
- **Özellikler:**
  - API bağlantı ayarları.
  - Kullanıcı tercihleri.

---

## 🛠️ Teknik Gereksinimler

- **UI Kit:** Tailwind CSS v4 + Lucide Icons.
- **State Management:** React Context veya Zustand.
- **Data Fetching:** Axios.
- **Form Handling:** React Hook Form (Önerilen).
- **Tablolar:** TanStack Table (Gelişmiş tablolar için).
