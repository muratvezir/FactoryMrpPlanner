# 🏭 Factory MRP Planner

Fabrika malzeme ihtiyaç planlaması (MRP) sistemi. AI destekli karar desteği ve modern dashboard ile.

## 🚀 Özellikler

- **Multi-level BOM Explosion** - Çok seviyeli reçete patlatma
- **Lot Sizing** - Minimum sipariş miktarına göre yuvarlama
- **Backward Scheduling** - Geriye dönük zamanlama
- **Pegging** - İzlenebilirlik (hangi sipariş için üretildi?)
- **Scrap Rate** - Fire oranı desteği
- **AI Advisor** - OpenAI ile stratejik analiz

## 📁 Proje Yapısı

```
src/
├── Mrp.Core/           # Domain entities
├── Mrp.Engine/         # MRP algoritması
├── Mrp.AI/             # OpenAI entegrasyonu
├── Mrp.Infrastructure/ # EF Core
└── Mrp.Api/            # ASP.NET Core API
```

## 🔧 Kurulum

```bash
dotnet restore
dotnet build
dotnet run --project src/Mrp.Api
```

## 📡 API

- `POST /api/planning/calculate` - MRP hesaplama
- `POST /api/planning/validate` - Veri doğrulama

## 📄 Lisans

MIT
