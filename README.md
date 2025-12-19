# 🏭 Factory MRP Planner

Yapay zeka destekli, modern ve yüksek performanslı Malzeme İhtiyaç Planlama (MRP) sistemi.

## 🚀 Özellikler

- **MRP Engine**: Çok seviyeli BOM, Pegging, Lot Sizing, Fire Oranı ve Geriye Dönük Çizelgeleme.
- **Finite Capacity Planning**: Google OR-Tools ile makine kapasite kısıtlı çizelgeleme.
- **AI Advisor**: OpenAI (GPT-4) entegrasyonu ile plan risk analizi ve öneriler.
- **Modern Dashboard**: Vite + React, Tailwind CSS v4 ve Lucide Icons ile geliştirilmiş arayüz.
- **Infrastructure**: SQL Server (veya PostgreSQL) veritabanı, Entity Framework Core ve Docker Compose desteği.

## 📁 Proje Mimarisi

- `src/Mrp.Core`: Domain varlıkları ve Enumlar.
- `src/Mrp.Engine`: Saf C# ile yazılmış MRP hesaplama motoru.
- `src/Mrp.Optimization`: OR-Tools ile Constraint Programming (CP-SAT) çözücü.
- `src/Mrp.AI`: Azure OpenAI SDK entegrasyonu.
- `src/Mrp.Infrastructure`: Veritabanı (EF Core) ve Repository katmanı.
- `src/Mrp.Api`: ASP.NET Core Web API.
- `frontend/`: Vite + React Web Uygulaması.

## Veritabanı Yapılandırması

Proje varsayılan olarak **SQL Server** kullanacak şekilde yapılandırılmıştır, ancak **PostgreSQL** desteği de mevcuttur.

### 1. Veritabanı Seçimi
Veritabanı sağlayıcısını `src/Mrp.Api/appsettings.json` dosyasındaki `DatabaseProvider` ayarı ile değiştirebilirsiniz:

- **SQL Server (Varsayılan):** `"DatabaseProvider": "SqlServer"`
- **PostgreSQL:** `"DatabaseProvider": "PostgreSQL"`

### 2. Bağlantı Bilgileri
`src/Mrp.Api/appsettings.json` dosyasındaki `ConnectionStrings` bölümünü kendi sunucu bilgilerinize göre güncelleyin:

**SQL Server Örneği:**
```json
"ConnectionStrings": {
  "SqlServerConnection": "Server=LOCALHOST;Database=FactoryMrp;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

**PostgreSQL Örneği:**
```json
"ConnectionStrings": {
  "PostgreConnection": "Host=localhost;Port=5432;Database=FactoryMrp;Username=postgres;Password=postgres"
}
```

## 🛠️ Kurulum (Docker ile)

En kolay yöntem Docker kullanmaktır.

1. `.env` dosyası oluşturun veya `src/Mrp.Api/appsettings.json` içine OpenAI API Key'inizi girin (Opsiyonel).
2. Sistemi başlatın:

```bash
docker-compose up -d --build
```

- **API & Swagger**: [http://localhost:5260/swagger](http://localhost:5260/swagger)

## 🛠️ Kurulum (Development)

### Backend
1. PostgreSQL veritabanının çalıştığından emin olun (veya ConnectionString'i güncelleyin).
2. API'yi başlatın:
```bash
dotnet run --project src/Mrp.Api
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Dashboard: [http://localhost:3000](http://localhost:3000)

## 📡 API Endpointleri

- **Planning**
  - `POST /api/planning/calculate`: Standart MRP hesaplaması.
  - `POST /api/planning/analyze`: AI destekli analiz.
  - `POST /api/planning/validate`: Veri seti validasyonu.
- **Materials**
  - CRUD işlemleri (`GET`, `POST`, `PUT`...)
- **Orders**
  - Sipariş yönetimi.

## 🧪 Testler

```bash
dotnet test
```

## 📄 Lisans

MIT
