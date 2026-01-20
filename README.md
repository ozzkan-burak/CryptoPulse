# ⚡ CryptoPulse: Real-Time Market Monitor

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![React](https://img.shields.io/badge/React-18-blue)
![SignalR](https://img.shields.io/badge/SignalR-Realtime-red)
![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-green)

**CryptoPulse**, yüksek frekanslı finansal verilerin (High-Frequency Data) son kullanıcıya **milisaniyeler içinde** ve **sıfır gecikme (zero-latency)** hedefiyle aktarılmasını simüle eden bir Ar-Ge laboratuvar projesidir.

Bu proje, klasik HTTP Request/Response döngüsü yerine **WebSocket (SignalR)** teknolojisini kullanarak, borsadaki anlık fiyat değişimlerini canlı olarak görselleştirir.

## Mimari Yaklaşım

Proje, "Event-Driven" (Olay Güdümlü) mimari prensipleriyle tasarlanmıştır. Amaç, **Doherty Eşiği (400ms)** altındaki tepki sürelerini yakalamaktır.

1.  **Backend (Producer):** .NET 8 üzerinde koşan bir `BackgroundService`, dış dünyadan (veya simülasyon motorundan) aldığı fiyat verilerini işler.
2.  **Broadcaster (Hub):** SignalR Hub, bağlı olan binlerce istemciye aynı anda "Push" model ile veriyi iter.
3.  **Frontend (Consumer):** React uygulaması, WebSocket üzerinden gelen veriyi yakalar ve UI üzerinde "Optimistic UI" prensipleriyle günceller.

## Teknoloji Yığını (Tech Stack)

- **Backend:** .NET 8 Web API
- **Real-time Communication:** SignalR (WebSockets)
- **Frontend:** React (Vite) + TypeScript
- **State Management:** React Hooks
- **Styling:** Tailwind CSS (Performance-first)
- **Simulation:** Random Walk Algorithm (Fiyat simülasyonu için)

## Proje Yapısı

    CryptoPulse/
    ├── backend/                # .NET 8 Web API & SignalR Hub
    │   ├── Hubs/               # WebSocket bağlantı noktaları
    │   ├── Services/           # Fiyat simülasyon servisleri
    │   └── Program.cs          # Dependency Injection & Config
    ├── frontend/               # React + TypeScript UI
    │   ├── src/
    │   │   ├── components/     # Ticker, Chart bileşenleri
    │   │   ├── hooks/          # useSignalR gibi custom hook'lar
    │   │   └── services/       # Bağlantı yönetimi
    │   └── tailwind.config.js
    └── README.md               # Proje Dokümantasyonu

## ⚡ Özellikler

- **Gerçek Zamanlı Veri Akışı:** Sayfa yenilemeden (No-Refresh) canlı fiyat takibi.
- **Görsel Volatilite İndikatörleri:** Fiyat arttığında yeşil, düştüğünde kırmızı anlık tepkiler.
- **Bağlantı Durum Yönetimi:** Otomatik yeniden bağlanma (Auto-reconnect) ve bağlantı koptu uyarıları.
- **Düşük Gecikme (Low Latency):** Backend -> Frontend veri iletiminde <50ms hedefi.

## Kurulum (Local Development)

Projeyi yerel ortamınızda çalıştırmak için:

### 1. Backend'i Ayağa Kaldır

    cd backend
    dotnet restore
    dotnet run

_API http://localhost:5000 adresinde çalışmaya başlayacaktır._

### 2. Frontend'i Başlat

Yeni bir terminal açın:

    cd frontend
    npm install
    npm run dev

_Arayüz http://localhost:5173 adresinde açılacaktır._

## Ekran Görüntüleri

_(Proje tamamlandığında buraya GIF eklenecek)_

---

_Bu proje, Yüksek Trafikli Sistemler (High Scalability) üzerine yapılan kişisel bir laboratuvar çalışmasıdır._
